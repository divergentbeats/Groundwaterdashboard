# Implementation Plan for Role-Specific Mini-Dashboards

## Pending Tasks

### 1. Update FarmerSection in src/App.jsx
- Add useState for farmerData and useEffect to fetch `/stations?role=farmer&days=7` (use mockStations as fallback).
- Implement 3 Quick Cards using StatCard: Borewell status (avg water_level), Irrigation advice (conditional text based on avg level), Rainfall prediction (avg predicted_level).
- Add 7-day LineChart using Recharts for water levels (process data to daily averages).
- Add Alert Banner: Conditional red/yellow div if avg level < 10m bgl, with warning message.

### 2. Update PolicymakerSection in src/App.jsx
- Add useState for policyData and useEffect to fetch `/stations?role=policymaker` (fallback to mockStations filtered by role if possible).
- Implement 2 Aggregated Cards using StatCard: Average water level across region, Recharge prediction.
- Add MapContainer with TileLayer, centered on India ([20, 78], zoom 5), Markers with green/red icons based on water_level >/< threshold (use L.icon for colors).
- Add Alerts by District BarChart: Group data by district, count alerts (assume status === 'critical' as alert), x=district, y=count.

### 3. Update PlannerSection in src/App.jsx
- Add useState for plannerData, selectedScenario ('normal', 'drought', 'heavy_rain'), and useEffect to fetch `/forecast?role=planner&scenario=${selectedScenario}` or simulate data (e.g., modify historical with factors: drought -20%, heavy_rain +30%).
- Implement Scenario Selector Dropdown: <select> with options, onChange updates selectedScenario and refetches.
- Add Forecast Chart: LineChart with two lines - historical (solid) and simulated (dashed, different color).
- Add Forecast Box: Custom div or StatCard for "Groundwater availability for next 30 days" with projected value.

### 4. Update StakeholderSection in src/App.jsx
- Add useState for stakeholderData, historicalAlerts, useEffect to fetch `/stations?role=stakeholder` and `/alerts/historical?role=stakeholder` (fallback: mockStations and simulated monthly counts).
- Implement Station List Table: Simple <table> with columns: Station ID, Location (lat/lng or name), Current Level (water_level).
- Add Download Options: Two buttons - "Download CSV" and "Download JSON", implement client-side generation using data (e.g., JSON.stringify, CSV via join/map).
- Add Historical Alerts Chart: BarChart with months on x, alert counts on y.

### 5. General Updates in src/App.jsx
- Add necessary imports: e.g., Download icon from lucide-react, any missing Recharts components.
- Ensure all sections use consistent styling (glassmorphism, responsive grid: lg:grid-cols-2 for charts/map/table).
- Handle fetch errors: Use mock data from constants.js (may need to extend mocks in src/utils/constants.js if fields missing like district, historical).
- Remove old navigation cards from sections.

### 6. Update Mock Data if Needed
- If mockStations lacks fields (district, status, historical), edit src/utils/constants.js to add sample data.

### 7. Testing
- Use browser_action to launch http://localhost:3000, select each role, verify rendering of cards/charts/map/table/downloads.
- Interact: Change dropdown in Planner, click downloads in Stakeholder, zoom map in Policymaker, check alert banner in Farmer.
- Check console for errors, fix if any.
- Test responsiveness on mobile/desktop.

## Completed Tasks
- None yet.
