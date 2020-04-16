import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import "./App.css"
import {Route, Switch, useHistory} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Room from "./pages/Room";
import Header from "./components/general/Header";
import ErrorComponent from "./components/general/ErrorComponent";

export default function App() {

    const [rooms, setRooms] = useState([])
    const [clientId, setClientId] = useState(null)
    const [currentRoom, setCurrentRoom] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [socketId, setSocketId] = useState(null)

    const endpoint = "http://127.0.0.1:4001"

    const history = useHistory();

    useEffect(() => {
        const socket = socketIOClient(endpoint + "?clientId=" + window.sessionStorage.getItem("clientId"))

        socket.on("RoomsChanged", rooms => onReceiveRooms(rooms))
        socket.on("ReceiveConnection", data => onReceiveConnection(data.clientId, data.socketId))
        socket.on("UpdatedRoom", room => onReceiveRoomUpdate(room))

        getRooms()
    }, [])

    useEffect(() => {
        if (clientId && roomId) {
            enterRoom(roomId)
                .then(() => {
                    let persistedVote = window.sessionStorage.getItem("vote")
                    if (persistedVote) {
                        castVote(roomId, persistedVote)
                    }
                })
        }
    }, [clientId, roomId, socketId])

    function onReceiveRooms(rooms) {
        console.log("onReceiveRooms")
        setRooms(rooms)
    }

    function onReceiveConnection(clientId, socketId) {
        console.log("onReceiveClientId: " + clientId)
        window.sessionStorage.setItem("clientId", clientId);
        setClientId(clientId)
        setSocketId(socketId)
    }

    function onReceiveRoomUpdate(room) {
        console.log("onReceiveRoomUpdate")
        setCurrentRoom(room)
    }

    async function getRooms() {
        await fetch(endpoint + "/rooms")
            .then(json => json.json()
                .then(data => {
                        setRooms(data)
                    }
                )
            )
    }

    function createRoom(room) {
        const url = endpoint + '/rooms';

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "isPublic": room.isPublic,
                "name": room.roomName,
                "issueName": room.issueName,
                "issueDescription": room.issueDescription,
                "issueLink": room.issueLink,
            })
        }).then(res => {
            res.json().then(json => {
                history.push("/room/" + json.roomId)
            })
        }).catch(() => {
            console.log("error");
        });
    }

    function castVote(roomId, vote) {
        const url = endpoint + '/room/' + roomId + '/vote/' + vote
        console.log(url)

        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "clientId": clientId,
            })
        }).then(() => {
            window.sessionStorage.setItem("vote", vote)
        }).catch(function () {
            console.log("error");
        });
    }

    async function enterRoom(roomId) {
        const url = endpoint + '/room/' + roomId + '/client/' + clientId;
        console.log("onEnterRoom: clientId: " + clientId + ", roomId: " + roomId)

        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status !== 200) {
                history.replace("/404")
            }
        }).catch(e => {
                console.log(e)
            }
        )
    }

    function exitRoom(roomId) {
        const url = endpoint + '/room/' + roomId + '/client/' + clientId;
        setCurrentRoom(null)
        setRoomId(null)
        console.log("onExitRoom: " + roomId)
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(() => {
            window.sessionStorage.removeItem("vote")
        }).catch(function () {
            console.log("error");
        });
    }

    return (
        <div className="app">
            <Header/>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => <LandingPage
                        createRoom={createRoom}
                        rooms={rooms}/>}
                />

                <Route
                    path="/room/:id"
                    render={props =>
                        clientId && <Room
                            room={currentRoom}
                            onEnter={setRoomId}
                            onExit={exitRoom}
                            onCastVote={castVote}
                            roomId={props.match.params.id}
                            clientId={clientId}
                        />
                    }
                />

                <Route
                    render={() => (
                        <ErrorComponent errorCode={404}/>
                    )}
                />
            </Switch>
        </div>
    )
        ;
}
