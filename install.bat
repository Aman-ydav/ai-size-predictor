@echo off
echo AI Size Predictor - Installation Script
echo =====================================
echo.

echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

echo Dependencies installed successfully.
echo.

echo Starting the server...
echo The server will run at http://localhost:3000
echo To view the application, open index.html in your browser.
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm start 