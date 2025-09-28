from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
from prophet import Prophet
import joblib
import requests
from apscheduler.schedulers.background import BackgroundScheduler
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to allow frontend requests

# Global models dict
models = {}
models_dir = 'models'
if os.path.exists(models_dir):
    for file in os.listdir(models_dir):
        if file.endswith('_prophet_model.joblib'):
            district = file.replace('_prophet_model.joblib', '').lower()
            models[district] = joblib.load(os.path.join(models_dir, file))

def fetch_weather(lat, lon):
    """
    Fetch weather data from Open-Meteo API for next 7 days.
    Returns average precipitation_sum and temperature_2m_max.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=precipitation_sum,temperature_2m_max&forecast_days=7&timezone=Asia/Kolkata"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            precip = data['daily']['precipitation_sum']
            temp = data['daily']['temperature_2m_max']
            avg_precip = sum(precip) / len(precip) if precip else 0
            avg_temp = sum(temp) / len(temp) if temp else 0
            return avg_precip, avg_temp
        else:
            return 0, 0  # Default if API fails
    except:
        return 0, 0

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('groundwater.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database with sample data
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Drop existing tables to ensure correct schema
    cursor.execute('DROP TABLE IF EXISTS water_levels')
    cursor.execute('DROP TABLE IF EXISTS stations')
    cursor.execute('DROP TABLE IF EXISTS predictions')

    # Create stations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            city TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL
        )
    ''')

    # Create water_levels table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS water_levels (
            id INTEGER PRIMARY KEY,
            station_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            water_level REAL NOT NULL,
            recharge_pattern TEXT,
            FOREIGN KEY (station_id) REFERENCES stations (id)
        )
    ''')

    # Create predictions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY,
            station_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            predicted_level REAL NOT NULL,
            FOREIGN KEY (station_id) REFERENCES stations (id)
        )
    ''')

    # Create alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY,
            station_id INTEGER NOT NULL,
            alert_level TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            resolved INTEGER DEFAULT 0,
            FOREIGN KEY (station_id) REFERENCES stations (id)
        )
    ''')

    # Create alert_thresholds table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alert_thresholds (
            id INTEGER PRIMARY KEY,
            station_id INTEGER,
            role TEXT,
            normal_max REAL DEFAULT 50,
            warning_max REAL DEFAULT 100,
            critical_max REAL DEFAULT 200,
            emergency_min REAL DEFAULT 200,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(station_id, role)
        )
    ''')

    # Insert default global thresholds for each role (station_id NULL)
    default_thresholds = [
        (None, 'farmer', 50, 100, 200, 200),
        (None, 'stakeholder', 50, 100, 200, 200),
        (None, 'policymaker', 50, 100, 200, 200),
        (None, 'planner', 50, 100, 200, 200)
    ]
    cursor.executemany('''
        INSERT OR IGNORE INTO alert_thresholds (station_id, role, normal_max, warning_max, critical_max, emergency_min)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', default_thresholds)

    # Generate initial alerts for all stations using policymaker role
    for station_id in range(1, 21):
        # Get latest prediction
        pred_row = cursor.execute('''
            SELECT predicted_level FROM predictions WHERE station_id = ? ORDER BY date DESC LIMIT 1
        ''', (station_id,)).fetchone()
        if pred_row:
            predicted_level = pred_row['predicted_level']
            alert_level = get_alert_status(station_id, 'policymaker', predicted_level)
            message = f"Initial alert for station {station_id}: Level {predicted_level:.2f}m bgl - {alert_level.upper()}"
            timestamp = datetime.now().isoformat()
            cursor.execute('''
                INSERT OR IGNORE INTO alerts (station_id, alert_level, message, timestamp)
                VALUES (?, ?, ?, ?)
            ''', (station_id, alert_level, message, timestamp))

    # Insert sample stations (expanded to 20)
    stations = [
        (1, 'Delhi DWLR Station', 'Delhi', 'New Delhi', 'Delhi', 28.7041, 77.1025),
        (2, 'Mumbai DWLR Station', 'Maharashtra', 'Mumbai', 'Mumbai', 19.076, 72.8777),
        (3, 'Bengaluru DWLR Station', 'Karnataka', 'Bengaluru', 'Bengaluru', 12.9716, 77.5946),
        (4, 'Chennai DWLR Station', 'Tamil Nadu', 'Chennai', 'Chennai', 13.0827, 80.2707),
        (5, 'Kolkata DWLR Station', 'West Bengal', 'Kolkata', 'Kolkata', 22.5726, 88.3639),
        (6, 'Hyderabad DWLR Station', 'Telangana', 'Hyderabad', 'Hyderabad', 17.3850, 78.4867),
        (7, 'Pune DWLR Station', 'Maharashtra', 'Pune', 'Pune', 18.5204, 73.8567),
        (8, 'Ahmedabad DWLR Station', 'Gujarat', 'Ahmedabad', 'Ahmedabad', 23.0225, 72.5714),
        (9, 'Jaipur DWLR Station', 'Rajasthan', 'Jaipur', 'Jaipur', 26.9124, 75.7873),
        (10, 'Lucknow DWLR Station', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 26.8467, 80.9462),
        (11, 'Kanpur DWLR Station', 'Uttar Pradesh', 'Kanpur', 'Kanpur', 26.4499, 80.3319),
        (12, 'Nagpur DWLR Station', 'Maharashtra', 'Nagpur', 'Nagpur', 21.1458, 79.0882),
        (13, 'Indore DWLR Station', 'Madhya Pradesh', 'Indore', 'Indore', 22.7196, 75.8577),
        (14, 'Bhopal DWLR Station', 'Madhya Pradesh', 'Bhopal', 'Bhopal', 23.2599, 77.4126),
        (15, 'Patna DWLR Station', 'Bihar', 'Patna', 'Patna', 25.5941, 85.1376),
        (16, 'Vadodara DWLR Station', 'Gujarat', 'Vadodara', 'Vadodara', 22.3072, 73.1812),
        (17, 'Coimbatore DWLR Station', 'Tamil Nadu', 'Coimbatore', 'Coimbatore', 11.0168, 76.9558),
        (18, 'Kochi DWLR Station', 'Kerala', 'Ernakulam', 'Kochi', 9.9312, 76.2673),
        (19, 'Visakhapatnam DWLR Station', 'Andhra Pradesh', 'Visakhapatnam', 'Visakhapatnam', 17.6868, 83.2185),
        (20, 'Agra DWLR Station', 'Uttar Pradesh', 'Agra', 'Agra', 27.1767, 78.0081)
    ]
    cursor.executemany('INSERT OR IGNORE INTO stations VALUES (?, ?, ?, ?, ?, ?, ?)', stations)

    cursor.execute('DELETE FROM water_levels')

    # Load real historical data from CSV
    df = pd.read_csv('data/cgwb_historical.csv')
    mapping = {
        'bengaluru': 3,
        'mumbai': 2,
        'new delhi': 1,
        'delhi': 1,
        'chennai': 4,
        'kolkata': 5,
        'hyderabad': 6,
        'pune': 7,
        'ahmedabad': 8,
        'jaipur': 9,
        'lucknow': 10,
        'kanpur': 11,
        'nagpur': 12,
        'indore': 13,
        'bhopal': 14,
        'patna': 15,
        'vadodara': 16,
        'coimbatore': 17,
        'kochi': 18,
        'ernakulam': 18,
        'visakhapatnam': 19,
        'agra': 20,
    }
    for _, row in df.iterrows():
        dist_lower = str(row['District']).lower().strip()
        if dist_lower in mapping:
            station_id = mapping[dist_lower]
            date = row['Date']
            water_level = float(row['Water_Level_m_bgl'])
            pattern = str(row['Recharge_Pattern'])
            cursor.execute('INSERT INTO water_levels (station_id, date, water_level, recharge_pattern) VALUES (?, ?, ?, ?)',
                           (station_id, date, water_level, pattern))

    # Generate initial predictions for each station
    for station_id in range(1, 21):
        district_row = cursor.execute('SELECT district FROM stations WHERE id = ?', (station_id,)).fetchone()
        if not district_row:
            continue
        district = district_row['district'].lower()
        levels = cursor.execute('SELECT date, water_level FROM water_levels WHERE station_id = ? ORDER BY date', (station_id,)).fetchall()
        if len(levels) < 3:
            continue
        if district in models:
            model = models[district]
            hist_df = pd.DataFrame([{'ds': pd.to_datetime(r['date']), 'y': r['water_level']} for r in levels])
            last_date = hist_df['ds'].max()
            future_date = last_date + pd.DateOffset(months=1)
            future_df = pd.DataFrame({'ds': [future_date]})
            future_df['precipitation_sum'] = 0  # default for initial
            forecast = model.predict(future_df)
            pred_level = forecast['yhat'].iloc[0]
            cursor.execute('INSERT INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                           (station_id, future_date.strftime('%Y-%m-%d'), pred_level))
        else:
            # Fallback to linear regression
            levels_desc = cursor.execute('SELECT date, water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 12', (station_id,)).fetchall()
            if len(levels_desc) < 2:
                continue
            data = [(pd.to_datetime(r['date']), r['water_level']) for r in levels_desc]
            data.sort(key=lambda x: x[0])
            X = np.array([(d[0] - data[0][0]).days for d in data]).reshape(-1, 1)
            y = np.array([d[1] for d in data])
            lr_model = LinearRegression()
            lr_model.fit(X, y)
            next_date = data[-1][0] + pd.DateOffset(months=1)
            days_diff = (next_date - data[0][0]).days
            predicted_level = lr_model.predict([[days_diff]])[0]
            cursor.execute('INSERT INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                           (station_id, next_date.strftime('%Y-%m-%d'), predicted_level))

    conn.commit()
    conn.close()

# API Endpoints

def get_alert_status(station_id, role, predicted_level):
    """
    Get alert level based on role/station-specific thresholds from DB.
    """
    conn = get_db_connection()
    threshold_row = conn.execute('''
        SELECT normal_max, warning_max, critical_max, emergency_min
        FROM alert_thresholds
        WHERE (station_id = ? OR station_id IS NULL) AND role = ?
        ORDER BY CASE WHEN station_id = ? THEN 0 ELSE 1 END
        LIMIT 1
    ''', (station_id, role, station_id)).fetchone()
    conn.close()
    
    if not threshold_row:
        # Fallback to defaults
        normal_max = 50
        warning_max = 100
        critical_max = 200
        emergency_min = 200
    else:
        normal_max = threshold_row['normal_max']
        warning_max = threshold_row['warning_max']
        critical_max = threshold_row['critical_max']
        emergency_min = threshold_row['emergency_min']
    
    if predicted_level <= normal_max:
        return 'normal'
    elif predicted_level <= warning_max:
        return 'warning'
    elif predicted_level <= critical_max:
        return 'critical'
    else:
        return 'emergency'

def get_recharge_pattern(station_id):
    """
    Get the latest recharge pattern from database.
    """
    conn = get_db_connection()
    pattern_row = conn.execute('SELECT recharge_pattern FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 1', (station_id,)).fetchone()
    conn.close()
    return pattern_row['recharge_pattern'] if pattern_row else 'Normal'

def get_status(pattern):
    """
    Map recharge pattern to status: Low->warning, Normal->normal, Warning->warning, Critical->critical.
    """
    if pattern == 'Normal':
        return 'normal'
    elif pattern in ['Low', 'Warning']:
        return 'warning'
    elif pattern == 'Critical':
        return 'critical'
    else:
        return 'unknown'

@app.route('/stations', methods=['GET'])
def get_stations():
    """
    Returns list of all stations with latest water level, alert status, lat/lon, recharge_pattern, status.
    Supports optional filtering by region, state, or district via query params.
    Supports role-based filtering: farmer (hide predictions/recharge), stakeholder (levels+alerts), policymaker/planner (full).
    """
    region = request.args.get('region')
    state = request.args.get('state')
    district = request.args.get('district')
    role = request.args.get('role', 'policymaker')  # Default to full access

    conn = get_db_connection()
    query = 'SELECT id, name, state, district, city, latitude, longitude FROM stations'
    filters = []
    params = []

    if region:
        filters.append('state = ?')
        params.append(region)
    if state:
        filters.append('state = ?')
        params.append(state)
    if district:
        filters.append('district = ?')
        params.append(district)

    if filters:
        query += ' WHERE ' + ' AND '.join(filters)

    stations = conn.execute(query, params).fetchall()

    result = []
    for station in stations:
        latest_level_row = conn.execute('''
            SELECT water_level FROM water_levels
            WHERE station_id = ?
            ORDER BY date DESC LIMIT 1
        ''', (station['id'],)).fetchone()
        latest_level = latest_level_row['water_level'] if latest_level_row else None

        # Get latest prediction from DB
        latest_pred_row = conn.execute('''
            SELECT predicted_level FROM predictions
            WHERE station_id = ?
            ORDER BY date DESC LIMIT 1
        ''', (station['id'],)).fetchone()
        predicted_level = latest_pred_row['predicted_level'] if latest_pred_row else None

        alert = get_alert_status(station['id'], role, predicted_level) if predicted_level is not None else 'unknown'
        recharge_pattern = get_recharge_pattern(station['id'])
        status = get_status(recharge_pattern)

        station_data = {
            "id": station['id'],
            "name": station['name'],
            "state": station['state'],
            "district": station['district'],
            "city": station['city'],
            "latitude": station['latitude'],
            "longitude": station['longitude'],
            "water_level": latest_level,
            "status": status
        }

        if role in ['policymaker', 'planner']:
            # Full access
            station_data.update({
                "recharge_pattern": recharge_pattern,
                "predicted_level": predicted_level,
                "alert": alert
            })
        elif role == 'stakeholder':
            # Levels + alerts
            station_data.update({
                "predicted_level": predicted_level,
                "alert": alert
            })
        # For farmer: only basics (water_level, status); hide predictions/recharge/alert

        result.append(station_data)

    conn.close()
    return jsonify(result)

@app.route('/stations-map', methods=['GET'])
def get_stations_map():
    """
    Returns all stations with id, name, latitude, longitude, latest water level, and alert status.
    Used for map pins and hover info.
    """
    conn = get_db_connection()
    stations = conn.execute('SELECT id, name, latitude, longitude FROM stations').fetchall()

    result = []
    for station in stations:
        latest_level_row = conn.execute('''
            SELECT water_level FROM water_levels
            WHERE station_id = ?
            ORDER BY date DESC LIMIT 1
        ''', (station['id'],)).fetchone()
        latest_level = latest_level_row['water_level'] if latest_level_row else None

        prediction_resp = predict_water_level(station['id'])
        if prediction_resp.status_code == 200:
            predicted_level = prediction_resp.get_json().get('predicted_level', None)
        else:
            predicted_level = None

        alert = get_alert_status(station['id'], 'policymaker', predicted_level) if predicted_level is not None else 'unknown'

        result.append({
            "id": station['id'],
            "name": station['name'],
            "latitude": station['latitude'],
            "longitude": station['longitude'],
            "latest_level": latest_level,
            "alert": alert
        })

    conn.close()
    return jsonify(result)


@app.route('/alerts/<int:station_id>', methods=['GET'])
def get_station_alert(station_id):
    """
    Returns the latest alert for a station, including trend summary.
    """
    conn = get_db_connection()
    # Get latest alert from DB
    latest_alert = conn.execute('''
        SELECT * FROM alerts WHERE station_id = ? ORDER BY timestamp DESC LIMIT 1
    ''', (station_id,)).fetchone()
    
    if latest_alert:
        # Calculate trend: last 7 days change
        trends = conn.execute('''
            SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 7
        ''', (station_id,)).fetchall()
        if len(trends) >= 2:
            trend_delta = trends[0]['water_level'] - trends[-1]['water_level']
            trend_msg = f"Level {'rising' if trend_delta > 0 else 'dropping'} by {abs(trend_delta):.2f}m in 7 days"
        else:
            trend_msg = "Insufficient data for trend"
        
        alert_data = dict(latest_alert)
        alert_data['trend'] = trend_msg
        conn.close()
        return jsonify(alert_data)
    
    # Generate new alert if none exists
    prediction_resp = predict_water_level(station_id)
    if prediction_resp.status_code != 200:
        conn.close()
        return prediction_resp
    
    predicted_level = prediction_resp.get_json()['predicted_level']
    alert_level = get_alert_status(station_id, 'policymaker', predicted_level)
    messages = {
        'normal': 'Groundwater levels are stable.',
        'warning': 'Monitor levels closely; approaching caution threshold.',
        'critical': 'Immediate attention required; levels critically low.',
        'emergency': 'Emergency: Severe depletion detected; restrict usage.'
    }
    message = messages.get(alert_level, 'Unknown alert level')
    timestamp = datetime.now().isoformat()
    
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO alerts (station_id, alert_level, message, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (station_id, alert_level, message, timestamp))
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': cursor.lastrowid,
        'station_id': station_id,
        'alert_level': alert_level,
        'message': message,
        'timestamp': timestamp,
        'resolved': 0,
        'trend': 'Initial alert generated'
    })


@app.route('/notify', methods=['POST'])
def notify_user():
    """
    Send notification for a station alert (mock SMS/console log).
    """
    data = request.json
    if not data or 'station_id' not in data or 'user_id' not in data or 'role' not in data:
        return jsonify({'error': 'Missing required fields: station_id, user_id, role'}), 400
    
    station_id = data['station_id']
    user_id = data['user_id']
    role = data['role']
    
    prediction_resp = predict_water_level(station_id)
    if prediction_resp.status_code != 200:
        return prediction_resp
    
    predicted_level = prediction_resp.get_json()['predicted_level']
    alert_level = get_alert_status(station_id, role, predicted_level)
    messages = {
        'normal': f'Update for station {station_id}: Levels normal at {predicted_level:.2f}m bgl.',
        'warning': f'Alert for station {station_id}: Warning level at {predicted_level:.2f}m bgl.',
        'critical': f'Critical alert for station {station_id}: {predicted_level:.2f}m bgl - Take action!',
        'emergency': f'Emergency for station {station_id}: {predicted_level:.2f}m bgl - Immediate response needed!'
    }
    message = messages.get(alert_level, f'Alert for station {station_id}: Level {predicted_level:.2f}m bgl')
    
    # Mock SMS - console log
    print(f"SMS/Push to user {user_id} (role: {role}): {message}")
    
    # Store in alerts
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO alerts (station_id, alert_level, message, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (station_id, alert_level, message, timestamp))
    conn.commit()
    alert_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'success': True,
        'alert_id': alert_id,
        'message': 'Notification sent (mocked)',
        'sent_to': user_id
    })


@app.route('/alerts/history/<int:station_id>', methods=['GET'])
def get_alerts_history(station_id):
    """
    Returns historical alerts for a station.
    """
    conn = get_db_connection()
    alerts = conn.execute('''
        SELECT * FROM alerts WHERE station_id = ? ORDER BY timestamp DESC
    ''', (station_id,)).fetchall()
    conn.close()
    result = [dict(alert) for alert in alerts]
    return jsonify({'station_id': station_id, 'history': result})


@app.route('/dashboard/<role>', methods=['GET'])
def get_dashboard_data(role):
    """
    Role-based dashboard data with tailored structures for frontend.
    """
    conn = get_db_connection()

    if role == 'farmer':
        user_lat = request.args.get('lat')
        user_lon = request.args.get('lon')
        if not user_lat or not user_lon:
            conn.close()
            return jsonify({'error': 'lat and lon required for farmer dashboard'}), 400

        # Find nearest station
        stations = conn.execute('SELECT id, name, latitude, longitude FROM stations').fetchall()
        nearest_station = min(stations, key=lambda s: abs(float(user_lat) - s['latitude']) + abs(float(user_lon) - s['longitude']))

        station_id = nearest_station['id']
        station_name = nearest_station['name']

        # Current water level
        latest_level_row = conn.execute('SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 1', (station_id,)).fetchone()
        current_level = latest_level_row['water_level'] if latest_level_row else None

        # Last 7 days trend
        trend_data = conn.execute('SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 7', (station_id,)).fetchall()
        trend = [row['water_level'] for row in reversed(trend_data)] if trend_data else []

        # Weather and irrigation advice
        precip_resp = fetch_weather(nearest_station['latitude'], nearest_station['longitude'])
        precip = precip_resp[0] if precip_resp else 0

        # Mock irrigation advice based on level and precipitation
        if current_level and current_level > 15 and precip > 15:
            advice = "Irrigate every 2-3 days, 20-30 liters per plant"
            crop_insights = ["Rice: High water requirement - monitor closely", "Wheat: Moderate water - good for current levels"]
        elif current_level and current_level > 10:
            advice = "Irrigate every 4-5 days, 15-25 liters per plant"
            crop_insights = ["Maize: Moderate water - suitable", "Sugarcane: High water - reduce frequency"]
        else:
            advice = "Delay irrigation 1-2 weeks, use drip irrigation, 10-15 liters per plant"
            crop_insights = ["Pulses: Low water - ideal", "Vegetables: Moderate water - careful monitoring needed"]

        # Real-time alerts
        alerts = []
        if current_level and current_level < 10:
            alerts.append("critical: Groundwater critically low - immediate conservation needed")
        elif current_level and current_level < 20:
            alerts.append("warning: Low groundwater levels - reduce usage")

        conn.close()
        return jsonify({
            "role": role,
            "stationId": station_id,
            "stationName": station_name,
            "currentLevel": current_level,
            "advice": advice,
            "trend": trend,
            "alerts": alerts,
            "cropInsights": crop_insights,
            "precipitation": round(precip, 2)
        })

    elif role == 'policymaker':
        # Regional aggregated trends
        regional_trends = conn.execute('''
            SELECT s.state, AVG(wl.water_level) as avg_level, COUNT(DISTINCT s.id) as station_count,
                   MIN(wl.water_level) as min_level, MAX(wl.water_level) as max_level
            FROM stations s
            JOIN water_levels wl ON s.id = wl.station_id
            GROUP BY s.state
        ''').fetchall()

        # Recharge forecast (mock: simple moving average)
        recharge_forecast = []
        for i in range(7):
            recharge_forecast.append(round(5 + i * 0.5, 2))  # Mock increasing trend

        # Alert summary by region
        alert_summary = conn.execute('''
            SELECT s.state, a.alert_level, COUNT(*) as count
            FROM alerts a
            JOIN stations s ON a.station_id = s.id
            GROUP BY s.state, a.alert_level
            ORDER BY s.state, a.alert_level
        ''').fetchall()

        # Station status for heatmap
        stations_status = conn.execute('''
            SELECT s.id, s.name, s.latitude, s.longitude,
                   (SELECT alert_level FROM alerts WHERE station_id = s.id ORDER BY timestamp DESC LIMIT 1) as status
            FROM stations s
        ''').fetchall()

        regional_data = [dict(row) for row in regional_trends]
        alert_data = [dict(row) for row in alert_summary]
        stations_data = [dict(row) for row in stations_status]

        conn.close()
        return jsonify({
            "role": role,
            "regionalTrends": regional_data,
            "rechargeForecast": recharge_forecast,
            "alertSummary": alert_data,
            "stationsStatus": stations_data
        })

    elif role == 'planner':
        scenario = request.args.get('scenario', 'normal')  # normal, drought, heavy_rainfall

        # Scenario modeling
        base_levels = conn.execute('SELECT water_level FROM water_levels ORDER BY date DESC LIMIT 30').fetchall()
        base_trend = [row['water_level'] for row in reversed(base_levels)]

        # Mock scenario adjustments
        if scenario == 'drought':
            simulated_trend = [level * 0.9 for level in base_trend]  # 10% reduction
            scenario_desc = "Drought scenario: 30% less rainfall"
        elif scenario == 'heavy_rainfall':
            simulated_trend = [level * 1.15 for level in base_trend]  # 15% increase
            scenario_desc = "Heavy rainfall scenario: 50% more rainfall"
        else:
            simulated_trend = base_trend
            scenario_desc = "Normal rainfall scenario"

        # 30-day availability forecast
        forecast_30d = []
        for i in range(30):
            forecast_30d.append(round(simulated_trend[-1] + i * 0.1, 2))  # Gradual increase

        conn.close()
        return jsonify({
            "role": role,
            "scenario": scenario,
            "scenarioDescription": scenario_desc,
            "historicalTrend": base_trend,
            "simulatedTrend": simulated_trend,
            "availabilityForecast": forecast_30d
        })

    elif role in ['stakeholder', 'researcher', 'ngo']:
        # All station data
        stations_data = conn.execute('''
            SELECT s.*, AVG(wl.water_level) as avg_level,
                   (SELECT alert_level FROM alerts WHERE station_id = s.id ORDER BY timestamp DESC LIMIT 1) as latest_alert
            FROM stations s
            LEFT JOIN water_levels wl ON s.id = wl.station_id
            GROUP BY s.id
        ''').fetchall()

        # Historical alerts per month (last 12 months)
        monthly_alerts = conn.execute('''
            SELECT strftime('%Y-%m', timestamp) as month, alert_level, COUNT(*) as count
            FROM alerts
            WHERE timestamp >= date('now', '-12 months')
            GROUP BY month, alert_level
            ORDER BY month DESC
        ''').fetchall()

        # Mock data export (in real app, would generate actual file)
        export_data = {
            "stations": [dict(row) for row in stations_data],
            "alerts": [dict(row) for row in monthly_alerts],
            "export_formats": ["csv", "json", "xlsx"]
        }

        stations_list = [dict(row) for row in stations_data]
        alerts_chart = [dict(row) for row in monthly_alerts]

        conn.close()
        return jsonify({
            "role": role,
            "stations": stations_list,
            "monthlyAlerts": alerts_chart,
            "exportData": export_data
        })

    else:
        conn.close()
        return jsonify({'error': 'Invalid role'}), 400

@app.route('/station/<int:station_id>/readings', methods=['GET'])
def get_station_readings(station_id):
    """
    Returns water level history for a station.
    Used for charts showing historical water-level trends.
    """
    conn = get_db_connection()
    water_levels = conn.execute('SELECT date, water_level FROM water_levels WHERE station_id = ? ORDER BY date',
                               (station_id,)).fetchall()
    conn.close()
    if not water_levels:
        return jsonify({'error': 'Station not found'}), 404
    history = [dict(level) for level in water_levels]
    return jsonify({"station_id": station_id, "history": history})

@app.route('/station/<int:station_id>/predict', methods=['GET'])
def predict_water_level(station_id):
    """
    Predicts next month's water level using Prophet model if available, else linear regression.
    Returns JSON with station_id, predicted_level, and weather forecast.
    """
    conn = get_db_connection()
    station_row = conn.execute('SELECT district, latitude, longitude FROM stations WHERE id = ?', (station_id,)).fetchone()
    conn.close()
    if not station_row:
        return jsonify({'error': 'Station not found'}), 404

    district = station_row['district'].lower()
    lat = station_row['latitude']
    lon = station_row['longitude']

    # Fetch weather forecast
    avg_precip, avg_temp = fetch_weather(lat, lon)

    # Get historical data
    conn = get_db_connection()
    levels = conn.execute('SELECT date, water_level FROM water_levels WHERE station_id = ? ORDER BY date', (station_id,)).fetchall()
    conn.close()

    if len(levels) < 3:
        return jsonify({'error': 'Not enough data for prediction'}), 400

    if district in models:
        model = models[district]
        hist_df = pd.DataFrame([{'ds': pd.to_datetime(r['date']), 'y': r['water_level']} for r in levels])
        last_date = hist_df['ds'].max()
        future_date = last_date + pd.DateOffset(months=1)
        future_df = pd.DataFrame({'ds': [future_date]})
        future_df['precipitation_sum'] = avg_precip
        forecast = model.predict(future_df)
        predicted_level = forecast['yhat'].iloc[0]

        # Adjust for recharge
        if avg_precip > 20:
            predicted_level *= 1.05

        # Store prediction
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT OR REPLACE INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                       (station_id, future_date.strftime('%Y-%m-%d'), predicted_level))
        conn.commit()
        conn.close()
    else:
        # Fallback to linear regression
        levels_desc = [r for r in levels][-12:]  # last 12
        data = [(pd.to_datetime(r['date']), r['water_level']) for r in levels_desc]
        data.sort(key=lambda x: x[0])
        X = np.array([(d[0] - data[0][0]).days for d in data]).reshape(-1, 1)
        y = np.array([d[1] for d in data])
        lr_model = LinearRegression()
        lr_model.fit(X, y)
        next_date = data[-1][0] + pd.DateOffset(months=1)
        days_diff = (next_date - data[0][0]).days
        predicted_level = lr_model.predict([[days_diff]])[0]

        # Store prediction
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT OR REPLACE INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                       (station_id, next_date.strftime('%Y-%m-%d'), predicted_level))
        conn.commit()
        conn.close()

    return jsonify({
        "station_id": station_id, 
        "predicted_level": round(predicted_level, 2), 
        "unit": "m bgl",
        "avg_precipitation": round(avg_precip, 2),
        "avg_temperature": round(avg_temp, 2)
    })

@app.route('/station/<int:station_id>/trends', methods=['GET'])
def get_station_trends(station_id):
    """
    Returns time-series data for last 30 days: date, water_level, recharge_estimation.
    Includes predicted future points from predictions table.
    Recharge estimation mocked as simple delta from previous day (positive=rising, negative=falling).
    """
    conn = get_db_connection()
    trends = conn.execute('''
        SELECT date, water_level FROM water_levels
        WHERE station_id = ?
        ORDER BY date DESC
        LIMIT 30
    ''', (station_id,)).fetchall()
    predictions = conn.execute('SELECT date, predicted_level FROM predictions WHERE station_id = ? ORDER BY date', (station_id,)).fetchall()
    conn.close()

    if not trends:
        return jsonify({'error': 'Station not found or no data'}), 404

    # Reverse to chronological order
    trends = trends[::-1]
    result = []
    prev_level = None
    for trend in trends:
        current_level = trend['water_level']
        recharge_estimation = (current_level - prev_level) if prev_level is not None else 0.0
        result.append({
            'date': trend['date'],
            'water_level': current_level,
            'recharge_estimation': round(recharge_estimation, 2),
            'type': 'historical'
        })
        prev_level = current_level

    # Add predictions
    for pred in predictions:
        result.append({
            'date': pred['date'],
            'water_level': pred['predicted_level'],
            'recharge_estimation': 0.0,  # No recharge for predictions
            'type': 'predicted'
        })

    # Sort by date
    result.sort(key=lambda x: x['date'])

    return jsonify({'station_id': station_id, 'trends': result})

@app.route('/station/<int:station_id>/alert', methods=['GET'])
def check_alert(station_id):
    """
    Returns alert status based on predicted level thresholds.
    """
    prediction_response = predict_water_level(station_id)
    if prediction_response.status_code != 200:
        return prediction_response

    predicted_level = prediction_response.get_json()['predicted_level']

    alert = get_alert_status(predicted_level)

    return jsonify({"station_id": station_id, "alert": alert})

@app.route('/reports-summary', methods=['GET'])
def get_reports_summary():
    """
    Returns summary of average levels, predicted levels, and recharge estimates for all stations.
    """
    conn = get_db_connection()
    stations = conn.execute('SELECT id FROM stations').fetchall()

    average_levels = []
    predicted_levels = []
    recharge_estimates = []

    for station in stations:
        station_id = station['id']

        avg_row = conn.execute('''
            SELECT AVG(water_level) as avg_level FROM water_levels WHERE station_id = ?
        ''', (station_id,)).fetchone()
        avg_level = avg_row['avg_level'] if avg_row else None

        pred_resp = predict_water_level(station_id)
        if pred_resp.status_code == 200:
            predicted_level = pred_resp.get_json().get('predicted_level', None)
        else:
            predicted_level = None

        # Simple recharge estimate: difference between latest and earliest water level in last 12 months
        levels = conn.execute('''
            SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 12
        ''', (station_id,)).fetchall()
        if len(levels) >= 2:
            recharge_estimate = levels[0]['water_level'] - levels[-1]['water_level']
        else:
            recharge_estimate = None

        average_levels.append({"station_id": station_id, "avg_level": avg_level})
        predicted_levels.append({"station_id": station_id, "predicted_level": predicted_level})
        recharge_estimates.append({"station_id": station_id, "estimate": recharge_estimate})

    conn.close()

    return jsonify({
        "average_levels": average_levels,
        "predicted_levels": predicted_levels,
        "recharge_estimates": recharge_estimates
    })

@app.route('/alerts', methods=['GET'])
def get_alerts():
    """
    Returns list of stations with their alert status and latest water level.
    Supports filtering by alert status via query param 'status'.
    """
    status_filter = request.args.get('status')
    role = request.args.get('role', 'policymaker')

    conn = get_db_connection()
    stations = conn.execute('SELECT id FROM stations').fetchall()

    result = []
    for station in stations:
        station_id = station['id']

        latest_level_row = conn.execute('''
            SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 1
        ''', (station_id,)).fetchone()
        latest_level = latest_level_row['water_level'] if latest_level_row else None

        pred_resp = predict_water_level(station_id)
        if pred_resp.status_code == 200:
            predicted_level = pred_resp.get_json().get('predicted_level', None)
        else:
            predicted_level = None

        alert = get_alert_status(station_id, role, predicted_level) if predicted_level is not None else 'unknown'

        if status_filter and alert != status_filter:
            continue

        result.append({
            "station_id": station_id,
            "alert": alert,
            "latest_level": latest_level
        })

    conn.close()
    return jsonify(result)

@app.route('/predictions', methods=['GET'])
def get_predictions():
    """
    Returns all predictions from the predictions table.
    """
    conn = get_db_connection()
    predictions = conn.execute('SELECT * FROM predictions ORDER BY date DESC').fetchall()
    conn.close()
    result = [dict(pred) for pred in predictions]
    return jsonify(result)

def update_predictions():
    """
    Scheduled job to update predictions for all stations every 15 minutes.
    """
    conn = get_db_connection()
    stations = conn.execute('SELECT id, district, latitude, longitude FROM stations').fetchall()
    conn.close()

    for station in stations:
        station_id = station['id']
        district = station['district'].lower()
        lat = station['latitude']
        lon = station['longitude']

        avg_precip, avg_temp = fetch_weather(lat, lon)

        conn = get_db_connection()
        levels = conn.execute('SELECT date, water_level FROM water_levels WHERE station_id = ? ORDER BY date', (station_id,)).fetchall()
        conn.close()

        if len(levels) < 3:
            continue

        if district in models:
            model = models[district]
            hist_df = pd.DataFrame([{'ds': pd.to_datetime(r['date']), 'y': r['water_level']} for r in levels])
            last_date = hist_df['ds'].max()
            future_date = last_date + pd.DateOffset(months=1)
            future_df = pd.DataFrame({'ds': [future_date]})
            future_df['precipitation_sum'] = avg_precip
            forecast = model.predict(future_df)
            predicted_level = forecast['yhat'].iloc[0]

            if avg_precip > 20:
                predicted_level *= 1.05

            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('INSERT OR REPLACE INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                           (station_id, future_date.strftime('%Y-%m-%d'), predicted_level))
            conn.commit()
            conn.close()
        else:
            # Fallback to linear regression
            levels_desc = [r for r in levels][-12:]  # last 12
            data = [(pd.to_datetime(r['date']), r['water_level']) for r in levels_desc]
            data.sort(key=lambda x: x[0])
            X = np.array([(d[0] - data[0][0]).days for d in data]).reshape(-1, 1)
            y = np.array([d[1] for d in data])
            lr_model = LinearRegression()
            lr_model.fit(X, y)
            next_date = data[-1][0] + pd.DateOffset(months=1)
            days_diff = (next_date - data[0][0]).days
            predicted_level = lr_model.predict([[days_diff]])[0]

            # Store prediction
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('INSERT OR REPLACE INTO predictions (station_id, date, predicted_level) VALUES (?, ?, ?)', 
                           (station_id, next_date.strftime('%Y-%m-%d'), predicted_level))
            conn.commit()
            conn.close()

if __name__ == '__main__':
    init_db()
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_predictions, 'interval', minutes=15)
    scheduler.start()
    app.run(debug=True)
