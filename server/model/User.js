class User {
    constructor(id, socket) {
        this.id = id
        this.socket = socket
        this.currentRoom = null
    }

    enterRoom(roomId){
        this.currentRoom = roomId
    }

    exitRoom(){
        this.currentRoom = null
    }
}

module.exports = User