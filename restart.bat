@echo off
setlocal
echo %DATE% %TIME% Starting restart script... > restart.log

:: Wait for the server to exit properly
timeout /t 5 /nobreak >> restart.log 2>&1

echo Killing any remaining processes on ports 3000 and 4200... >> restart.log 2>&1
:: Use taskkill to ensure the ports are free if they didn't close gracefully
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >> restart.log 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4200 ^| findstr LISTENING') do taskkill /f /pid %%a >> restart.log 2>&1

echo Stopping database... >> restart.log 2>&1
call npm run db:down >> restart.log 2>&1

echo Running npm install... >> restart.log 2>&1
call npm install >> restart.log 2>&1

echo Starting database... >> restart.log 2>&1
call npm run db:up >> restart.log 2>&1

echo Starting application... >> restart.log 2>&1
:: Call npm start and redirect all output to the log file
call npm start >> restart.log 2>&1
