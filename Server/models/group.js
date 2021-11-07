const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    userlist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 },
    date: { type: Date, default: new Date() },
    limit: { type: Number, default: 10 },
    dp: String,
    type: {type:String,default:'group'}
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;