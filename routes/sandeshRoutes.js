const express = require('express');
const router = express.Router();

const sandeshController = require('../controller/sandeshController')
const middleware = require('../middleware/auth')

router.post('/message', middleware.userAuthentication, sandeshController.sandesh)

router.get('/message/all', middleware.userAuthentication, sandeshController.allSandesh)

module.exports = router