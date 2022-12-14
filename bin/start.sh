#!/bin/bash

# Start the two processes
bin/run &
npm start &

trap "pkill SIGTERM -P $$" SIGTERM

# Wait for at least one to exit
wait -n

# Kill the processes
pkill -P $$
