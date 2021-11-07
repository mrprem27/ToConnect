const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');
const Group = require('../models/group');

const fetchChats = async (req, res) => {
    const idc = req.userId;
    try {
        const allChats = await User.findById(idc).populate({
            path: 'chats', select: '_id userslist type sender read', model: 'Chat', populate: {
                path: 'userslist',
                model: 'User',
                select: '_id username fullname dp'
            }
        })
        res.status(200).json({ data: allChats.chats, idc: idc });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const fetchChatSingle = async (req, res) => {
    const idc = req.userId;
    const { id } = req.params;
    try {
        const senderUser = await Chat.findOne({ userslist: { $all: [id, idc] } }, '_id sender read');
        const chat = await Chat.findByIdAndUpdate(senderUser._id, { read: ((senderUser.sender == idc&&senderUser.read!='Seen') ? 'Sent' : 'Seen') }).populate({ path: 'messages', model: 'Message' }).populate({ path: 'userslist', model: 'User', select: '_id fullname username dp' });

        if (chat.userslist[0]._id == idc)
            res.status(200).json({ chat: chat, self: chat.userslist[0], friend: chat.userslist[1] });
        else
            res.status(200).json({ chat: chat, self: chat.userslist[1], friend: chat.userslist[0] });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const fetchGroupChatSingle = async (req, res) => {
    const idc = req.userId;
    const { idg } = req.params;
    try {
        const group = await Group.findById(idg, '_id messages fullname userlist admin dp').populate({
            path: 'messages', model: 'Message', select: 'message sendername sender'
        }).populate({ path: 'userlist', model: 'User', select: '_id  username' }).populate({ path: 'admin', model: 'User', select: '_id  username' });

        const self = group.userlist.filter((u) => u._id == idc);
        if (self.length)
            res.status(200).json({ group: group, self: self[0] });
        else
            res.status(200).json({ group: group, self: group.admin });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
module.exports = { fetchChats, fetchChatSingle, fetchGroupChatSingle };