const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, dropDups: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true, dropDups: true },
    dp: String,
    sex: { type: String, required: true },
    fl: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pl: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rl: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    GL: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    bio: { type: String, default: "Hello! Let be Friends😀" },
});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(this.password, salt);
        this.password = hashedPass;
        next();
    } catch (error) {
        console.log(error.message);
    }
})



const User = mongoose.model('User', userSchema);
module.exports = User;