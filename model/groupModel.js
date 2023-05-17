const Sequelize= require('sequelize');

const sequelize = require('../util/db');

const ChatGroup = sequelize.define('group', {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,        
      allowNull: false,
      primaryKey: true
    },
    createdBy:{
      type: Sequelize.TEXT,
      allowNull:false
    },
    groupName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    members:{
        type: Sequelize.TEXT,
        allowNull: false 
    }
  });

  module.exports = ChatGroup

    