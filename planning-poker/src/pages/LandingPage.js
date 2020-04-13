import React, {Component} from "react";
import PropTypes from 'prop-types';
import CreateRoomForm from "../components/CreateRoomForm";
import RoomList from "../components/RoomList";
import "./LandingPage.css"

export default class LandingPage extends Component {

    state = {
        userName: "",
        roomName: "",
    }

    onSubmit = (userName, roomName) => {
        this.props.createRoom(userName, roomName)
        this.setState({userName: "", roomName: ""})
    }

    render() {
        return (
            <div className="landingPage">
                <CreateRoomForm
                    onSubmit={() => this.onSubmit(this.state.userName, this.state.roomName)}
                    userName={this.state.userName}
                    roomName={this.state.roomName}
                    onUsernameChanged={name => this.setState({userName: name})}
                    onRoomNameChanged={name => this.setState({roomName: name})}
                />
                <div className="publicRooms">
                    <p className="listTitle">Public rooms</p>
                    <RoomList
                        rooms={this.props.rooms}
                    />
                </div>
            </div>
        )
    }
}

LandingPage.propTypes = {
    rooms: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            creator: PropTypes.string,
            activeUsers: PropTypes.array,
        })
    ),
    createRoom: PropTypes.func.isRequired,
}
