const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
    sendername: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;