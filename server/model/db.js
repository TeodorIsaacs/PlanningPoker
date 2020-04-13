const Room = require("./Room")
const User = require("./User")

class db {
    constructor() {
        this.users = []
        this.rooms = []
    }

    createRoom(clientId, reqBody) {
        this.rooms.push(new Room(
            clientId,
            reqBody.creator,
            reqBody.name,
            reqBody.isPublic,
            reqBody.password,
            reqBody.issueName,
            reqBody.issueDescription,
            reqBody.issueLink,
        ))
    }

    createUser(clientId, socket){
        this.users.push(new User(clientId, socket))
    }

    addUserToRoom(clientId, roomId) {
        if (this.getRoom(roomId)) {
            if (this.getUser(clientId)) {
                this.getRoom(roomId).addUser(this.getUser(clientId))
            } else throw Error("no such user")
        } else throw Error("no such room")
    }

    removeUserFromRoom(roomId, clientId) {
        if (this.getRoom(roomId)) {
            if (this.getUser(clientId)) {
                this.getRoom(roomId).removeUser(clientId)
            } else throw Error("no such user")
        } else throw Error("no such room")
    }

    removeUser(clientId){
        this.users.splice(this.users.indexOf(clientId), 1)

        this.rooms.forEach(room =>
            room.removeUser(clientId)
        )
    }

    giveUserInRoomVote(clientId, roomId, vote) {
        if (this.getRoom(roomId)) {
            if (this.getUser(clientId)) {
                this.getRoom(roomId).giveUserVote(clientId, vote)
            } else throw Error("no such user")
        } else throw Error("no such room")
    }

    getRooms() {
        return this.rooms.map(room => ({
                id: room.id,
                creator: room.creator,
                name: room.name,
                issueName: room.issueName,
                issueDescription: room.issueDescription,
                issueLink: room.issueLink,
                activeUsers: room.activeUsers
                    .map(user => ({
                            clientId: user.id,
                            voted: user.voted
                        })
                    ),
            })
        )
    }

    getRoomUsers(roomId) {
        return this.getRoom(roomId).activeUsers
            .map(user => ({
                clientId: user.id,
                voted: user.voted
            }))
    }

    getRoomSockets(roomId) {
        return this.getRoom(roomId).activeUsers
            .map(user => user.socket)
    }

    getRoomUser(roomId, clientId) {
        let user = this.getRoom(roomId).getUser(clientId)
        if (user) {
            return {
                clientId: user.id,
                voted: user.voted
            }
        } else return null
    }

    getUsers() {
        return this.users
    }

    getRoom(roomId) {
        return this.rooms.find(room => room.id === roomId)
    }

    getUser(clientId) {
        return this.users.find(user => user.id === clientId)
    }
}

module.exports = db