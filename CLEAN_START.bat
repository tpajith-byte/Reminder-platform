@echo off
echo ==========================================
echo      CLEANING AND STARTING SERVER
echo ==========================================
echo.

cd frontend

echo 1. Stopping any running node processes...
taskkill /F /IM node.exe >nul 2>&1

echo 2. Clearing Next.js cache (.next folder)...
if exist .next (
    rmdir /s /q .next
    echo    - Cache cleared.
) else (
    echo    - No cache found.
)

echo 3. Starting Development Server...
echo.
echo    PLEASE WAIT for "Ready" message...
echo    Then open: http://localhost:3000
echo.
echo ==========================================

npm run dev
pause
