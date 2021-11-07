const Message = require('../models/message');
const Chat = require('../models/chat');
const Group = require('../models/group');
//room fn
const { addUser, getUser, removeUser } = require('../user');
const socketiofunction = (io) => {
    io.on('connection', (socket) => {
        console.log("we have a new connection!!!!!!");

        socket.on('join', ({ name, room }, callback) => {
            const { error, user } = addUser({ id: socket.id, name, room });
            if (error)
                return callback(error);

            // socket.emit('message', { user: 'admin', text: `${user.name},Welcome to ${user.room}` })
            // socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has Joined` });

            socket.join(user.room);

            // io.to(user.room).emit('roomData', { room: room, users: getUserInRoom(user.room) })
            // if(error)
            // callback({error:'error'})
            callback();
        })

        socket.on('sendMessage', async (message, callback) => {
            const newMessage = new Message(message);
            try {
                const user = await getUser(socket.id);
                const savedMessage = await newMessage.save();
                await Chat.findByIdAndUpdate(user.room, { $push: { messages: savedMessage._id }, sender: message.sender, read: 'Sent' });
                socket.broadcast.to(user.room).emit('message', newMessage);
            } catch (error) {
                console.log(error);
            }
            callback();
        });

        socket.on('sendMessageGroup', async (message, callback) => {
            const newMessage = new Message(message);
            try {
                const user = await getUser(socket.id);
                socket.broadcast.to(user.room).emit('message', newMessage);
                const savedMessage = await newMessage.save();
                await Group.findByIdAndUpdate(user.room, { $push: { messages: savedMessage._id } });
            } catch (error) {
                console.log(error);
            }
            callback();
        });

        socket.on('typing', async () => {
            try {
                const user = await getUser(socket.id);
                socket.broadcast.to(user.room).emit('setTyping');
            } catch (error) {
                console.log(error.message);
            }
        });
        socket.on('notTyping', async () => {
            try {
                const user = await getUser(socket.id);
                socket.broadcast.to(user.room).emit('setNotTyping');
            } catch (error) {
                console.log(error.message);
            }
        });

        socket.on('SENDRESPONSE', async ({ }, callback) => {
            try {
                console.log("123");
                const user = await getUser(socket.id);
                await Chat.findByIdAndUpdate(user.room, {read:'Seen' }, { select: 'sender read' });
                socket.broadcast.to(user.room).emit('GETRESPONSE');
            } catch (error) {
                console.log("chat not functioning");
            }
            callback();
        });

        socket.on('dis', () => {
            const user = removeUser(socket.id);
            if (user) {
                console.log("user disconnected");
            }
        });
    });
}
module.exports = socketiofunction;