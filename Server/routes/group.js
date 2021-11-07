const express = require('express');
const isAuth = require('../middleware/Auth');
const { createGroup, addFriendToGroup, finalSumbitGroupData,fetchForAddToGroup,fetchGroups, fetchGroupSingle, removeFriendToGroup,editGroupName } = require('../controllers/group')

const router = express.Router();

router.post('/creategroup',isAuth, createGroup);
router.patch('/add/:idg/:id',isAuth, addFriendToGroup);
router.get('/remove/:idg/:id',isAuth, removeFriendToGroup);
router.get('/allgroups',isAuth,fetchGroups);
router.get('/single/:idg',isAuth, fetchGroupSingle);
router.put('/edit/name',isAuth, editGroupName);
router.get('/fetchtoadd/:idg',isAuth, fetchForAddToGroup);
router.put('/toadd/',isAuth, finalSumbitGroupData);

module.exports = router;