import React from "react";
import PropTypes from 'prop-types';
import RoomListing from "./RoomListing";
import "./RoomList.css"

export default function RoomList(props) {
    return (
        <div className="roomList">
            {props.rooms.map(room =>
                <RoomListing
                    key={room.id}
                    room={room}/>
            )}
        </div>
    )
}

RoomList.propTypes = {
    rooms: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            creator: PropTypes.string,
            activeUsers: PropTypes.array,
        })
    ),
}