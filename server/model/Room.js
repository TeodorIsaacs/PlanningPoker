class Room {
    constructor(id, creator, name, isPublic, issueName, issueDescription, issueLink,) {
        this.id = id
        this.creator = creator
        this.name = name
        this.isPublic = isPublic
        this.activeUsers = []
        this.issueName = issueName
        this.issueDescription = issueDescription
        this.issueLink = issueLink
    }

    addUser(user) {
        this.activeUsers.push(user)
    }

    removeUser(clientId) {
        if (this.getUser(clientId)) {
            this.getUser(clientId).voted = undefined
            this.activeUsers.splice(this.activeUsers.indexOf(this.getUser(clientId)), 1)
        } else {
            return null
        }
    }

    giveUserVote(clientId, vote) {
        if (this.getUser(clientId)) {
            this.activeUsers.find(user => user.id === clientId)['voted'] = vote
        }
    }

    getUser(clientId) {
        return this.activeUsers.find(user => user.id === clientId)
    }
}

module.exports = Room