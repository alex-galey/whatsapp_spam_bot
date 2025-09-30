# WhatsApp Anti-Spam Bot

This bot monitors WhatsApp community groups for spam and investment scams. It can be configured to monitor any WhatsApp community.

## Setup

### Configure the bot:
1. Copy `.env.example` to `.env`:
   - Windows: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`
2. Edit `.env` and configure:
   - `WARNING_RECIPIENT`: Your phone number to receive notifications
     - Use international format with or without + sign
     - Example: +31612345678 or 31612345678
   - `COMMUNITY_ID`: The ID of the WhatsApp community to monitor
     - Format: number@g.us
     - How to find your community ID:
       1. Add the bot to your community
       2. Send a message in any subgroup
       3. Look for "parentGroup" in the console logs
       4. Copy the ID that looks like "123456789@g.us"

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

## Features
- Monitors all groups within a specified WhatsApp community
- Detects spam and investment scam messages
- Sends notifications to a specified phone number
- Works with any WhatsApp community
- Automatically detects new groups added to the community

## Important Notes:
- You only need to scan the QR code once
- DO NOT close the window while you want the bot to run
- To stop the bot, simply close the window
- To start it again, just double-click the start file again
- The bot must be a member of the community to monitor it
- Messages are only checked in community subgroups, not in private chats
