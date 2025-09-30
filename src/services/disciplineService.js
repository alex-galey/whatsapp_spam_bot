const { WARNING_RECIPIENT, COMMUNITY_ID } = require('../config/constants');

async function isGroupFromCommunity(chat) {
    try {
        console.log('🔍 Checking group metadata:');
        console.log('- Group name:', chat.name);
        console.log('- Is group?', chat.isGroup);

        if (!COMMUNITY_ID) {
            console.log('⚠️ No community ID configured');
            return false;
        }

        // First check if it's a group
        if (!chat.isGroup) {
            return false;
        }

        // Check if this group belongs to the configured community
        if (chat.groupMetadata?.parentGroup?._serialized === COMMUNITY_ID) {
            console.log('✅ Group is part of the monitored community');
            return true;
        }

        console.log('❌ Not part of the monitored community');
        return false;
    } catch (error) {
        console.error('❌ Error checking community status:', error.message);
        return false;
    }
}

class DisciplineService {
    async applyDiscipline({ client, chat, contact, reason, isInvestmentScam }) {
        try {
            if (!WARNING_RECIPIENT) {
                console.log('⚠️ No warning recipient configured, skipping notification');
                return;
            }

            if (!client || !chat || !contact) {
                console.error('❌ Missing required parameters for sending notification');
                return;
            }

            const chatName = chat.name || 'Unknown Chat';
            const userId = contact.id?.user || 'Unknown User';

            const notificationMessage = isInvestmentScam
                ? `🚨 Investment Scam Alert:\nGroup: ${chatName}\nUser: ${userId}\nMessage: ${reason}`
                : `🚨 Spam Alert:\nGroup: ${chatName}\nUser: ${userId}\nReason: ${reason}`;
            console.log('🚨 Preparing spam/scam notification');

            console.log(`📨 Attempting to send notification to ${WARNING_RECIPIENT}`);
            const recipientId = `${WARNING_RECIPIENT.replace(/[^0-9]/g, '')}@c.us`;
            await client.sendMessage(recipientId, notificationMessage);
            console.log('✅ Notification sent successfully');
        } catch (error) {
            console.error('❌ Error sending notification:', error);
            console.error('Error details:', {
                chat: chat?.name,
                contact: contact?.id?.user,
                reason
            });
        }
    }

    shouldMonitorMessage(chat) {
        try {
            return isGroupFromCommunity(chat);
        } catch (error) {
            console.error('❌ Error in shouldMonitorMessage:', error);
            return false;
        }
    }
}

module.exports = {
    DisciplineService: new DisciplineService(),
    isGroupFromCommunity
};
