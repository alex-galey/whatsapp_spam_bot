const { WARNING_RECIPIENT, COMMUNITY_ID } = require('../config/constants');

class DisciplineService {
    async isGroupFromCommunity(chat) {
        if (!chat?.isGroup || !COMMUNITY_ID) {
            return false;
        }

        try {
            const isCommunityGroup = chat.groupMetadata?.parentGroup?._serialized === COMMUNITY_ID;
            console.log(isCommunityGroup
                ? '✅ Group is part of the monitored community'
                : '❌ Not part of the monitored community');
            return isCommunityGroup;
        } catch (error) {
            console.error('❌ Error checking community status:', error.message);
            return false;
        }
    }

    async formatNotification(chat, contact, reason, isInvestmentScam) {
        const chatName = chat.name || 'Unknown Chat';
        const userId = contact.id?.user || 'Unknown User';

        return isInvestmentScam
            ? `🚨 Investment Scam Alert:\nGroup: ${chatName}\nUser: ${userId}\nMessage: ${reason}`
            : `🚨 Spam Alert:\nGroup: ${chatName}\nUser: ${userId}\nReason: ${reason}`;
    }

    async sendWarningMessage(client, message) {
        if (!WARNING_RECIPIENT || !client) {
            console.log('⚠️ No warning recipient or client configured');
            return false;
        }

        try {
            const recipientId = `${WARNING_RECIPIENT.replace(/[^0-9]/g, '')}@c.us`;
            await client.sendMessage(recipientId, message);
            console.log('✅ Warning notification sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending notification:', error.message);
            return false;
        }
    }

    async applyDiscipline({ client, chat, contact, reason, isInvestmentScam }) {
        if (!client || !chat || !contact) {
            console.error('❌ Missing required parameters for discipline');
            return;
        }

        const notificationMessage = await this.formatNotification(chat, contact, reason, isInvestmentScam);
        await this.sendWarningMessage(client, notificationMessage);
    }

    async shouldMonitorMessage(chat) {
        return this.isGroupFromCommunity(chat);
    }
}

module.exports = {
    DisciplineService: new DisciplineService()
};
