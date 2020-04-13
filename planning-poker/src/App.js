import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import "./App.css"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Room from "./pages/Room";
import Header from "./components/Header";

export default class App extends Component {
    state = {
        rooms: [],
        clientId: null,
        endpoint: "http://127.0.0.1:4001",
        currentRoomUsers: null
    };

    async componentDidMount() {
        const socket = socketIOClient(this.state.endpoint);

        socket.on("RoomsChanged", rooms => this.onReceiveRooms(rooms));
        socket.on("ReceiveClientID", id => this.onReceiveClientId(id))
        socket.on("UpdatedRoom", room => this.onReceiveRoomUpdate(room))
        socket.on("UpdatedVote", user => this.onUpdatedVote(user))

        await this.getRooms()
    }

    onReceiveRooms = (rooms) => {
        console.log("onReceiveRooms")
        this.setState({rooms: rooms})
    }

    onReceiveClientId = (id) => {
        console.log("onReceiveClientId")
        this.setState({clientId: id})
    }

    onReceiveRoomUpdate = (room) => {
        console.log("onReceiveRoomUpdate")
        this.setState({currentRoomUsers: room})
    }

    onUpdatedVote = (user) => {
        console.log(user)
        let updatedRoomUsers = this.state.currentRoomUsers
        updatedRoomUsers.find(u => u.clientId === user.clientId).voted = parseInt(user.voted)
        this.setState({currentRoomUsers: updatedRoomUsers})
    }

    getRooms = async () => {
        await fetch(this.state.endpoint + "/rooms")
            .then(json => json.json()
                .then(data =>
                    this.setState({rooms: data})
                )
            )
    }

    createRoom = (room) => {
        const url = this.state.endpoint + '/rooms';

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "creator": room.userName,
                "name": room.roomName,
                "issueName": room.issueName,
                "issueDescription": room.issueDescription,
                "issueLink": room.issueLink,
            })
        }).catch(function () {
            console.log("error");
        });
    }

    onCastVote = (roomId, vote) => {
        const url = this.state.endpoint + '/room/' + roomId + '/vote/' + vote
        console.log(url)
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "clientId": this.state.clientId,
            })
        }).catch(function () {
            console.log("error");
        });
    }

    onEnterRoom = (roomId) => {
        if (!this.state.clientId)
            setTimeout(() => this.onEnterRoom(roomId), 10)
        else {
            const url = this.state.endpoint + '/room/' + roomId + '/client/' + this.state.clientId;
            console.log("onEnterRoom: " + this.state.clientId)
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).catch(function () {
                console.log("error");
            });
        }
    }

    onExitRoom = (roomId) => {
        const url = this.state.endpoint + '/room/' + roomId + '/client/' + this.state.clientId;
        this.setState({currentRoomUsers: null})
        console.log("onExitRoom: " + roomId)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).catch(function () {
            console.log("error");
        });
    }

    render() {
        console.log("rerendering App")
        return (
            <BrowserRouter>
                <Header/>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => <LandingPage
                            createRoom={this.createRoom}
                            rooms={this.state.rooms}/>}
                    />

                    <Route
                        path="/room/:id"
                        render={props => <Room
                            users={this.state.currentRoomUsers}
                            onEnter={this.onEnterRoom}
                            onExit={this.onExitRoom}
                            onCastVote={this.onCastVote}
                            roomId={props.match.params.id}
                        />}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}
