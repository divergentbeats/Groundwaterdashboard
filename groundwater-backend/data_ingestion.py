import sqlite3
import datetime
import random

def get_db_connection():
    conn = sqlite3.connect('groundwater.db')
    conn.row_factory = sqlite3.Row
    return conn

def fetch_live_data():
    """
    Fetch live DWLR data (mocked for prototype).
    Generates realistic data based on latest water levels for all 20 stations and stores in live_readings table.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get all station IDs
    stations = cursor.execute('SELECT id FROM stations').fetchall()

    for station in stations:
        station_id = station['id']

        # Get latest water level from water_levels
        latest_level_row = cursor.execute('SELECT water_level FROM water_levels WHERE station_id = ? ORDER BY date DESC LIMIT 1', (station_id,)).fetchone()
        base_level = latest_level_row['water_level'] if latest_level_row else random.uniform(5.0, 50.0)

        # Generate mock data with variation from latest level
        water_level = round(base_level + random.uniform(-1.0, 1.0), 2)  # Slight variation
        water_level = max(1.0, water_level)  # Minimum 1m
        recharge_rate = round(random.uniform(0.0, 5.0), 2)  # 0-5 units
        battery = round(random.uniform(80.0, 100.0), 1)  # 80-100%
        status = 'active'  # All active for now
        timestamp = datetime.datetime.now().isoformat()

        # Insert into live_readings
        cursor.execute('''
            INSERT INTO live_readings (station_id, timestamp, water_level, recharge_rate, battery, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (station_id, timestamp, water_level, recharge_rate, battery, status))

    conn.commit()
    conn.close()
    print("Live DWLR data fetched and stored (mocked).")
