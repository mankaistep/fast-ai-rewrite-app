#!/bin/bash

# Pull the latest changes
git pull origin main

# Install dependencies
npm install --production

# Build the Next.js app
npm run build

# Restart the Node.js application (you might need to adjust this based on your hosting setup)
# For example, if you're using PM2:
# pm2 restart your-app-name