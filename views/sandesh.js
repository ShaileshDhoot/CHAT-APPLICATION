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
    const li = document.createElement("li")
    li.classList.add("chat-message")

    if (element.name === localStorage.getItem('userName')) {
      li.style.textAlign = "right"
    }   

    li.innerHTML = `${element.name}: ${element.chat}`    

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
    document.getElementById('groupNameDisplay').textContent = element.name;
    if (element.admin.split(',').includes(localStorage.getItem('userId'))) {
      document.getElementById('groupMenu').style.display = 'block';
      console.log('user is admin')
    } else {
      document.getElementById('groupMenu').style.display = 'none';
      console.log('user is not admin');
    }

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

// delete group

document.getElementById('deleteGroupBtn').addEventListener('click',()=>{

  const id = localStorage.getItem('groupId')
  axios.delete(`group/delete/${id}`)
  .then(()=>{
    console.log('group deleted');
  }).catch(err=>console.log(err))
})