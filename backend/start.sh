#!/bin/bash
# Simple start script for Railway

# Show what's in the directory
echo "=== Current directory ==="
pwd
ls -la

# Show if dist exists
echo "=== Checking dist folder ==="
if [ -d "dist" ]; then
  echo "dist folder exists!"
  ls -la dist/
else
  echo "ERROR: dist folder not found!"
  exit 1
fi

# Start the application
echo "=== Starting application ==="
exec node dist/index.js
