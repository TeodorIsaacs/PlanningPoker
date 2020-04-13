const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const uniqid = require('uniqid');

const db = require("./model/db")

const app = express();
const database = new db()

app.use(index);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

const server = http.createServer(app);

const io = socketIo(server);

app.get('/rooms', (req, res) => {
    res.send(database.getRooms())
})

app.post('/rooms', (req, res) => {
    database.createRoom(uniqid(), req.body)

    emitMessage("RoomsChanged", database.getRooms())

    res.sendStatus(200)
});

app.post('/room/:roomId/client/:clientId', (req, res) => {
    let roomId = req.params.roomId
    let clientId = req.params.clientId
    try {
        console.log("Adding user to room: " + roomId + ", with client id:" + clientId)
        database.addUserToRoom(clientId, roomId)

        emitMessageToRoom(
            roomId,
            "UpdatedRoom",
            database.getRoomUsers(roomId)
        )

        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

app.delete('/room/:roomId/client/:clientId', (req, res) => {
    let roomId = req.params.roomId
    let clientId = req.params.clientId
    try {
        console.log("Removing user from room: " + roomId + ", with client id:" + clientId)
        database.removeUserFromRoom(roomId, clientId)

        emitMessageToRoom(
            roomId,
            "UpdatedRoom",
            database.getRoomUsers(roomId)
        )

        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

app.put('/room/:id/vote/:vote', (req, res) => {
    let roomId = req.params.id
    let vote = req.params.vote
    let clientId = req.body.clientId

    try {
        console.log("vote: " + vote + ", in room: " + roomId)

        database.giveUserInRoomVote(clientId, roomId, vote)

        emitMessageToRoom(
            roomId,
            "UpdatedVote",
            database.getRoomUser(roomId, clientId)
        )

        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

io.on("connection", socket => {
    let clientId = uniqid()
    database.createUser(clientId, socket)

    socket.emit("ReceiveClientID", clientId)

    console.log("client connected")

    socket.on("disconnect", () => {
        database.removeUser(clientId)
        console.log("Client disconnected")
    });
});

function emitMessageToRoom(roomId, eventName, data) {
    database.getRoomSockets(roomId).forEach(socket => {
            socket.emit(eventName, data)
        }
    )
}

function emitMessage(eventName, data) {
    database.getUsers().forEach(user => {
            user.socket.emit(eventName, data)
        }
    )
}

server.listen(port, () => console.log(`Listening on port ${port}`));
