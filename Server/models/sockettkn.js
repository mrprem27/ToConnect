const mongoose = require('mongoose');

const socketTKNSchema = mongoose.Schema({
    socketId=String,
    room:String,
    name:String
});

const SOCKETKN = mongoose.model('SOCKETKN', socketTKNSchema);
module.exports = SOCKETKN;