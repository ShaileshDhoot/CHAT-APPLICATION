const express = require('express');
const router = express.Router();

const userController = require('../controller/userController')

router.post('/signup', userController.signUp)
router.post('/login', userController.login)
router.get('/all', userController.getAllUserNames)

module.exports= router