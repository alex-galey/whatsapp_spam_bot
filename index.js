// Suppress punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
        return;
    }
    console.warn(warning.name, warning.message);
});

require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const spamDetectionService = require('./src/services/spamDetectionService');
const { DisciplineService } = require('./src/services/disciplineService');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('🔄 New QR Code received. Please scan:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready and listening for messages');
    console.log('👥 Monitoring all groups in Kawan Community');
});

client.on('loading_screen', (percent, message) => {
    console.log(`🔄 Loading: ${percent}% - ${message}`);
});

client.on('authenticated', () => {
    console.log('🔐 Bot has been authenticated successfully');
});

client.on('auth_failure', (error) => {
    console.error('❌ Authentication failed:', error);
});

client.on('disconnected', (reason) => {
    console.log('📴 Bot disconnected:', reason);
});

client.on('message_create', async (msg) => {
    try {
        if (!msg) {
            console.log('⚠️ Received empty message event');
            return;
        }

        const chat = await msg.getChat();
        if (!chat) {
            console.log('⚠️ Could not get chat information');
            return;
        }

        const contact = await msg.getContact();
        if (!contact) {
            console.log('⚠️ Could not get contact information');
            return;
        }

        if (contact.isMe) {
            console.log('🤖 Ignoring own message');
            return;
        }

        const shouldMonitor = await DisciplineService.shouldMonitorMessage(chat);
        if (!shouldMonitor) {
            return;
        }

        const text = (msg.body || '').trim();
        console.log(`👀 Checking message in ${chat.name}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

        const spamCheck = spamDetectionService.checkMessage(
            text,
            msg.forwardingScore,
            chat.id._serialized
        );

        if (spamCheck.isSpam) {
            console.log(`🚨 Detected ${spamCheck.isInvestmentScam ? 'investment scam' : 'spam'} message`);
            console.log(`📝 Reason: ${spamCheck.reasons.join(', ')}`);

            await DisciplineService.applyDiscipline({
                client,
                chat,
                contact,
                reason: spamCheck.reasons.join(', '),
                isInvestmentScam: spamCheck.isInvestmentScam
            });
        }
    } catch (err) {
        console.error('❌ Error processing message:', err.message);
        console.error('Error details:', err);
    }
});

console.log('🚀 Starting WhatsApp Anti-Spam Bot...');
client.initialize();
