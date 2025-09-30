const { KEYWORD_BLACKLIST, DOMAIN_BLACKLIST, RATE_LIMIT, INVESTMENT_PATTERNS } = require('../config/constants');

class SpamDetectionService {
    constructor() {
        this.userState = new Map();
        console.log('🔍 Spam Detection Service initialized');
        console.log(`📋 Loaded ${INVESTMENT_PATTERNS.length} investment patterns`);
        console.log(`📋 Loaded ${KEYWORD_BLACKLIST.length} blacklisted keywords`);
        console.log(`📋 Loaded ${DOMAIN_BLACKLIST.length} blacklisted domains`);
    }

    isSpamText(text) {
        if (!text) return false;

        for (const rx of KEYWORD_BLACKLIST) {
            if (rx.test(text)) {
                console.log(`🚫 Matched blacklisted keyword pattern: ${rx}`);
                return true;
            }
        }

        for (const rx of DOMAIN_BLACKLIST) {
            if (rx.test(text)) {
                console.log(`🚫 Matched blacklisted domain: ${rx}`);
                return true;
            }
        }
        return false;
    }

    isInvestmentScam(text) {
        if (!text) return false;

        for (const pattern of INVESTMENT_PATTERNS) {
            if (pattern.test(text)) {
                console.log(`💰 Matched investment scam pattern: ${pattern}`);
                return true;
            }
        }
        return false;
    }

    isBursting(chatUserKey) {
        const nowSec = () => Math.floor(Date.now() / 1000);
        const state = this.userState.get(chatUserKey) || { timestamps: [] };
        const t = nowSec();

        state.timestamps = state.timestamps.filter(ts => t - ts < RATE_LIMIT.seconds);
        state.timestamps.push(t);
        this.userState.set(chatUserKey, state);

        if (state.timestamps.length >= RATE_LIMIT.messages) {
            console.log(`⚡ Rate limit exceeded: ${state.timestamps.length} messages in ${RATE_LIMIT.seconds} seconds`);
            return true;
        }
        return false;
    }

    checkMessage(text, forwardingScore, chatUserKey) {
        console.log('\n🔍 Starting message analysis...');
        const spamReasons = [];

        if (this.isSpamText(text)) {
            spamReasons.push('blacklisted content/link');
        }

        if (this.isInvestmentScam(text)) {
            spamReasons.push('potential investment scam');
        }

        if (this.isBursting(chatUserKey)) {
            spamReasons.push('message burst');
        }

        const result = {
            isSpam: spamReasons.length > 0,
            reasons: spamReasons,
            isInvestmentScam: this.isInvestmentScam(text)
        };

        if (result.isSpam) {
            console.log('❌ Message classified as spam');
            console.log(`📝 Reasons: ${result.reasons.join(', ')}`);
        } else {
            console.log('✅ Message appears to be legitimate');
        }

        return result;
    }
}

module.exports = new SpamDetectionService();
