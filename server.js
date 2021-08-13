const express = require("express");
const { body } = require("express-validator");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
const socketio = require('socket.io')
const cors = require('cors')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./helperFunctions/chatHelper.js')
app.use(cors())
app.use(express.json());

//routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/test", require("./routes/api/test"));
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production') {
    console.log("get working")
    app.use(express.static('client/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
const server = app.listen(PORT, () => console.log("server started on port " + PORT));
const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

// this is for connecting to the database
connectDB();
//middle ware



io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('join', ({ name, room }) => {
        const { user } = addUser({ id: socket.id, name, room })
        console.log(user)
        socket.join(user.room)
        socket.emit('message', { user: 'admin', text: `Welcome to the chatroom, ${user.name}` })
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the chat` })
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        callback()
    })

    socket.on('disconnected', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
})



