const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const sandeshRoutes = require('./routes/sandeshRoutes')

const User = require('./model/userModel');
const Chat = require('./model/chatModel');
const Group = require('./model/groupModel');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/sandesh', sandeshRoutes)

app.use(express.static(path.join(__dirname, 'views')));

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsTo(Group);
Group.hasMany(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Event listener for receiving a message from the client
  socket.on('send-message', (message,groupId) => {
    const { name, chat, userId } = message;

    // Event listener for joining a group
    socket.join(groupId);

    // Save the chat message to the database
    Chat.create({ name, chat, userId,groupId }).then(() => {
    // Emit the chat message to all clients in the same group
    console.log(groupId,'-->groupid');    
    console.log(('fokat ka'));
    });
    socket.to(groupId).emit('send-message', message);

  });

  // Event listener for leaving a group
  socket.on('leaveGroup', (groupId) => {
    socket.leave(groupId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
