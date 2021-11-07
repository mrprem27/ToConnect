const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/Auth');

const { addFriend, removeFriend, removeRequestFriend, acceptRequestFriend, cancelRequest, fetchFriends } = require('../controllers/friends');
const { fetchUser, createUser, checkUser, logout, fetchAllUsers, editUser, fetchSearchUsers, checkLogin } = require('../controllers/user');
const { fetchRequests } = require('../controllers/requests');


router.get('/search/query/:str', isAuth, fetchSearchUsers);
router.get('/search/allusers', isAuth, fetchAllUsers);
router.patch('/logout',isAuth,logout);
router.get(`/logincheck`, isAuth, checkLogin);

router.get('/get/:id', isAuth, fetchUser);
router.post('/signup', createUser);
router.post('/login', checkUser);
router.put('/edit', isAuth, editUser);

router.patch('/friends/cancel/:id', isAuth, cancelRequest);
router.patch('/friends/add/:id', isAuth, addFriend);
router.patch('/friends/remove/:id', isAuth, removeFriend);
router.patch('/friends/removeRequest/:id', isAuth, removeRequestFriend);
router.patch('/friends/acceptRequest/:id', isAuth, acceptRequestFriend);
router.get('/friends/:id', isAuth, fetchFriends);


router.get('/requests', isAuth, fetchRequests);
// router.get('/',(req,res)=>{
//     console.log(req.params);
// })

module.exports = router;