const Sequelize= require('sequelize');

const sequelize = require('../util/db');

const Chat = sequelize.define('chat', {
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
    chat:{
        type: Sequelize.STRING,
        allowNull: false 
    }
  });
  
  module.exports = Chat