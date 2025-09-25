# TODO: Fix Footer Consistency Across All Pages

To ensure the footer is consistently positioned at the bottom of the viewport on all pages (short or long content), update each page's root div to use `h-full flex flex-col w-full` (from `min-h-full`) and add `flex-1` to the main content container to force expansion and push the footer down.

## Steps:

- [x] Edit src/pages/Dashboard.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content motion.div (the one wrapping the page content). (Already present on grid div)

- [x] Edit src/pages/Users.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content motion.div (the one after the back button). (Already present on table div)

- [x] Edit src/pages/Readings.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content container (e.g., the div wrapping the readings table or list). (Already present on grid div)

- [x] Edit src/pages/Alerts.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content container (e.g., the div wrapping the alerts list). (Already present on space-y-4 div)

- [x] Edit src/pages/Trends.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content div (the one after the back button, wrapping controls and charts). (Already present on grid div)

- [x] Edit src/pages/Stations.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content container (e.g., the div wrapping the stations list or map). (Already present on grid div)

- [x] Edit src/pages/Maps.jsx: 
  - Change root div className from "min-h-full flex flex-col w-full" to "h-full flex flex-col w-full".
  - Add `flex-1` to the main content container (e.g., the div wrapping the map component). (Already present on map div)

- [ ] Verify changes: Launch browser at localhost:5173, navigate to each page via sidebar, scroll if needed, confirm footer is always at viewport bottom with consistent emerald/cyan theme, bubbles visible, no layout breaks.

- [ ] Run `npm run build` to ensure compilation succeeds without errors.

- [ ] Update this TODO.md with progress after each step.
