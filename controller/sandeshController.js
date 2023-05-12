const Chat = require('../model/chatModel');
const User = require('../model/userModel');
const sequelize = require('../util/db')


const sandesh = async( req,res)=>{
    try{
        
        const name = req.body.name;
        const chat = req.body.chat;

        if(name==undefined||name.length===0){return res.status(400).json({message:'empty name'})}
        if(chat==undefined||chat.length===0){return res.status(400).json({message:'empty chat'})}
        
        
        await Chat.create({
            name: name,
            chat: chat,
            userId: req.user.id
        })
        return res.status(201).json({message:'chat sent success'})

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'server error'})
    }
    
}

const allSandesh = async(req,res,next)=>{
    try{

        const message = await Chat.findAll()
        return res.status(200).json(message)

    }catch(error){
        
        console.log(error);
        res.status(500).jason({message: 'server issue'})
    }
}

module.exports = {sandesh, allSandesh}