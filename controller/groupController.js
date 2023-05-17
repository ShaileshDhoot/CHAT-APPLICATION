const  Group = require("../model/groupModel");
const User = require('../model/userModel')

const createGroup = async (req, res) => {
  console.log(req.body)
    const { createdBy, groupName, members } = req.body;
    const membersString = members.join(',');
    try {
       
      const group = await Group.create({ createdBy, groupName, members:membersString });
      res.status(201).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}

const showGroup = async (req, res) => {
  try {
    const userGroups = [];

    const groups = await Group.findAll();
    const userId = req.params.userId;

    groups.forEach(group => {
      const members = group.members.split(',');
      if (members.includes(userId)) {
        userGroups.push({ id: group.id, name: group.groupName, admin: group.createdBy });
        // console.log(userGroups);
      }
    });

    res.status(200).json(userGroups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);

    const members = group.members.split(',');
    console.log(members,'logging members obtained from using groupid');
    // need to get names of users also from user table as per user id stored in members column
    const memberNames = await User.findAll({where: {id: members}});

    //get the member names from the user table
    const membersWithNames = memberNames.map((user) => ({
      id: user.id,
      name: user.name
    }));

    res.status(200).json(membersWithNames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const addGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { members } = req.body;
    const membersString = members.join(',');

    const group = await Group.findByPk(groupId);
    if (group) {
      group.members = membersString;
      await group.save();
      res.status(200).json({ message: 'Group updated successfully' });
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const membersToDelete = req.body.members

    const group = await Group.findByPk(groupId);

    group.members = group.members.split(',').filter((member) => !membersToDelete.includes(member)).toString()

    await group.save();

    res.status(200).json({ message: 'Group members deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while deleting group members.' });
  }
};


const addGroupAdmin = async (req, res) => {
  try {
    const { userIds } = req.body;
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    const createdByString = userIds.join(','); // convert userid array to strinf
    await group.update({ createdBy: createdByString });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const deleteGroup = async (req, res) => {
  try {
    const id = req.params.groupId;
    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.destroy();
    
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {createGroup,showGroup, getGroupMembers,addGroupMembers, deleteGroupMembers,addGroupAdmin, deleteGroup}