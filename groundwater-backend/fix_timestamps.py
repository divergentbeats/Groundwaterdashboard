import sqlite3
from datetime import datetime, timedelta
import random

def fix_live_readings_timestamps():
    conn = sqlite3.connect('groundwater.db')
    cursor = conn.cursor()

    # Get all live readings ordered by station_id and current timestamp
    readings = cursor.execute('''
        SELECT id, station_id, timestamp FROM live_readings
        ORDER BY station_id, timestamp
    ''').fetchall()

    # Group by station_id
    station_readings = {}
    for reading in readings:
        sid = reading[1]
        if sid not in station_readings:
            station_readings[sid] = []
        station_readings[sid].append(reading)

    # For each station, assign consecutive timestamps over last 30 days
    now = datetime.now()
    for sid, rlist in station_readings.items():
        num_readings = len(rlist)
        if num_readings == 0:
            continue
        # Spread over last 30 days, with recent ones more recent
        start_time = now - timedelta(days=30)
        time_interval = timedelta(days=30) / (num_readings - 1) if num_readings > 1 else timedelta(0)

        for i, reading in enumerate(rlist):
            new_timestamp = (start_time + i * time_interval).isoformat()
            cursor.execute('UPDATE live_readings SET timestamp = ? WHERE id = ?', (new_timestamp, reading[0]))

    # Delete readings older than 30 days
    thirty_days_ago = (now - timedelta(days=30)).isoformat()
    cursor.execute('DELETE FROM live_readings WHERE timestamp < ?', (thirty_days_ago,))

    conn.commit()
    print("Live readings timestamps fixed and limited to last 30 days.")

def fix_alerts_timestamps():
    conn = sqlite3.connect('groundwater.db')
    cursor = conn.cursor()

    # Get all alerts ordered by station_id and current timestamp
    alerts = cursor.execute('''
        SELECT id, station_id, timestamp FROM alerts
        ORDER BY station_id, timestamp
    ''').fetchall()

    # Group by station_id
    station_alerts = {}
    for alert in alerts:
        sid = alert[1]
        if sid not in station_alerts:
            station_alerts[sid] = []
        station_alerts[sid].append(alert)

    # For each station, assign consecutive timestamps over last 30 days
    now = datetime.now()
    for sid, alist in station_alerts.items():
        num_alerts = len(alist)
        if num_alerts == 0:
            continue
        # Spread over last 30 days
        start_time = now - timedelta(days=30)
        time_interval = timedelta(days=30) / (num_alerts - 1) if num_alerts > 1 else timedelta(0)

        for i, alert in enumerate(alist):
            new_timestamp = (start_time + i * time_interval).isoformat()
            cursor.execute('UPDATE alerts SET timestamp = ? WHERE id = ?', (new_timestamp, alert[0]))

    # Delete alerts older than 30 days
    thirty_days_ago = (now - timedelta(days=30)).isoformat()
    cursor.execute('DELETE FROM alerts WHERE timestamp < ?', (thirty_days_ago,))

    conn.commit()
    print("Alerts timestamps fixed and limited to last 30 days.")

if __name__ == '__main__':
