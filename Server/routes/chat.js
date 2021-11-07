const express = require('express');
const { fetchChats, fetchChatSingle, fetchGroupChatSingle } = require('../controllers/chat')

const router = express.Router();
const isAuth = require('../middleware/Auth');

router.get('/allchats',isAuth, fetchChats);
router.get('/single/:id', isAuth, fetchChatSingle);
router.get('/groupmessage/:idg', isAuth, fetchGroupChatSingle);


module.exports = router;