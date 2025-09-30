# Groundwater Backend

This is the Flask backend for the Groundwater Dashboard application.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Development Mode (Recommended for stability)
```bash
python app.py
```
This runs with `debug=False` and `use_reloader=False` to prevent disconnections.

### Production Mode (using Waitress WSGI server)
1. Install Waitress:
   ```bash
   pip install waitress
   ```

2. Run with Waitress:
   ```bash
   waitress-serve --host=127.0.0.1 --port=5000 app:app
   ```

The application will be available at `http://127.0.0.1:5000`.

## Features

- RESTful API for groundwater data
- Scheduled jobs for predictions and live readings
- SQLite database for data storage
- Integration with India-WRIS data
- Weather forecasting using Open-Meteo API

## API Endpoints

- `/stations` - Get all stations
- `/station/<id>/predict` - Predict water level for a station
- `/alerts` - Get active alerts
- `/dashboard/<role>` - Get dashboard data for specific role
- And more...

## Database

The application uses SQLite (`groundwater.db`) with the following tables:
- `stations` - Station information
- `water_levels` - Historical water level data
- `predictions` - Predicted water levels
- `alerts` - Alert notifications
- `live_readings` - Real-time telemetry data
