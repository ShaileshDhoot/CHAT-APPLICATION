const jwt = require('jsonwebtoken');

const User= require('../model/userModel')

const userAuthentication =async (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.SECRET_KEY)
        //console.log(user);
        User.findByPk(user.userId)
        .then((user)=>{
           // console.log(user,'user after finding by id');
            req.user = user
            //console.log('req.user in auth-->',req.user);
            next()
            return
        }).catch(err=>console.log(err)) 

    }catch(error){
        console.log(error, 'error in authentication middleware')
        res.status(401).json({ message: 'middleware issue , check there' });
    }
}

module.exports = {userAuthentication}