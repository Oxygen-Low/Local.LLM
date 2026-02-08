#!/bin/bash
echo "$(date) Starting restart script..."

# Function to kill processes on a specific port with retries
kill_port() {
    local port=$1
    echo "Ensuring port $port is free..."
    for i in {1..5}; do
        local pids=""

        # Try to get PIDs using lsof
        if command -v lsof >/dev/null 2>&1; then
            pids=$(lsof -t -i :$port)
        fi

        # If lsof didn't find anything, try fuser
        if [ -z "$pids" ] && command -v fuser >/dev/null 2>&1; then
            pids=$(fuser $port/tcp 2>/dev/null | awk '{print $NF}')
        fi

        if [ -n "$pids" ]; then
            echo "Found processes on port $port: $pids. Sending kill -9..."
            echo "$pids" | xargs kill -9 2>/dev/null
            sleep 1
        else
            echo "Port $port is free."
            return 0
        fi
    done

    # Final check
    if command -v lsof >/dev/null 2>&1; then
        if lsof -i :$port >/dev/null 2>&1; then
            echo "Warning: Port $port still appears to be in use after 5 attempts."
            return 1
        fi
    fi
    return 0
}

# Kill processes by name as well to be safe
echo "Killing any remaining 'ng serve' or 'node server.js' processes..."
pkill -f "ng serve" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
sleep 1

# Kill by port with retries
kill_port 3000
kill_port 4200

echo "Stopping database..."
npm run db:down

echo "Running npm install..."
npm install

echo "Starting database..."
npm run db:up

# Give a bit of time for ports to be fully released by the OS and for DB to stabilize
sleep 2

echo "Starting application..."
exec npm start
