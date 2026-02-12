@echo off
setlocal
cd /d "%~dp0"

echo ==================================================
echo   Digital Mental Health - One-Click Launcher
echo ==================================================

:: 1. Check for Virtual Environment
if not exist "venv" (
    echo [INFO] Creating virtual environment - first time setup...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create venv. Make sure Python is installed.
        pause
        exit /b
    )
)

:: 2. Activate Virtual Environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo [ERROR] Failed to activate venv.
    pause
    exit /b
)

:: 3. Install Dependencies (only when requirements change)
set "REQ=backend\requirements.txt"
set "STAMP=.deps_hash"
set "NEED_INSTALL=1"

if not exist "%REQ%" (
    echo [ERROR] Requirements file not found: %REQ%
    pause
    exit /b
)

for /f "usebackq delims=" %%H in (`powershell -NoProfile -Command "(Get-FileHash -Algorithm SHA256 '%REQ%').Hash"`) do set "CUR_HASH=%%H"

if exist "%STAMP%" (
    set /p OLD_HASH=<"%STAMP%"
    if /i "%CUR_HASH%"=="%OLD_HASH%" set "NEED_INSTALL=0"
)

if "%NEED_INSTALL%"=="1" (
    echo [INFO] Installing dependencies...
    pip install -r "%REQ%"
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
    >"%STAMP%" echo %CUR_HASH%
) else (
    echo [INFO] Dependencies already up to date.
)

:: 4. Run the Application
echo.
echo [INFO] Starting Application...
echo [INFO] Open your browser to: http://127.0.0.1:5000/
echo.
python backend/app.py

pause
