@echo off
setlocal enabledelayedexpansion
echo %DATE% %TIME% Starting restart script...

echo Killing any remaining processes on ports 3000 and 4200...

:: Kill processes by name first as a fallback
taskkill /f /im node.exe /fi "status eq running" 2>nul
:: Note: Killing all node.exe might be aggressive, but in this context it's often necessary
:: if we want to ensure port 4200 (Angular) and 3000 (Express) are free.
:: However, let's try to be more targeted if possible, but Windows taskkill is limited.

:: Retry loop for port-based killing
for %%p in (3000 4200) do (
    echo Ensuring port %%p is free...
    for /l %%i in (1, 1, 5) do (
        set "pid="
        for /f "tokens=5" %%a in ('netstat -aon ^| findstr /c:":%%p " ^| findstr LISTENING') do (
            set "pid=%%a"
            echo Found process on port %%p with PID !pid!. Killing...
            taskkill /f /pid !pid! 2>nul
        )
        if "!pid!"=="" (
            echo Port %%p is free.
            goto :port_%%p_free
        )
        timeout /t 1 /nobreak >nul
    )
    echo Warning: Could not verify port %%p is free after 5 attempts.
    :port_%%p_free
)

echo Stopping database...
call npm run db:down

echo Running npm install...
call npm install

echo Starting database...
call npm run db:up

:: Give a bit of time for ports to be fully released and DB to stabilize
timeout /t 2 /nobreak >nul

echo Starting application...
npm start
