// chat message input box
const messageInput = document.querySelector('#message-input');
// send chat button
const sendButton = document.querySelector('#send-button');
// UL for chats
const chatList = document.querySelector('#chat-list');
//UL for groups
const chatGroup = document.querySelector('#chat-group')

//
const user = localStorage.getItem('userName');
const heading = document.getElementById('heading');
heading.innerText = `Hi ${user}  Welcome to Sandesh`;

// create group form

document.getElementById('createGroupFormBtn').addEventListener('click', ()=>{
   
    const name = document.getElementById('groupName').value;
    const members = Array.from(document.getElementById('groupMembers').selectedOptions).map(
      (option) => option.value
    );
      
    axios.post("/group/create", { name, members, userId:localStorage.getItem('userId'), groupId: localStorage.getItem('groupId') }, {
      headers: {
        Authorization:  localStorage.getItem('token')
      }
    })
    
      .then((response) => {
        console.log('created new group');
        document.getElementById('groupDetails').style.display = 'none'       
      })
      .catch((error) => {
        console.error(error);
      });  
})

// create group 

createGroupBtn.addEventListener('click', () => {

  document.getElementById('groupDetails').style.display = 'block';

  axios.get('/user/all')
    .then(response => {
      const users = response.data
      let optionsHtml = ''

      users.forEach(user => {
        optionsHtml += `<option value="${user.id}">${user.name}</option>`;
      })

      document.getElementById('groupMembers').innerHTML = optionsHtml;
    })
    .catch(error => {
      console.log(error);
    });
});

// post chat to BE

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId')
  const groupId = localStorage.getItem('groupId')
  const message = messageInput.value.trim();

  if (!message) {
      return;
  }

  axios.post('/sandesh/message', {
          name: user,
          chat: message,
          userId: userId,
          groupId: groupId
      }, {headers: {Authorization: token}})
      .then((response) => {
           console.log('post request response', response);
          messageInput.value = '';
      })
      .catch((err) => console.log(err));
})

  // call 10 chat from DB
  // will keep 10 chat in LS
// const userChatLS_length = 10;
// const allChatLS = JSON.parse(localStorage.getItem("allchat")) || [];
// const lastMessageId = allChatLS.length ? allChatLS[0].id : 0;
// const token = localStorage.getItem("token");
// axios
//   .get(`/sandesh/message?lastMessageId=${lastMessageId + 1}`, {
//     headers: { Authorization: token },
//   })
//   .then((response) => {
//     if (response.data) {
//         response.data.forEach((message) => {
//         allChatLS.unshift(message);
//         if (allChatLS.length > userChatLS_length) {
//           allChatLS.pop();
//       }  
//         localStorage.setItem("allchat", JSON.stringify(allChatLS));
//       });
//     }
//   })
//   .catch((err) => console.log(err));



  // thw way chat message display on DOM

function addChatMessage(element) {
    const li = document.createElement("li");
    li.classList.add("chat-message");

    const content = document.createElement("div")
    content.classList.add("chat-message-content")

    // Check if element.name matches the value in local storage
    if (element.name === localStorage.getItem('userName')) {
        content.classList.add("align-right"); // Add a CSS class to align the content to the right
    }

    content.innerHTML = `<p>${element.name}: ${element.chat}</p>`
    li.appendChild(content)

    chatList.appendChild(li)
}


// display the chat from LS
// document.addEventListener('DOMContentLoaded', () => {
//   const allChatLS = JSON.parse(localStorage.getItem("allchat")) || [];
//   //console.log(allChatLS);
//   if (allChatLS) {
//       allChatLS.forEach((message) => {
//           addChatMessage(message);
//       });
//   }
// })

// show groups on left side of page

function displayGroup(element){
  const li = document.createElement('li');
  const newGroup = document.createElement('button')
  //console.log(element);
  newGroup.innerText = element.name
  newGroup.id = element.id
  //console.log(newGroup.id);
  newGroup.addEventListener('click', () => {
    localStorage.setItem('groupId', element.id);
    document.getElementById('groupNameDisplay').textContent = element.name
    document.getElementById('groupMenu').style.display="block"
    axios.get(`/sandesh/message/${element.id}`)
      .then(response => {
        response.data.forEach(data => {
          addChatMessage(data);
        });
      })
      .catch(error => console.log(error));
  });
  document.getElementById('groupName').value= ""
  newGroup.style.width = '100%'
  li.appendChild(newGroup);
  chatGroup.appendChild(li);  
}

// show groups from DB

document.addEventListener('DOMContentLoaded', ()=>{
      
  axios.get(`/group/all/${localStorage.getItem('userId')}`, {
    headers: {
      Authorization:  localStorage.getItem('token')
    }
  })  
  .then((response) => {
    //console.log(response);
    response.data.forEach((element)=>{
      displayGroup(element)
    }) 
  })
  .catch(error => console.log(error));  
})

