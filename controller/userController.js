const User = require('../model/userModel')
const bcrypt = require('bcrypt');

const signUp = async(req,res)=>{
    
    
    const Name = req.body.Name;
    const Number = req.body.number;
    const Email = req.body.email;
    const Password = req.body.password

    if (!Password) {
       return res.status(400).send({ message: "Password is required" });
    }
    if (!Name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!Number) {
       return res.status(400).send({ message: "Number is required" });
    }
    if (!Email) {
       return res.status(400).send({ message: "Email is required" });
    }

    try{
        const userExist = await User.findOne({where:{email:Email} && {mobile:Number}})
        if(userExist){
        return res.status(409).send({ message: "User already exists" });
        }
        const hash =  bcrypt.hashSync(Password, 10);
        await User.create({
            name: Name,
            mobile: Number,
            email: Email,
            password: hash
        })
         res.status(201).send({ message: "User created successfully" }); 
    }catch (error){
        console.log(error);
        res.status(500).send({ message: "Server error" });
    }   
}

module.exports ={signUp}