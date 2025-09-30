#!/bin/bash
echo "Starting WhatsApp Anti-Spam Bot..."
echo
echo "If you see a QR code, scan it with WhatsApp to log in."
echo
echo "DO NOT CLOSE THIS WINDOW while the bot is running!"
echo

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Press Enter to exit..."
    read
    exit 1
fi

# Install dependencies and start the bot
npm install
node index.js

echo "Press Enter to exit..."
read
