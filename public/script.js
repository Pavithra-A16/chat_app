const socket = io();
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const sendButton = document.getElementById('send');
const emojiButton = document.getElementById('emoji-button');
const picker = new EmojiButton();

emojiButton.addEventListener('click', () => {
  picker.togglePicker(emojiButton);
});

picker.on('emoji', (emoji) => {
  input.value += emoji;
});

sendButton.addEventListener('click', () => {
  console.log('Send button clicked');
  if (input.value.trim()) {
    socket.emit('chat message', input.value);
    input.value = ''; 
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg; 
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight; 
});
