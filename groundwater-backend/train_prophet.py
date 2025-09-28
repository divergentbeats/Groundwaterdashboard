import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly
import json
import os
from datetime import datetime, timedelta
import requests

# Load CGWB historical data
df = pd.read_csv('data/cgwb_historical.csv')
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values('Date')

import joblib

# Fetch historical weather from Open-Meteo for training (last 10 days example, but for historical, use archive API for past years)
def fetch_historical_weather(lat, lon, start_date, end_date):
    url = f"https://archive-api.open-meteo.com/v1/era5?latitude={lat}&longitude={lon}&start_date={start_date}&end_date={end_date}&hourly=precipitation, temperature_2m"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        hourly = pd.DataFrame(data['hourly'])
        hourly['time'] = pd.to_datetime(hourly['time'])
        daily = hourly.resample('D', on='time').agg({'precipitation': 'sum', 'temperature_2m': 'mean'})
        daily = daily.reset_index()
        daily = daily.rename(columns={'time': 'Date', 'precipitation': 'precipitation_sum', 'temperature_2m': 'temp_avg'})
        return daily
    return None

# For prototype, use mock historical weather; in production, loop over stations and dates
# Example for Bengaluru
bengaluru_df = df[df['District'] == 'Bengaluru'].copy()
bengaluru_df = bengaluru_df.rename(columns={'Date': 'ds', 'Water_Level_m_bgl': 'y'})
bengaluru_df['precipitation_sum'] = 0.0  # Mock; replace with fetch_historical_weather(12.9716, 77.5946, '2022-01-01', '2023-12-01')

# Fit Prophet model with regressor
model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=True)
model.add_regressor('precipitation_sum')
model.fit(bengaluru_df)

# Make future dataframe for 30 days
future = model.make_future_dataframe(periods=30)
future['precipitation_sum'] = 0.0  # Mock future weather; in app, fetch real-time and predict

# Predict
forecast = model.predict(future)

# Save model (Prophet models can be saved with joblib or pickle)
from joblib import dump
dump(model, 'models/bengaluru_prophet_model.joblib')

# Save forecast for app use
forecast.to_json('models/bengaluru_forecast.json', orient='records', date_format='iso')

print("Prophet model trained and saved for Bengaluru. Repeat for other stations.")

# To train for all stations
models_dir = 'models'
os.makedirs(models_dir, exist_ok=True)

for district in df['District'].unique():
    station_df = df[df['District'] == district].copy()
    if len(station_df) < 10: continue  # Skip if insufficient data
    station_df = station_df.rename(columns={'Date': 'ds', 'Water_Level_m_bgl': 'y'})
    station_df['precipitation_sum'] = 0.0  # Mock
    model = Prophet(daily_seasonality=True)
    model.add_regressor('precipitation_sum')
    model.fit(station_df)
    future = model.make_future_dataframe(periods=30)
    future['precipitation_sum'] = 0.0
    forecast = model.predict(future)
    dump(model, f'{models_dir}/{district.lower()}_prophet_model.joblib')
    forecast.to_json(f'{models_dir}/{district.lower()}_forecast.json', orient='records', date_format='iso')
    print(f"Trained {district}")

# Run this script once to generate models
if __name__ == "__main__":
    print("Training complete.")
