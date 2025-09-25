from flask import Flask, jsonify, request
import sqlite3
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd

app = Flask(__name__)

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('groundwater.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database with sample data
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create stations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
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
            FOREIGN KEY (station_id) REFERENCES stations (id)
        )
    ''')

    # Insert sample stations
    stations = [
        (1, 'Delhi DWLR Station', 'Delhi', 'New Delhi', 28.7041, 77.1025),
        (2, 'Mumbai DWLR Station', 'Maharashtra', 'Mumbai', 19.076, 72.8777),
        (3, 'Bengaluru DWLR Station', 'Karnataka', 'Bengaluru', 12.9716, 77.5946)
    ]
    cursor.executemany('INSERT OR IGNORE INTO stations VALUES (?, ?, ?, ?, ?, ?)', stations)

    # Insert sample water levels for last 12 months
    base_date = datetime.now().replace(day=1) - timedelta(days=365)
    for station_id in [1, 2, 3]:
        for i in range(12):
            date = (base_date + timedelta(days=30*i)).strftime('%Y-%m-%d')
            # Simulate water levels decreasing over time
            water_level = 15.0 - (i * 0.5) + np.random.uniform(-1, 1)
            cursor.execute('INSERT OR IGNORE INTO water_levels (station_id, date, water_level) VALUES (?, ?, ?)',
                          (station_id, date, round(water_level, 2)))

    conn.commit()
    conn.close()

# API Endpoints

def get_alert_status(predicted_level, threshold):
    if predicted_level > threshold + 1:
        return 'safe'
    elif threshold <= predicted_level <= threshold + 1:
        return 'warning'
    else:
        return 'critical'

@app.route('/stations', methods=['GET'])
def get_stations():
    """
    Returns list of all stations with latest water level and alert status.
    Supports optional filtering by region, state, or district via query params.
    """
    region = request.args.get('region')
    state = request.args.get('state')
    district = request.args.get('district')

    conn = get_db_connection()
    query = 'SELECT id, name, state, district, latitude, longitude FROM stations'
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

        # Predict level for alert
        prediction_resp = predict_water_level(station['id'])
        if prediction_resp.status_code == 200:
            predicted_level = prediction_resp.get_json().get('predicted_level', None)
        else:
            predicted_level = None

        alert = get_alert_status(predicted_level, latest_level) if predicted_level is not None and latest_level is not None else 'unknown'

        result.append({
            "id": station['id'],
            "name": station['name'],
            "state": station['state'],
            "district": station['district'],
            "latest_level": latest_level,
            "alert": alert
        })

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

        alert = get_alert_status(predicted_level, latest_level) if predicted_level is not None and latest_level is not None else 'unknown'

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
    Predicts next month's water level using linear regression on last 12 months data.
    Returns JSON with station_id and predicted_level.
    """
    conn = get_db_connection()
    water_levels = conn.execute('''
        SELECT date, water_level FROM water_levels
        WHERE station_id = ?
        ORDER BY date DESC
        LIMIT 12
    ''', (station_id,)).fetchall()
    conn.close()

    if len(water_levels) < 2:
        return jsonify({'error': 'Not enough data for prediction'}), 400

    data = [(datetime.strptime(row['date'], '%Y-%m-%d'), row['water_level']) for row in water_levels]
    data.sort(key=lambda x: x[0])

    X = np.array([(d[0] - data[0][0]).days for d in data]).reshape(-1, 1)
    y = np.array([d[1] for d in data])

    model = LinearRegression()
    model.fit(X, y)

    next_date = data[-1][0] + timedelta(days=30)
    days_diff = (next_date - data[0][0]).days
    predicted_level = model.predict([[days_diff]])[0]

    return jsonify({"station_id": station_id, "predicted_level": round(predicted_level, 2), "unit": "meters"})

@app.route('/station/<int:station_id>/alert', methods=['POST'])
def check_alert(station_id):
    """
    Accepts JSON with threshold, compares predicted level to threshold,
    returns alert status: safe, warning, or critical.
    """
    data = request.get_json()
    if not data or 'threshold' not in data:
        return jsonify({'error': 'Threshold required'}), 400

    threshold = data['threshold']

    prediction_response = predict_water_level(station_id)
    if prediction_response.status_code != 200:
        return prediction_response

    predicted_level = prediction_response.get_json()['predicted_level']

    alert = get_alert_status(predicted_level, threshold)

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

        alert = get_alert_status(predicted_level, latest_level) if predicted_level is not None and latest_level is not None else 'unknown'

        if status_filter and alert != status_filter:
            continue

        result.append({
            "station_id": station_id,
            "alert": alert,
            "latest_level": latest_level
        })

    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
