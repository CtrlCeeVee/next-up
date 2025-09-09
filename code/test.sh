#!/bin/bash

# Start client
cd client
npm run dev &
CLIENT_PID=$!

# Start server
cd ../server
npm run dev &
SERVER_PID=$!

# Wait for both to finish
wait $CLIENT_PID $SERVER_PID
