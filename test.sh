#!/bin/bash

# Clean previous build
rm -rf dist
rm -rf node_modules

# Install dependencies
npm install

# Try to compile TypeScript
echo "Checking TypeScript compilation..."
npx tsc --noEmit

# Try to build with webpack
echo "Testing webpack build..."
npm run build

# Check if build succeeded
if [ -d "dist" ] && [ -f "dist/ui.js" ] && [ -f "dist/code.js" ]; then
    echo "Build successful! ✅"
    echo "Files in dist directory:"
    ls -la dist
else
    echo "Build failed! ❌"
    exit 1
fi