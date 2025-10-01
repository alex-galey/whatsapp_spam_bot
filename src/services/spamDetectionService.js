const { KEYWORD_BLACKLIST, DOMAIN_BLACKLIST, RATE_LIMIT, INVESTMENT_PATTERNS } = require('../config/constants');

class SpamDetectionService {
    constructor() {
        this.userState = new Map();
        this.logPatternCounts();
    }

    logPatternCounts() {
        const patterns = {
            'investment patterns': INVESTMENT_PATTERNS.length,
            'blacklisted keywords': KEYWORD_BLACKLIST.length,
            'blacklisted domains': DOMAIN_BLACKLIST.length
        };

        Object.entries(patterns).forEach(([name, count]) => {
            console.log(`📋 Loaded ${count} ${name}`);
        });
    }

    matchesPatterns(text, patterns) {
        if (!text) return false;
        
        for (const pattern of patterns) {
            if (pattern.test(text)) {
                console.log(`🚫 Matched pattern: "${pattern}" in text: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
                return true;
            }
        }
        return false;
    }

    isSpamText(text) {
        return this.matchesPatterns(text, [...KEYWORD_BLACKLIST, ...DOMAIN_BLACKLIST]);
    }

    isInvestmentScam(text) {
        return this.matchesPatterns(text, INVESTMENT_PATTERNS);
    }

    isBursting(chatUserKey) {
        const nowSec = Math.floor(Date.now() / 1000);
        const state = this.userState.get(chatUserKey) || { timestamps: [] };

        state.timestamps = [
            ...state.timestamps.filter(ts => nowSec - ts < RATE_LIMIT.seconds),
            nowSec
        ];

        this.userState.set(chatUserKey, state);

        const isBursting = state.timestamps.length >= RATE_LIMIT.messages;
        if (isBursting) {
            console.log(`⚡ Rate limit: ${state.timestamps.length} messages in ${RATE_LIMIT.seconds}s`);
        }
        return isBursting;
    }

    checkMessage(text, forwardingScore, chatUserKey) {
        console.log('\n📝 Starting message analysis...');
        console.log(`Message text (first 100 chars): "${(text || '').substring(0, 100)}${text && text.length > 100 ? '...' : ''}"`);
        
        const spamReasons = [];
        const checks = {
            blacklist: { result: this.isSpamText(text), type: 'blacklisted content/link' },
            investment: { result: this.isInvestmentScam(text), type: 'potential investment scam' },
            burst: { result: this.isBursting(chatUserKey), type: 'message burst' }
        };

        Object.entries(checks).forEach(([check, { result, type }]) => {
            console.log(`🔍 ${check} check: ${result ? '❌ Failed' : '✅ Passed'}`);
            if (result) spamReasons.push(type);
        });

        const isSpam = spamReasons.length > 0;
        
        console.log('\n📊 Analysis Summary:');
        if (isSpam) {
            console.log('❌ Message classified as SPAM');
            console.log(`❗ Reasons (${spamReasons.length}):`);
            spamReasons.forEach(reason => console.log(`   - ${reason}`));
        } else {
            console.log('✅ Message classified as LEGITIMATE');
            console.log('✨ All security checks passed');
        }
        console.log('------------------------');

        return {
            isSpam,
            reasons: spamReasons,
            isInvestmentScam: checks.investment.result
        };
    }
}

module.exports = new SpamDetectionService();
