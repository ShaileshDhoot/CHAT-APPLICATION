const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./util/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoutes);

app.use((req, res, next) => {
    console.log('url---->>>',req.url)
    res.sendFile(path.join(__dirname,`views/${req.url}`))
  });

sequelize.sync()  // {force:true}
.then(()=>{
    app.listen(process.env.PORT || 3000);
})
.catch(err=> console.log(err));
