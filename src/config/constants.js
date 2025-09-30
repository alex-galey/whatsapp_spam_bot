require('dotenv').config();

const WARNING_RECIPIENT = process.env.WARNING_RECIPIENT;
const COMMUNITY_ID = process.env.COMMUNITY_ID;

const INVESTMENT_PATTERNS = [
    /(?:bitcoin|btc|eth|ethereum|crypto)\s*investment/i,
    /investment\s*opportunity/i,
    /passive\s*income/i,
    /(?:double|triple|[\d]+x)\s*your\s*(?:money|bitcoin|btc|investment)/i,
    /trading\s*signals/i,
    /mining\s*profits?/i,
    /guaranteed\s*returns?/i,
    /investment\s*portfolio/i,
    /earn\s*daily/i,
    /crypto\s*mining/i,
    /binary\s*options?/i
];

const KEYWORD_BLACKLIST = [
    /free\s*bitcoin/i,
    /work from home \$\d+/i,
    /win\s+\$?[\d,]+/i,
    /viagra|cialis/i,
    /loan instantly/i,
    /forex signals?/i,
    /whatsapp spambot/i
];

const DOMAIN_BLACKLIST = [
    /bit\.ly/i, /tinyurl\.com/i, /t\.co/i, /wa\.me\/\d{6,}/i,
    /mega\.nz/i, /1xbet/i, /binancepromo/i,
    /crypto-?profits?\.com/i,
    /trading-?signals?\.com/i
];

const RATE_LIMIT = { messages: 5, seconds: 10 };

module.exports = {
    KEYWORD_BLACKLIST,
    DOMAIN_BLACKLIST,
    RATE_LIMIT,
    INVESTMENT_PATTERNS,
    WARNING_RECIPIENT,
    COMMUNITY_ID
};
