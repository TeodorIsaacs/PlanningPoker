import React, {Component} from "react";
import PropTypes from 'prop-types';
import CreateRoomForm from "../components/landingpage/CreateRoomForm";
import RoomList from "../components/landingpage/RoomList";
import "./LandingPage.css"

export default class LandingPage extends Component {

    render() {
        return (
            <div className="landingPage">
                <CreateRoomForm
                    onSubmit={this.props.createRoom}
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
