const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const sequelize = require('../util/db');
const { Op } = require('sequelize');

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

module.exports = { signUp };
