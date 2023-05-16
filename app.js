const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./util/db');
const userRoutes = require('./routes/userRoutes');
const sandeshRoutes = require('./routes/sandeshRoutes')
const groupRoutes = require('./routes/groupRoutes')
const User = require('./model/userModel')
const Chat = require('./model/chatModel')
const Group = require('./model/groupModel');


dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRoutes);
app.use('/sandesh', sandeshRoutes)
app.use('/group', groupRoutes)

app.use(express.static(path.join(__dirname, 'views')));


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsTo(Group);
Group.belongsTo(User)

Group.hasMany(Chat);
Chat.belongsTo(Group)

sequelize.sync()  // {force:true}
.then(()=>{
    app.listen(process.env.PORT || 3000);
})
.catch(err=> console.log(err));
