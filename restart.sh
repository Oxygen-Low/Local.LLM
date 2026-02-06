#!/bin/bash
# Wait for the server to exit
sleep 2
echo "Stopping database..."
npm run db:down
echo "Running npm install..."
npm install
echo "Starting database..."
npm run db:up
echo "Starting application..."
npm start
