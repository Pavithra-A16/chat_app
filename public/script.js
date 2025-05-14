const socket = io();
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const userList = document.getElementById('user-list');
const emojiPanel = document.getElementById('emoji-panel');

let username = prompt("Please enter your username");

if (username) {
  socket.emit('register', username);
}


const emojis = ["😊", "😂", "❤️", "🔥", "👍", "😎", "🎉", "🥳", "😢", "😡"];


emojis.forEach(emoji => {
  const emojiSpan = document.createElement('span');
  emojiSpan.textContent = emoji;
  emojiSpan.classList.add('emoji');
  emojiPanel.appendChild(emojiSpan);

  emojiSpan.addEventListener('click', () => {
    messageInput.value += emoji;
  });
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message === '') return;

  socket.emit('chat message', { message, to: 'All' });
  messageInput.value = '';
}

socket.on('chat message', ({ sender, message, to }) => {
  const div = document.createElement('div');
  div.classList.add('chat-message');
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('update-users', (users) => {
  userList.innerHTML = `Users Online: ${users.join(', ')}`;
});
