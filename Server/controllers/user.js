const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const fetchUser = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        let relation = 'notfriend';
        if (idc === id) {
            relation = 'self';
            const user = await User.findById(id, '_id username fullname fl bio dp sex');
            res.status(200).json({ user: user, relation: relation,idc:idc });
        }
        else {
            const user = await User.findById(id, 'fl rl pl _id username fullname bio dp sex');
            const userc = await User.findById(idc, 'fl rl pl _id username fullname');
            if (await userc.fl.includes(user._id))
                relation = 'friend';
            else if (await userc.pl.includes(user._id))
                relation = 'requester';
            else if (await userc.rl.includes(user._id))
                relation = 'accepter';
            else
                relation = 'notfriend';
            res.status(200).json({ user: user, relation: relation,idc:idc });
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const fetchAllUsers = async (req, res) => {
    const idc = req.userId;
    try {
        const allusers = await User.find({ select: '_id username fullname dp' });
        const fusers = allusers.filter((user) => user._id != idc);
        res.status(200).json(fusers);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const fetchSearchUsers = async (req, res) => {
    const idc = req.userId;
    const { str } = req.params;
    try {
        const searchUsers = await User.find({ username: { '$regex': str } }, '_id username fullname dp');
        const fusers = searchUsers.filter((user) => user._id != idc);
        res.status(200).json(fusers);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};

const createUser = async (req, res) => {
    const user = req.body;
    const newUser = new User(user);
    try {
        const userid = await newUser.save();
        res.status(201).send('Account Created');
    } catch (error) {
        res.status(409).send({ message: error.message });
    }
};
const checkUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }, '_id password');
        if (bcrypt.compare(password, user.password)) {
            payload = {
                user: {
                    _id: user._id
                }
            }
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '720hr' });
            res.cookie('tkn', token, { maxAge: 2592000000, httpOnly: true });
            res.status(200).json({ message: true, userId: user._id });
        }
        else
        res.status(200).json({ message: false });
    } catch (error) {
        res.status(200).json({ message: false });
    }
};
const checkLogin = async (req, res) => {
    res.status(200).json({ idc: req.userId });
}
const editUser = async (req, res) => {
    const user = req.body;
    const oldpass = user.oldPassword;
    const userid = user._id;
    delete user._id;
    delete user.oldPassword;
    try {
        if (oldpass) {
            try {
                const updatedata = await User.findOneAndUpdate({ _id: userid, password: oldpass }, user);
                if (updatedata)
                    res.status(200).send("Details updated");
                else
                    res.status(200).send('Wrong Old password');
            } catch (error) {
                res.status(200).send("Username is already in use Try another!!");
            }
        }
        else {
            delete user.password;
            await User.findByIdAndUpdate(userid, user);
            res.status(201).send("Details updated");
        }
    } catch (error) {
        res.status(200).send("Username is already in use Try another!!");
    }

}
const logout = async (req, res) => {
    try {
        res.clearCookie('tkn');
        console.log("logout sucessfully!!");
        res.status(200).send("sucess!!")
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = { logout, fetchSearchUsers, checkLogin, fetchUser, createUser, checkUser, fetchAllUsers, editUser };

// (node: 13572) UnhandledPromiseRejectionWarning: Error[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client  
//     at ServerResponse.setHeader(_http_outgoing.js: 561: 11)
//     at ServerResponse.header(C: \Users\Mr.Prem\Desktop\Chat app MERN Project\server\node_modules\express\lib\response.js: 771: 10)    
//     at ServerResponse.send(C: \Users\Mr.Prem\Desktop\Chat app MERN Project\server\node_modules\express\lib\response.js: 170: 12)      
//     at ServerResponse.json(C: \Users\Mr.Prem\Desktop\Chat app MERN Project\server\node_modules\express\lib\response.js: 267: 15)      
//     at checkUser(C: \Users\Mr.Prem\Desktop\Chat app MERN Project\server\controllers\user.js: 91: 21)
//     at processTicksAndRejections(internal / process / task_queues.js: 95: 5)
//     (node: 13572) UnhandledPromiseRejectionWarning: Unhandled promise rejection.This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().To terminate the node process on 
// unhandled promise rejection, use the CLI flag`--unhandled-rejections=strict`(see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 4)