import requests
import csv
import io
from datetime import datetime

def fetch_indiawris_groundwater_data(api_key, station_ids):
    """
    Fetch groundwater data from India-WRIS or CGWB WIMS authenticated API or CSV download.
    This is a simulated function. Replace URL and parsing logic with actual API details.
    Args:
        api_key (str): API key or token for authentication.
        station_ids (list): List of station IDs to fetch data for.
    Returns:
        dict: Mapping of station_id to list of latest 7 readings sorted newest first.
    """
    # Example URL - replace with actual API endpoint or CSV download URL
    url = "https://example.com/indiawris/groundwater_data.csv"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")

    data = {}
    csvfile = io.StringIO(response.text)
    reader = csv.DictReader(csvfile)
    for row in reader:
        station_id = row.get("station_id")
        if station_id not in station_ids:
            continue
        reading = {
            "station_name": row.get("station_name"),
            "timestamp": datetime.strptime(row.get("timestamp"), "%Y-%m-%d %H:%M"),
            "water_level": float(row.get("water_level_m", 0)),
            "recharge_rate": float(row.get("recharge_rate_mm_day", 0)),
            "status": row.get("status"),
            "battery": float(row.get("battery", 0))
        }
        if station_id not in data:
            data[station_id] = []
        data[station_id].append(reading)

    # Sort readings newest first and limit to latest 7
    for sid in data:
        data[sid] = sorted(data[sid], key=lambda x: x["timestamp"], reverse=True)[:7]

    return data
