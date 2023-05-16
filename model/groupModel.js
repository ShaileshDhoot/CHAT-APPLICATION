const Sequelize= require('sequelize');

const sequelize = require('../util/db');

const ChatGroup = sequelize.define('group', {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,        
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    members:{
        type: Sequelize.TEXT,
        allowNull: false 
    }
  });

  module.exports = ChatGroup

     // using userId to know who created the group, using association