# WhatsApp Anti-Spam Bot for Kawan Community

This bot monitors Kawan Community groups for spam and investment scams. It automatically detects all subgroups that are part of the Kawan Community and sends notifications when potential spam is detected.

## Setup

### Configure the bot:
1. Copy `.env.example` to `.env`:
   - Windows: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`
2. Edit `.env` and set your phone number in `WARNING_RECIPIENT`
   - Use international format with or without + sign
   - Example: +31612345678 or 31612345678

## Quick Start

### Windows Users:
1. Install Node.js from https://nodejs.org/ (Download the "LTS" version)
2. Double-click the `start.bat` file
3. When you see a QR code, scan it with WhatsApp on your phone
4. Keep the window open to keep the bot running

### macOS Users:
1. Install Node.js from https://nodejs.org/ (Download the "LTS" version)
2. Double-click the `start.sh` file
   - If you get a security warning, right-click the file and select "Open"
3. When you see a QR code, scan it with WhatsApp on your phone
4. Keep the window open to keep the bot running

## Important Notes:
- You only need to scan the QR code once
- DO NOT close the window while you want the bot to run
- To stop the bot, simply close the window
- To start it again, just double-click the start file again
