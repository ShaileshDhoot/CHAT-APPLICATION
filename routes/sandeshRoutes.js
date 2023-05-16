const express = require('express');
const router = express.Router();

const sandeshController = require('../controller/sandeshController')
const middleware = require('../middleware/auth')

router.post('/message',  sandeshController.sandesh)

router.get('/message/:groupId', sandeshController.allSandesh)

module.exports = router