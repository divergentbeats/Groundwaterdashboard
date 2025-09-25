@echo off
echo Starting AquaSense Desktop Application...
echo.
echo The application will open in fullscreen mode.
echo Press F11 to exit fullscreen or close the browser to exit.
echo.
start "" "http://localhost:5173" --new-window --app="http://localhost:5173"
