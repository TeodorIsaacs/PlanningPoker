const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const uniqid = require('uniqid');
//const mongoConnectionString = 'mongodb+srv://teodorisaacs:Lv5f9YdfnPiMP5Z@cluster0-v2ezx.gcp.mongodb.net/test?retryWrites=true&w=majority\n'

const app = express();
app.use(index);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//const MongoClient = require('mongodb').MongoClient

let db = null

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

let rooms = [];

let activeUsers = [];

app.get('/rooms', (req, res) => {
    res.send(rooms.map(room =>
            ({
                id: room.id,
                activeUsers: room.activeUsers
                    .map(user => ({
                        clientId: user.clientId,
                        voted: user.voted})
                    ),
                creator: room.creator,
                name: room.name
            })
        )
    )
})

app.post('/rooms', (req, res) => {
    let room = req.body;
    room['activeUsers'] = [];
    room['id'] = uniqid();
    console.log(room);
    rooms.push(room);

    activeUsers.forEach(user =>
        user.socket.emit("RoomsChanged", rooms)
    )
    res.sendStatus(200)
});


app.post('/room/:id/client/:clientId', (req, res) => {
    let roomId = req.params.id
    let clientId = req.params.clientId

    console.log("Adding user to room: " + roomId + ", with client id:" + clientId)

    let roomIndex = rooms.findIndex(room => room.id === roomId)
    if (roomIndex !== -1) {

        let user = activeUsers.find(user => user.clientId === clientId)

        if (user) {
            rooms[roomIndex].activeUsers.push(user)

            let activeUsersCopy = rooms[roomIndex].activeUsers.map(user => ({
                clientId: user.clientId,
                voted: user.voted
            }))

            rooms[roomIndex].activeUsers.forEach(user => {
                    user.socket.emit("UpdatedRoom", activeUsersCopy)
                }
            )
            res.sendStatus(200)
        } else res.status(400).send('No user with id: ' + roomId + ' found')
    } else res.status(400).send('No room with id: ' + roomId + ' found')
})

app.delete('/room/:roomId/client/:clientId', (req, res) => {
    let roomId = req.params.roomId
    let clientId = req.params.clientId
    console.log("Removing user from room: " + roomId + ", with client id:" + clientId)

    removeClientFromRoom(roomId, clientId)
    res.sendStatus(200)
})

function removeClientFromRoom(roomId, clientId) {
    let roomIndex = rooms.findIndex(room => room.id === roomId)
    if (roomIndex !== -1) {

        let user = rooms[roomIndex].activeUsers.find(user => user.clientId === clientId)

        if (user) {
            rooms[roomIndex].activeUsers.splice(activeUsers.indexOf(user), 1)

            let activeUsersCopy = rooms[roomIndex].activeUsers.map(user => ({
                clientId: user.clientId,
                voted: user.voted
            }))

            rooms[roomIndex].activeUsers.forEach(user => {
                    user.socket.emit("UpdatedRoom", activeUsersCopy)
                }
            )
        } else console.log("no such user")
    } else console.log("no such room")
}

app.put('/room/:id/vote/:vote', (req, res) => {
    let roomId = req.params.id
    let vote = req.params.vote
    console.log("vote: " + vote + ", in room: " + roomId)

    let clientId = req.body.clientId

    let roomIndex = rooms.findIndex(room => room.id === roomId)
    if (roomIndex !== -1) {
        let user = rooms[roomIndex].activeUsers.find(user => user.clientId === clientId)
        if (user) {
            rooms[roomIndex].activeUsers.find(user => user.clientId === clientId)['voted'] = vote

            rooms[roomIndex].activeUsers.forEach(user => {
                    user.socket.emit("UpdatedVote", {clientId: clientId, voted: vote})
                }
            )
            res.sendStatus(200)
        } else {
            res.status(400).send('No user with id: ' + roomId + ' found')
        }
    } else {
        res.status(400).send('No room with id: ' + roomId + ' found')
    }
})

io.on("connection", socket => {
    let user = {clientId: uniqid(), socket: socket}

    activeUsers.push(user)
    socket.emit("ReceiveClientID", user.clientId)

    console.log("client connected, connected clients. " + activeUsers.length)
    socket.on("disconnect", () => {
        activeUsers.splice(activeUsers.indexOf(socket), 1)

        for (let i = 0; i < rooms.length; i++) {
            for (let j = 0; j < rooms[i].activeUsers.length; j++) {
                if (rooms[i].activeUsers[j].clientId === user.clientId) {
                    rooms[i].activeUsers.splice(j, 1)
                }
            }
        }
        console.log("Client disconnected, remaining clients: " + activeUsers.length)
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
