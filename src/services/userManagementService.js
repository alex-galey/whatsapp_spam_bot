class UserManagementService {
    getChatUserKey(chat, contact) {
        return `${chat.id._serialized}|${contact.id._serialized}`;
    }
}

module.exports = new UserManagementService();
