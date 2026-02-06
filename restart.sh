#!/bin/bash
echo "$(date) Starting restart script..." > restart.log

# Wait for the server to exit properly
sleep 5

echo "Killing any remaining processes on ports 3000 and 4200..." >> restart.log
# Try to kill processes on ports 3000 and 4200 using common tools if available
if command -v lsof >/dev/null 2>&1; then
    lsof -t -i :3000 | xargs -r kill -9 >> restart.log 2>&1
    lsof -t -i :4200 | xargs -r kill -9 >> restart.log 2>&1
elif command -v fuser >/dev/null 2>&1; then
    fuser -k 3000/tcp >> restart.log 2>&1
    fuser -k 4200/tcp >> restart.log 2>&1
fi

echo "Stopping database..." >> restart.log
npm run db:down >> restart.log 2>&1

echo "Running npm install..." >> restart.log
npm install >> restart.log 2>&1

echo "Starting database..." >> restart.log
npm run db:up >> restart.log 2>&1

echo "Starting application..." >> restart.log
# Run npm start and redirect all output to the log file
npm start >> restart.log 2>&1
