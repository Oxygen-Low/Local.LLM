#!/bin/bash
echo "$(date) Starting restart script..."

echo "Killing any remaining processes on ports 3000 and 4200..."
# Try to kill processes on ports 3000 and 4200 using common tools if available
if command -v lsof >/dev/null 2>&1; then
    lsof -t -i :3000 | xargs -r kill -9
    lsof -t -i :4200 | xargs -r kill -9
elif command -v fuser >/dev/null 2>&1; then
    fuser -k 3000/tcp
    fuser -k 4200/tcp
fi

echo "Stopping database..."
npm run db:down

echo "Running npm install..."
npm install

echo "Starting database..."
npm run db:up

echo "Starting application..."
exec npm start
