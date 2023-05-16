const Chat = require('../model/chatModel');
const sequelize = require('../util/db')
const { Op } = require("sequelize"); // provides operators in sequelize
const Group = require('../model/groupModel')


const sandesh = async( req,res)=>{
    try{
        
        const name = req.body.name;
        const chat = req.body.chat;
        const userId = req.body.userId;
        const groupId = req.body.groupId

        if(name==undefined||name.length===0){return res.status(400).json({message:'empty name'})}
        if(chat==undefined||chat.length===0){return res.status(400).json({message:'empty chat'})}
        
        
        await Chat.create({
            name: name,
            chat: chat,
          userId: userId,
          groupId: groupId
        })
        return res.status(201).json({message:'chat sent success'})

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'server error'})
    }
    
}

// const allSandesh = async (req, res, next) => {
//     try {
//       const lastMessageId = parseInt(req.query.lastMessageId) || 0;
//       console.log(lastMessageId);
//       const messages = await Chat.findAll({
//         where: {
//           id: { [Op.gt]: lastMessageId } // Op.gt refers to greater than operator
//         },                               // with this we can get all the messages whove id is greater than query id       
//           limit: 10,
//           order: [['id', 'DESC']]     // and setting the limit to 10 so that no more than  10 message swill go in response 
//       });                                 // because we have restricted local storage to store 10 messages only      
  
//       return res.status(200).json(messages);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "server issue" });
//     }
//   };
  
const allSandesh = async (req, res, next) => {
  try {
    const id = req.params.groupId
    console.log(id);
    const messages = await Chat.findAll({
      where: {
       groupId : id 
      },                                 
        limit: 10,
        order: [['groupId', 'DESC']]    
    });                                      

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server issue" });
  }
};


module.exports = {sandesh, allSandesh}