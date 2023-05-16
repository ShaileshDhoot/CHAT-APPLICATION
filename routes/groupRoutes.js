// routes/groups.js
const express = require("express");
const router = express.Router();
const GroupController = require('../controller/groupController')
const middleware = require('../middleware/auth')

// Create a new group
router.post("/create", middleware.userAuthentication,GroupController.createGroup );
router.get("/all/:userId", middleware.userAuthentication,GroupController.showGroup );

module.exports = router;
