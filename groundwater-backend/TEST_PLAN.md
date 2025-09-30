# Groundwater Backend API Test Plan

This document outlines tests to verify the functionality and stability of the backend API.

## GET Endpoints

1. **Get all stations**
   ```
   GET /stations
   ```
   Optional query params: `region`, `state`, `district`, `role` (farmer, stakeholder, policymaker, planner)

2. **Get stations for map**
   ```
   GET /stations-map
   ```

3. **Get alerts for a station**
   ```
   GET /alerts/{station_id}
   ```

4. **Get alert history for a station**
   ```
   GET /alerts/history/{station_id}
   ```

5. **Get dashboard data for role**
   ```
   GET /dashboard/{role}
   ```
   Roles: farmer, policymaker, planner, stakeholder, researcher, ngo

6. **Get water level readings for a station**
   ```
   GET /station/{station_id}/readings
   ```

7. **Predict water level for a station**
   ```
   GET /station/{station_id}/predict
   ```

8. **Get water level trends for a station**
   ```
   GET /station/{station_id}/trends?days=90
   ```

9. **Check alert status for a station**
   ```
   GET /station/{station_id}/alert
   ```

10. **Get reports summary**
    ```
    GET /reports-summary
    ```

11. **Get active alerts**
    ```
    GET /alerts
    ```
    Optional query param: `level`

12. **Get all predictions**
    ```
    GET /predictions
    ```

13. **Get live stations data**
    ```
    GET /stations/live
    ```

14. **Get live readings for a station**
    ```
    GET /station/{station_id}/live
    ```

15. **Get sensor data for a station**
    ```
    GET /station/{station_id}/sensors
    ```

16. **Get users**
    ```
    GET /users
    ```

17. **Get latest 7 readings from India-WRIS for a station**
    ```
    GET /station/{station_id}/latest_readings
    ```

## POST Endpoints

1. **Send notification for a station alert (mock)**
   ```
   POST /notify
   Content-Type: application/json

   {
     "station_id": 1,
     "user_id": 1,
     "role": "farmer"
   }
   ```

2. **Resolve an alert**
   ```
   POST /alerts/{alert_id}/resolve
   ```

3. **Scenario modeling**
   ```
   POST /scenario
   Content-Type: application/json

   {
     "station_id": 1,
     "rainfall_factor": 1.0,
     "extraction_factor": 1.0
   }
   ```

## Notes

- Verify correct HTTP status codes (200, 400, 404) for valid and invalid requests.
- Verify role-based data filtering on `/dashboard/{role}` and `/stations`.
- Verify alerts are generated and resolved correctly.
- Verify predictions update over time (scheduled jobs).
- Verify live readings update over time.
- Check logs for errors or warnings during tests.

Run these tests manually or automate using tools like Postman or curl scripts.
