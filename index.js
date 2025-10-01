// Suppress punycode deprecation warning
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) return;
    console.warn(warning.name, warning.message);
});

require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const spamDetectionService = require('./src/services/spamDetectionService');
const { DisciplineService } = require('./src/services/disciplineService');
const { COMMUNITY_ID } = require('./src/config/constants');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const handleError = (context, error) => {
    console.error(`❌ Error ${context}:`, error.message);
    if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', error);
    }
};

async function getCommunityName() {
    try {
        if (!COMMUNITY_ID) return 'Unknown Community';
        const chat = await client.getChatById(COMMUNITY_ID);
        return chat?.name || 'Unknown Community';
    } catch (error) {
        handleError('getting community name', error);
        return 'Unknown Community';
    }
}

client.on('qr', qr => {
    console.log('🔄 Scan QR Code to connect:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    const communityName = await getCommunityName();
    console.log(`✅ Bot is ready - Monitoring community: ${communityName}`);
});

client.on('loading_screen', (percent, message) => {
    if (percent % 25 === 0) console.log(`🔄 Loading: ${percent}% - ${message}`);
});

client.on('authenticated', () => console.log('🔐 Authentication successful'));
client.on('auth_failure', error => handleError('authentication', error));
client.on('disconnected', reason => console.log('📴 Disconnected:', reason));

client.on('message_create', async (msg) => {
    try {
        if (!msg) return;

        const chat = await msg.getChat();
        const contact = await msg.getContact();

        if (!chat || !contact || contact.isMe) return;

        const shouldMonitor = await DisciplineService.shouldMonitorMessage(chat);
        if (!shouldMonitor) return;

        const text = (msg.body || '').trim();
        const spamCheck = spamDetectionService.checkMessage(
            text,
            msg.forwardingScore,
            chat.id._serialized
        );

        if (spamCheck.isSpam) {
            await DisciplineService.applyDiscipline({
                client,
                chat,
                contact,
                reason: spamCheck.reasons.join(', '),
                isInvestmentScam: spamCheck.isInvestmentScam
            });
        }
    } catch (err) {
        handleError('processing message', err);
    }
});

console.log('🚀 Starting WhatsApp Anti-Spam Bot...');
client.initialize();
