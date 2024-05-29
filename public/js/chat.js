document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    socket.emit('chat message', { user: username, message });
  });

  socket.on('chat message', (msg) => {
    const item = document.createElement('div');
    item.textContent = `${msg.user}: ${msg.message}`;
    document.getElementById('messages').appendChild(item);
  });
});
