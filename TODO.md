# Integration of Real-Time Data for Alerts and Readings

## Current Work
Integrating real-time (live simulation) data into Readings and Alerts pages. Backend will merge historical and live data in trends endpoint, update alerts to use live levels, frontend will poll for updates.

## Key Technical Concepts
- Backend: Flask with SQLite (water_levels for historical, live_readings for simulated telemetry updated every 1min). Prophet/linear regression for predictions.
- Frontend: React with useEffect polling, fetch API to localhost:5000 endpoints.
- Real-time: Use existing scheduler for mock live data; no external APIs needed.

## Relevant Files and Code
- groundwater-backend/app.py: Main Flask app; update get_station_trends to query and merge water_levels (last 30 days) + live_readings (last 24h); map live fields; update get_alert_status to fetch latest live level if within 1h, else prediction; update /alerts to generate using live.
- src/pages/Alerts.jsx: Add useEffect interval (30s) to fetchAlerts.
- src/pages/Readings.jsx: In mappedReadings, if item.type === 'live', use item.battery and item.recharge_estimation from response.

## Problem Solving
- Issue: Readings shows only historical up to 2023; live data in DB but not queried.
- Solution: Merge queries in backend; add polling to Alerts.
- Ongoing: Ensure no duplicates in merged trends; handle missing live for non-telemetry stations.

## Pending Tasks and Next Steps
1. [ ] Update groundwater-backend/app.py: Modify get_station_trends to include live_readings (merge historical + live, map fields: timestamp to date, add type: 'live', include battery).
   - "Update the get_station_trends function to query live_readings for the last 24 hours and append to historical trends after sorting by date."
2. [x] Update groundwater-backend/app.py: Modify get_alert_status to use latest live water_level if available (within 1 hour), else fallback to predicted_level.
   - "In get_alert_status, add query for latest live reading from live_readings WHERE timestamp > datetime('now', '-1 hour') ORDER BY timestamp DESC LIMIT 1; use that water_level if exists."
3. [x] Update groundwater-backend/app.py: In /alerts endpoint, when generating new alerts, use the updated get_alert_status (now live-aware); refresh if live data changes alert level.
   - "In get_alerts, for each station without recent alert, call get_alert_status (live-aware) and insert if not normal."
4. [x] Update src/pages/Alerts.jsx: Add polling with setInterval(30000) to fetchAlerts in useEffect, clear on unmount.
   - "Add const interval = useEffect(() => { fetchAlerts(); return () => clearInterval(interval); }, []); but make it poll: useEffect(() => { const id = setInterval(fetchAlerts, 30000); fetchAlerts(); return () => clearInterval(id); }, []);"
5. [x] Update src/pages/Readings.jsx: In fetchReadings mappedReadings, if (item.type === 'live') { battery: item.battery || mock; recharge: item.recharge_estimation; } else { mock }.
   - "In the map: battery: item.type === 'live' ? item.battery : (3.5 + Math.random() * 0.5).toFixed(2), recharge: item.recharge_estimation || item.recharge_estimation (already there)."
6. [x] Restart backend: execute_command cd groundwater-backend && python app.py
   - "After edits, restart to apply changes."
7. [ ] Test: Use browser_action to launch http://localhost:5173, navigate to Readings (select station 3), verify recent live entries appear with updating timestamps/levels; go to Alerts, verify polling updates and alerts based on live (e.g., if level triggers warning).
   - "Launch browser, click to Readings, select station 3, scroll/refresh to see live data; switch to Alerts, wait 30s to see updates; check console for errors."
8. [ ] Verify endpoints: execute_command curl http://localhost:5000/station/3/trends | jq .trends[-5:] to see recent live entries.
   - "Test API directly to confirm merge."

After completing all steps, use attempt_completion.
