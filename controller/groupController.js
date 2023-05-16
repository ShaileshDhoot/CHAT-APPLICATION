const  Group = require("../model/groupModel");

const createGroup = async (req, res) => {
    const { name, members } = req.body;
    const membersString = members.join(',');
    try {
       
      const group = await Group.create({ name, members:membersString,userId: req.user.id });
      res.status(201).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}

const showGroup = async(req,res)=>{
  const userGroups = []

  Group.findAll()
    .then(groups => {
      const userId = req.params.userId
      groups.forEach(group => {
        const members = group.members.split(',')
        if (members.includes(userId)) {
          userGroups.push({ id: group.id, name: group.name });
          console.log(userGroups);
        }
      });
  
      res.status(200).json(userGroups);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  
}

module.exports = {createGroup,showGroup}