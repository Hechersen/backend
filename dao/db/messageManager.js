const Message = require('../../models/message');
const logger = require('../../utils/logger');

class MessageManager {
  async addMessage(messageData) {
    try {
      const message = new Message(messageData);
      await message.save();
      return message;
    } catch (error) {
      logger.error('Error adding message:', error);
      throw new Error('Error adding message');
    }
  }

  async getAllMessages() {
    try {
      return await Message.find();
    } catch (error) {
      logger.error('Error retrieving messages:', error);
      throw new Error('Error retrieving messages');
    }
  }
}

module.exports = MessageManager;
