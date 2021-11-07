const express = require('express');
const socketio = require('socket.io');
const socketiofunction = require('./socket.io/index')
const http = require('http');
const dotenv = require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const userRoutes = require('./routes/user')
const groupRoutes = require('./routes/group')
const chatRoutes = require('./routes/chat')

const PORT = process.env.PORT || 5000;

// const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

socketiofunction(io);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb", extented: true }));
app.use(express.urlencoded({ limit: "10mb", extented: true }));
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/chat', chatRoutes);


const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT, () => console.log(`Server Running on Port:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
