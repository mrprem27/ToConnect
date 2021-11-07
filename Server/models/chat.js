const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = mongoose.Schema({
    type: { type: String, default: 'private' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    userslist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    read: { type: String, default: 'none' },
    sender: { type:Schema.Types.ObjectId,ref:'User'}
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;