const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const chatList = document.querySelector('#chat-list');
const user = localStorage.getItem('userName')
const heading = document.getElementById('heading')
heading.innerHTML = `<h1>Hi ${user}  Welcome to Sandesh</h1>`

function addChatMessage(user,message) {
  const li = document.createElement('li');
  li.classList.add('chat-message');

  const content = document.createElement('div');
  content.classList.add('chat-message-content');
  content.innerHTML = `<p>${user}: ${message}</p>`;
  li.appendChild(content);

  chatList.appendChild(li);
}

// Handle sending a chat message
function sendMessage(event) {
  event.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    addChatMessage(user,message);
    messageInput.value = '';
  }
}

sendButton.addEventListener('click', sendMessage);
