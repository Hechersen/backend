const Message = require('../../models/message');

class MessageManager {
  async addMessage(messageData) {
    try {
      const message = new Message(messageData);
      await message.save();
      return message;
    } catch (error) {
      throw new Error('Error adding message');
    }
  }

  async getAllMessages() {
    try {
      return await Message.find();
    } catch (error) {
      throw new Error('Error retrieving messages');
    }
  }
}

module.exports = MessageManager;
