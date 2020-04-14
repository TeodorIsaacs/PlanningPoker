import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";
import "./App.css"
import {Route, Switch, useHistory} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Room from "./pages/Room";
import Header from "./components/Header";

export default function App() {

    const [rooms, setRooms] = useState([])
    const [clientId, setClientId] = useState(null)
    const [currentRoom, setCurrentRoom] = useState(null)

    const endpoint = "http://127.0.0.1:4001"

    const history = useHistory();

    useEffect(() => {
        const socket = socketIOClient(endpoint);
        socket.on("RoomsChanged", rooms => onReceiveRooms(rooms));
        socket.on("ReceiveClientID", id => onReceiveClientId(id))
        socket.on("UpdatedRoom", room => onReceiveRoomUpdate(room))
        getRooms()
    }, [])

    function onReceiveRooms(rooms){
        console.log("onReceiveRooms")
        setRooms(rooms)
    }

    function onReceiveClientId(id){
        console.log("onReceiveClientId")
        setClientId(id)
    }

    function onReceiveRoomUpdate(room) {
        console.log("onReceiveRoomUpdate")
        console.log(room)
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

    function createRoom(room){
        const url = endpoint + '/rooms';

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "isPublic": room.isPublic,
                "password": room.password,
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

    function onCastVote(roomId, vote){
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
        }).catch(function () {
            console.log("error");
        });
    }

    function onEnterRoom(roomId){
        const url = endpoint + '/room/' + roomId + '/client/' + clientId;
        console.log("onEnterRoom: clientId: " + clientId + ", roomId: " + roomId)
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

    function onExitRoom(roomId){
        const url = endpoint + '/room/' + roomId + '/client/' + clientId;
        setCurrentRoom(null)
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
                    render={props => clientId
                        ? <Room
                            room={currentRoom}
                            onEnter={onEnterRoom}
                            onExit={onExitRoom}
                            onCastVote={onCastVote}
                            roomId={props.match.params.id}
                            clientId={clientId}
                        />
                        : null
                    }
                />
            </Switch>
        </div>
    )
        ;
}
