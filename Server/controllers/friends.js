const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');

const addFriend = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        await User.findByIdAndUpdate(idc, { $push: { pl: id } });
        await User.findByIdAndUpdate(id, { $push: { rl: idc } });
        res.status(200).json({ message: true });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const removeFriend = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        const chatID = await Chat.findOne({ userslist: { $all: [id, idc] } }, '_id messages');
        console.log(chatID);
        await User.findByIdAndUpdate(idc, { $pull: { fl: id, chats: chatID._id } });
        await User.findByIdAndUpdate(id, { $pull: { fl: idc, chats: chatID._id } });
        await chatID.messages.map(async (m) => {
            await Message.findByIdAndDelete(m);
        })
        await Chat.findByIdAndDelete(chatID._id);
        res.status(200).json({ message: true });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const removeRequestFriend = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        await User.findByIdAndUpdate(idc, { $pull: { pl: id } });
        await User.findByIdAndUpdate(id, { $pull: { rl: idc } });
        res.status(200).json({ message: true });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const acceptRequestFriend = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        const newChat = {
            messages: [],
            userslist: [idc, id]
        };
        const newChattoSave = new Chat(newChat);
        await newChattoSave.save();
        await User.findByIdAndUpdate(idc, { $pull: { rl: id }, $push: { fl: id, chats: newChattoSave._id } });
        await User.findByIdAndUpdate(id, { $pull: { pl: idc }, $push: { fl: idc, chats: newChattoSave._id } });
        res.status(200).json({ message: true });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
const cancelRequest = async (req, res) => {
    const { id } = req.params;
    const idc = req.userId;
    try {
        await User.findByIdAndUpdate(id, { $pull: { pl: idc } });
        await User.findByIdAndUpdate(idc, { $pull: { rl: id } });
        res.status(200).json({ message: true });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
//test
const fetchFriends = async (req, res) => {
    const { id } = req.params;
    if (id === 'self') {
        const idc = req.userId;
        try {
            const allFriends = await User.findById(idc, 'fl').populate('fl', '_id username fullname dp');
            res.status(200).json(allFriends.fl);
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
    else {
        try {
            const allFriends = await User.findById(id, 'fl').populate('fl', '_id username fullname dp');
            res.status(200).json(allFriends.fl);
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

}


module.exports = { addFriend, fetchFriends, removeFriend, removeRequestFriend, acceptRequestFriend, cancelRequest };