@echo off
setlocal
echo %DATE% %TIME% Starting restart script...

echo Killing any remaining processes on ports 3000 and 4200...
:: Use taskkill to ensure the ports are free if they didn't close gracefully
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":3000 " ^| findstr LISTENING') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":4200 " ^| findstr LISTENING') do taskkill /f /pid %%a

echo Stopping database...
call npm run db:down

echo Running npm install...
call npm install

echo Starting database...
call npm run db:up

echo Starting application...
npm start
