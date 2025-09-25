# AquaSense Desktop Application

This guide will help you run AquaSense as a desktop application.

## Quick Start

### Option 1: Batch File (Recommended)
1. Double-click `run-desktop.bat`
2. The application will open in fullscreen mode
3. Press F11 to toggle fullscreen mode

### Option 2: Direct Browser Shortcut
1. Copy `AquaSense.url` to your desktop
2. Double-click the shortcut to open the application
3. The app will open in your default browser

### Option 3: HTML Desktop App
1. Open `desktop-app.html` in your browser
2. The app will automatically go fullscreen
3. Use F11 to toggle fullscreen mode

## First Time Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Use one of the desktop shortcuts above**

## Features

- **Fullscreen Mode**: Opens without browser UI for app-like experience
- **F11 Toggle**: Press F11 to enter/exit fullscreen
- **Auto-start**: Batch file automatically opens in app mode
- **Cross-platform**: Works on Windows, Mac, and Linux

## Troubleshooting

- Make sure the development server is running on `http://localhost:5173`
- If the app doesn't open, try running `npm run dev` first
- For the best experience, use the batch file method

## Development

To run in development mode:
```bash
npm run dev
```

To build for production:
```bash
npm run build
