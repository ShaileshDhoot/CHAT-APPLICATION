const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
  const name = req.body.name;
  const number = req.body.mobile;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !number || !email || !password) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    const userExist = await User.findOne({
        where: {
          [Op.or]: [
            { email: { [Op.eq]: email } },
            { mobile: { [Op.eq]: number } }
          ]
        }
      });
  
    

    if (userExist) {
      return res.status(409).send({ message: 'User already exists, Please Login' });
    }

    const hash = bcrypt.hashSync(password, 10);
    await User.create({
      name: name,
      mobile: number,
      email: email,
      password: hash,
    });

    res.status(201).send({ message: 'Signup success Welcome to Chat App' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
};


const generateAccessToken=(id)=>{
  return jwt.sign({userId: id},process.env.SECRET_KEY)
}



const login =async (req,res)=>{
 
  const emailId = req.body.email
  const password = req.body.password

  User.findOne({ where: { email: emailId } })
  .then(user => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: "Server error" })
      }else if (result) {
           // console.log('success')
        return res.status(200).send({message: "welcome", token: generateAccessToken(user.id)});            
      }else {
        res.status(401).send({ message: "Invalid password" })
      }
        })
      } else {
        res.status(404).send({ message: "User does not exist" })
      }
  })
  .catch(err => {
    console.log(err);
    res.status(500).send({ message: "Server error" })
  })  
  
}

module.exports = { signUp ,generateAccessToken, login};
