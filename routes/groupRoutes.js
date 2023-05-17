// routes/groups.js
const express = require("express");
const router = express.Router();
const GroupController = require('../controller/groupController')
const middleware = require('../middleware/auth')

// Create a new group
router.post("/create", middleware.userAuthentication,GroupController.createGroup );
router.get("/all/:userId", middleware.userAuthentication,GroupController.showGroup );
router.get("/members/:groupId", middleware.userAuthentication,GroupController.getGroupMembers );
router.put("/members/add/:groupId", middleware.userAuthentication,GroupController.addGroupMembers );
router.put("/members/delete/:groupId", middleware.userAuthentication,GroupController.deleteGroupMembers );
router.put("/add/admin/:groupId", middleware.userAuthentication,GroupController.addGroupAdmin );
router.delete('/delete/:groupId', GroupController.deleteGroup)

module.exports = router;
