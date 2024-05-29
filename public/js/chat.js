document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    document.getElementById('messageForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const userEmail = document.getElementById('userEmail').value;
      const messageContent = document.getElementById('messageContent').value;
      const message = { user: userEmail, message: messageContent };
      socket.emit('new message', message);
    });
  
    socket.on('message update', (message) => {
      const item = document.createElement('li');
      item.textContent = `${message.user}: ${message.message}`;
      document.getElementById('messages').appendChild(item);
    });
  });
  