const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const chatList = document.querySelector('#chat-list');


const user = localStorage.getItem('userName')
const heading = document.getElementById('heading')
heading.innerHTML = `<h1>Hi ${user}  Welcome to Sandesh</h1>`


function addChatMessage(element) {
  const li = document.createElement('li');
  li.classList.add('chat-message');

  const content = document.createElement('div');
  content.classList.add('chat-message-content');
  console.log(element);
  content.innerHTML = `<p>${element.name}: ${element.chat}</p>`;
  li.appendChild(content);

  chatList.appendChild(li);
}



const sendMessageBE =  (e)=>{
    e.preventDefault()
    const token = localStorage.getItem("token");
    const message = messageInput.value.trim()

    if(!message){
        return ;
    }

    axios.post('/sandesh/message', {
        name: user,
        chat: message
    },{ headers: { 'Authorization': token } })
    .then((response)=>{
        console.log('post requrest response', response);
        messageInput.value = '';
        window.location.reload();
    })
    .catch((err) => console.log(err));
}

sendButton.addEventListener('click', sendMessageBE);

window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();

    const token = localStorage.getItem('token')
    axios.get('/sandesh/message/all', { headers: { Authorization: token } })
    .then((response)=>{
        console.log(response);
        console.log(response.data);
        response.data.forEach((message) => {
        addChatMessage(message);
        })
    })
})