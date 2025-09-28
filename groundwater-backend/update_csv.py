import pandas as pd
from datetime import datetime
import numpy as np

# Load existing CSV
df = pd.read_csv('data/cgwb_historical.csv')
df['Date'] = pd.to_datetime(df['Date'])

# Existing stations from CSV
existing_stations = df['District'].unique().tolist()

# All 21 stations mapping (district to state, lat, lon)
all_stations = {
    'Bengaluru': {'state': 'Karnataka', 'lat': 12.9716, 'lon': 77.5946},
    'Mumbai': {'state': 'Maharashtra', 'lat': 19.0760, 'lon': 72.8777},
    'Delhi': {'state': 'Delhi', 'lat': 28.7041, 'lon': 77.1025},
    'Chennai': {'state': 'Tamil Nadu', 'lat': 13.0827, 'lon': 80.2707},
    'Kolkata': {'state': 'West Bengal', 'lat': 22.5726, 'lon': 88.3639},
    'Hyderabad': {'state': 'Telangana', 'lat': 17.3850, 'lon': 78.4867},
    'Pune': {'state': 'Maharashtra', 'lat': 18.5204, 'lon': 73.8567},
    'Ahmedabad': {'state': 'Gujarat', 'lat': 23.0225, 'lon': 72.5714},
    'Jaipur': {'state': 'Rajasthan', 'lat': 26.9124, 'lon': 75.7873},
    'Lucknow': {'state': 'Uttar Pradesh', 'lat': 26.8467, 'lon': 80.9462},
    'Kanpur': {'state': 'Uttar Pradesh', 'lat': 26.4499, 'lon': 80.3319},
    'Nagpur': {'state': 'Maharashtra', 'lat': 21.1458, 'lon': 79.0882},
    'Indore': {'state': 'Madhya Pradesh', 'lat': 22.7196, 'lon': 75.8577},
    'Bhopal': {'state': 'Madhya Pradesh', 'lat': 23.2599, 'lon': 77.4126},
    'Patna': {'state': 'Bihar', 'lat': 25.5941, 'lon': 85.1376},
    'Vadodara': {'state': 'Gujarat', 'lat': 22.3072, 'lon': 73.1812},
    'Coimbatore': {'state': 'Tamil Nadu', 'lat': 11.0168, 'lon': 76.9558},
    'Ernakulam': {'state': 'Kerala', 'lat': 9.9312, 'lon': 76.2673},  # For Kochi
    'Visakhapatnam': {'state': 'Andhra Pradesh', 'lat': 17.6868, 'lon': 83.2185},
    'Agra': {'state': 'Uttar Pradesh', 'lat': 27.1767, 'lon': 78.0081},
    'Mysore': {'state': 'Karnataka', 'lat': 12.2958, 'lon': 76.6394}
}

# Base levels and increments for missing stations (11-21)
missing_base = {
    'Kanpur': (40, 1.5, 'Warning'),
    'Nagpur': (30, 1.0, 'Normal'),
    'Indore': (35, 1.2, 'Warning'),
    'Bhopal': (32, 1.0, 'Normal'),
    'Patna': (25, 0.8, 'Normal'),
    'Vadodara': (45, 1.8, 'Warning'),
    'Coimbatore': (20, 0.5, 'Normal'),
    'Ernakulam': (5, 0.3, 'Normal'),
    'Visakhapatnam': (15, 0.6, 'Normal'),
    'Agra': (55, 2.0, 'Warning'),
    'Mysore': (250, 5.0, 'Critical')
}

# Target date
target_date = datetime(2025, 9, 28)

# Step 1: Project for existing stations (add 2025-09-28 row)
new_rows = []
for district in existing_stations:
    station_df = df[df['District'] == district].copy()
    station_df = station_df.sort_values('Date')
    last_date = station_df['Date'].iloc[-1]
    last_level = station_df['Water_Level_m_bgl'].iloc[-1]
    recent = station_df.tail(12)
    if len(recent) > 1:
        months_diff = (recent['Date'].iloc[-1] - recent['Date'].iloc[0]).days / 30.0
        increment = (recent['Water_Level_m_bgl'].iloc[-1] - recent['Water_Level_m_bgl'].iloc[0]) / months_diff if months_diff > 0 else 1.0
    else:
        increment = 1.0
    days_diff = (target_date - last_date).days
    months_diff = days_diff / 30.0
    projected_level = last_level + increment * months_diff
    last_pattern = station_df['Recharge_Pattern'].iloc[-1]
    new_row = {
        'Date': target_date.strftime('%Y-%m-%d'),
        'District': district,
        'State': station_df['State'].iloc[0],
        'Latitude': station_df['Latitude'].iloc[0],
        'Longitude': station_df['Longitude'].iloc[0],
        'Water_Level_m_bgl': round(projected_level, 2),
        'Recharge_Pattern': last_pattern
    }
    new_rows.append(new_row)

new_df = pd.DataFrame(new_rows)
df = pd.concat([df, new_df], ignore_index=True)

# Step 2: Generate full historical + projection for missing stations
missing_rows = []
start_date = datetime(2023, 1, 1)
end_date = datetime(2025, 9, 1)
current_date = start_date
delta = pd.DateOffset(months=1)
while current_date <= end_date:
    for district, (base_level, increment, base_pattern) in missing_base.items():
        months_passed = (current_date.year - 2023) * 12 + current_date.month - 1
        level = base_level + increment * months_passed
        if level > 200:
            pattern = 'Critical'
        elif level > 100:
            pattern = 'Warning'
        elif level > 50:
            pattern = 'Low'
        else:
            pattern = base_pattern
        row = {
            'Date': current_date.strftime('%Y-%m-%d'),
            'District': district,
            'State': all_stations[district]['state'],
            'Latitude': all_stations[district]['lat'],
            'Longitude': all_stations[district]['lon'],
            'Water_Level_m_bgl': round(level, 2),
            'Recharge_Pattern': pattern
        }
        missing_rows.append(row)
    current_date = (current_date + delta).replace(day=1)

# Add projection for missing stations
for district, (base_level, increment, base_pattern) in missing_base.items():
    months_passed = 32  # Jan 2023 to Sep 2025
    last_level = base_level + increment * months_passed
    projected_level = last_level + increment * (27 / 30.0)  # Approx for 28th
    row = {
        'Date': target_date.strftime('%Y-%m-%d'),
        'District': district,
        'State': all_stations[district]['state'],
        'Latitude': all_stations[district]['lat'],
        'Longitude': all_stations[district]['lon'],
        'Water_Level_m_bgl': round(projected_level, 2),
        'Recharge_Pattern': base_pattern
    }
    missing_rows.append(row)

missing_df = pd.DataFrame(missing_rows)
df = pd.concat([df, missing_df], ignore_index=True)

# Sort by District and Date
df = df.sort_values(['District', 'Date'])

# Save updated CSV
df.to_csv('data/cgwb_historical.csv', index=False)
print('CSV updated with projected data for all 21 stations up to 2025-09-28.')
