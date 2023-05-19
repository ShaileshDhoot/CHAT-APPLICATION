const socket = io();
const sendButton = document.querySelector('#send-button')
const messageForm = document.querySelector('#message-form');
// chat message input box
const messageInput = document.querySelector('#message-input');

// UL for chats
const chatList = document.querySelector('#chat-list');
//UL for groups
const chatGroup = document.querySelector('#chat-group')

//
const user = localStorage.getItem('userName');
const heading = document.getElementById('heading');
heading.innerText = `Hi ${user}  Welcome to Sandesh`;

  // Join a specific group room
  const groupId = localStorage.getItem('groupId')
  // Event listener for receiving a message from the server
  socket.on('send-message', (data) => {
    console.log('gyhfhfghfg');
    addChatMessage(data);
  });

// post chat to BE
// need to send object which have sender name (acquire from LS) and message from input box
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const message = messageInput.value.trim();
  if (message) {
    const senderName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const groupId = localStorage.getItem('groupId');
    

    const chatMessage = {
      name: senderName,
      chat: message,
      userId: userId
    };
    console.log(chatMessage)
    addChatMessage(chatMessage)
    socket.emit('send-message', chatMessage,groupId);
    messageInput.value = ''
  }
})


// show groups on left side of page

function displayGroup(element) {
  const li = document.createElement('li');
  const newGroup = document.createElement('button');

  newGroup.innerText = element.name;
  newGroup.id = element.id;

  newGroup.addEventListener('click', () => {
    localStorage.setItem('groupId', element.id);
    messageForm.style.display = 'block';
    document.getElementById('groupNameDisplay').textContent = element.name;

    axios
      .get(`/sandesh/message/${element.id}`)
      .then(response => {
        response.data.forEach(data => {
          addChatMessage(data);
        });
      })
      .catch(error => console.log(error));
  });

  if (element.admin.split(',').includes(localStorage.getItem('userId'))) {
    document.getElementById('groupMenu').style.display = 'block';
    document.getElementById('chat-list').style.display = 'block';
    console.log('User is an admin');
  } else {
    document.getElementById('groupMenu').style.display = 'none';
    console.log('User is not an admin');
  }

  document.getElementById('groupName').value= ""
  newGroup.style.width = '100%'
  // Append the newGroup button to the li element
  li.appendChild(newGroup);

  // Append the li element to the chatGroup UL
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


function addChatMessage(element) {
  const li = document.createElement("li");
  li.classList.add("chat-message");

  if (element.name === localStorage.getItem('userName')) {
    li.style.textAlign = "right";
    li.textContent = `${element.chat} : ${element.name} `;
  }   

  li.textContent = `${element.name}: ${element.chat}`;

  chatList.appendChild(li);
}



// create group form // create group

document.getElementById('createGroupFormBtn').addEventListener('click', ()=>{
   
  const groupName = document.getElementById('groupName').value;
  const checkboxes = Array.from(document.querySelectorAll('#groupMembers input[type="checkbox"]'))// to create array of checked values
  console.log(checkboxes);
  const members = checkboxes
    .filter(checkbox => checkbox.checked)// filter out the names that have been checked
    .map(checkbox => checkbox.value) // map out the names and then we get array of names selected
    console.log(members);
     const admin =  localStorage.getItem('userId');
    axios.post("/group/create", { createdBy:admin, groupName, members}, {
      headers: {
        Authorization:  localStorage.getItem('token')
      }
    })
    
      .then((response) => {
        console.log('created new group');
        document.getElementById('groupDetails').style.display = 'none'    
        window.location.reload()   
      })
      .catch((error) => {
        console.error(error);
      });  
}) 

createGroupBtn.addEventListener('click', () => {
  document.getElementById('chat-list').style.display = 'none';
  document.getElementById('groupDetails').style.display = 'block';

  axios.get('/user/all')
    .then(response => {
      const users = response.data;
      let checkboxesHtml = '';

      users.forEach(user => {
        checkboxesHtml += `<label><input type="checkbox" value="${user.id}" />  ${user.name}  </label><br>`
      });

      document.getElementById('groupMembers').innerHTML = checkboxesHtml;
      
    })
    .catch(error => {
      console.log(error);
    });
});
//---***************

//Add more members to the group

document.getElementById('addMemberBtn').addEventListener('click',()=>{
  document.getElementById('groupUpdate').style.display = 'block';
  axios.get('/user/all')
  .then(response => {
    const users = response.data;
    let checkboxesHtml = '';

    users.forEach(user => {
      checkboxesHtml += `<label><input type="checkbox" value="${user.id}" />  ${user.name}  </label><br>`
    });

    document.getElementById('updateGroupMembers').innerHTML = checkboxesHtml;
  })
  .catch(error => {
    console.log(error);
  });

})

document.getElementById('updateGroupFormBtn').addEventListener('click', ()=>{
   
  const checkboxes = Array.from(document.querySelectorAll('#updateGroupMembers input[type="checkbox"]'))// to create array of checked values
  //console.log(checkboxes);
  const members = checkboxes
    .filter(checkbox => checkbox.checked)// filter out the names that have been checked
    .map(checkbox => checkbox.value) // map out the names and then we get array of names selected
    console.log(members);
      const groupID = localStorage.getItem('groupId')
    axios.put(`/group/members/add/${groupID}`, {  members }, {
      headers: {
        Authorization:  localStorage.getItem('token')
      }
    })
    
      .then((response) => {
        console.log('updated group');
        document.getElementById('groupUpdate').style.display = 'none'       
      })
      .catch((error) => {
        console.error(error);
      });  
})



// delete members of group
document.getElementById('deleteMemberBtn').addEventListener('click',()=>{
  document.getElementById('deleteMemberFromGroup').style.display = 'block';
  const groupId = localStorage.getItem('groupId')
  axios.get(`/group/members/${groupId}`, {headers: {Authorization:  localStorage.getItem('token')}})
  .then(response => {
    const users = response.data;
    let checkboxesHtml = '';

    users.forEach(user => {
      checkboxesHtml += `<label><input type="checkbox" value="${user.id}" />  ${user.name}  </label><br>`
    });

    document.getElementById('deleteGroupMembers').innerHTML = checkboxesHtml;
  })
  .catch(error => {
    console.log(error);
  });

})

document.getElementById('deleteMemberFromGroupFormBtn').addEventListener('click', ()=>{
   
  const checkboxes = Array.from(document.querySelectorAll('#deleteGroupMembers input[type="checkbox"]'))// to create array of checked values
  //console.log(checkboxes);
  const members = checkboxes
    .filter(checkbox => checkbox.checked)// filter out the names that have been checked
    .map(checkbox => checkbox.value) // map out the names and then we get array of names selected
    console.log(members);
      const groupID = localStorage.getItem('groupId')
    axios.put(`/group/members/delete/${groupID}`, {  members }, {
      headers: {
        Authorization:  localStorage.getItem('token')
      }
    })
    
      .then((response) => {
        console.log('updated group');
        document.getElementById('deleteMemberFromGroup').style.display = 'none'       
      })
      .catch((error) => {
        console.error(error);
      });  
})



// add admin to the group

document.getElementById('addAdminBtn').addEventListener('click', () => {
  document.getElementById('addAdminForm').style.display = 'block';
  axios.get(`/group/members/${localStorage.getItem('groupId')}`, {headers: {Authorization:  localStorage.getItem('token')}})
    .then(response => {
      const users = response.data;
      let checkboxesHtml = '';

      users.forEach(user => {
        checkboxesHtml += `<label><input type="checkbox" value="${user.id}" />  ${user.name}  </label><br>`;
      });

      document.getElementById('addAdminMembers').innerHTML = checkboxesHtml;
    })
    .catch(error => {
      console.log(error);
    });
});

document.getElementById('addAdminFormBtn').addEventListener('click', () => {
  const checkboxes = Array.from(document.querySelectorAll('#addAdminMembers input[type="checkbox"]'));
  const admins = checkboxes
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  const groupId = localStorage.getItem('groupId');
  axios.put(`/group/add/admin/${groupId}`, { userIds: admins }, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then((response) => {
      console.log('Updated group:', response.data);
      document.getElementById('addAdminForm').style.display = 'none';
    })
    .catch((error) => {
      console.error(error);
    })
})



// delete group

document.getElementById('deleteGroupBtn').addEventListener('click',()=>{

  const id = localStorage.getItem('groupId')
  axios.delete(`group/delete/${id}`)
  .then(()=>{
    console.log('group deleted');
    location.reload()
  }).catch(err=>console.log(err))
})

// ecsape button function
window.addEventListener('keydown', (event) => {
  console.log('escape key pressed');
  if (event.key === 'Escape') { // Check if the Escape key is pressed
    localStorage.setItem('groupId', ''); // Set the groupId in local storage to null
    messageForm.style.display = 'none'
    window.location.reload();
  }
});



