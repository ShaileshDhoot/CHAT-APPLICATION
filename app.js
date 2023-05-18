const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

const User = require('./model/userModel')
const Chat = require('./model/chatModel')
const Group = require('./model/groupModel');


dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRoutes);
app.use('/group', groupRoutes);

app.use(express.static(path.join(__dirname, 'views')));

const { handleChatMessage, handleLoadPreviousMessages } = require('./controller/sandeshController');

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
  });

  socket.on('chat message', (message) => {
    const { groupId } = message;
    socket.to(groupId).emit('chat message', message);
    handleChatMessage(io, socket, message); // Call the handleChatMessage function from the controller
  });

  socket.on('load previous messages', async (groupId) => {
    await handleLoadPreviousMessages(socket, groupId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsTo(Group);
Group.hasMany(User)

Group.hasMany(Chat);
Chat.belongsTo(Group)

// sequelize.sync()  // {force:true}
// .then(()=>{
//     app.listen( 3000);
// })
// .catch(err=> console.log(err));

http.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000');
  });