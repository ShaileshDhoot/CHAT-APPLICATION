const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const chatList = document.querySelector('#chat-list');

const user = localStorage.getItem('userName');
const heading = document.getElementById('heading');
heading.innerHTML = `<h1>Hi ${user}  Welcome to Sandesh</h1>`;

// will keep 10 chat in LS
const userChatLS_length = 10;


function addChatMessage(element) {
    const li = document.createElement("li");
    li.classList.add("chat-message");
  
    const content = document.createElement("div");
    content.classList.add("chat-message-content");
    console.log(element);
    content.innerHTML = `<p>${element.name}: ${element.chat}</p>`;
    li.appendChild(content);
  
    chatList.appendChild(li);
  
}
  


// Call addChatMessage to add the new chat message from the DOM

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const message = messageInput.value.trim();

  if (!message) {
      return;
  }

  axios.post('/sandesh/message', {
          name: user,
          chat: message,
      }, {headers: {Authorization: token}})
      .then((response) => {
          console.log('post request response', response);
          // Add the message to local storage
          const allChatLS = JSON.parse(localStorage.getItem("allchat")) || [];
          allChatLS.unshift(response.data);
          if (allChatLS.length > userChatLS_length) {
              allChatLS.pop();
          }
          localStorage.setItem("allchat", JSON.stringify(allChatLS));
          // Clear the input field
          messageInput.value = '';
      })
      .catch((err) => console.log(err));
});
 


// to get message from backend --> LS has stored some and it wil get messages from after that id
// define a separate variable for lastMessageId



    const allChatLS = JSON.parse(localStorage.getItem("allchat")) || [];
    const lastMessageId = allChatLS.length ? allChatLS[0].id : 0;
  console.log(lastMessageId);
  console.log(allChatLS);
    const token = localStorage.getItem("token");
    axios
      .get(`/sandesh/message?lastMessageId=${lastMessageId + 1}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (response.data) {
            response.data.forEach((message) => {
            allChatLS.unshift(message);
            localStorage.setItem("allchat", JSON.stringify(allChatLS));
          });
        }
      })
      .catch((err) => console.log(err));

  

// display the chat stored in local storage on DOM when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const allChatLS = JSON.parse(localStorage.getItem("allchat")) || [];
  if (allChatLS) {
      allChatLS.forEach((message) => {
          addChatMessage(message);
      });
  }
});


