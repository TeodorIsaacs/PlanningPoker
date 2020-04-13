import React from "react";
import PropTypes from 'prop-types';
import "./RoomListing.css";
import {Link} from "react-router-dom";


export default function RoomListing(props) {
    return (
        <Link className="discover-button" to={`/room/${props.room.id}`}>
            <div className="roomListingItem"
                 key={props.room.id}>

                <div className="roomListingInfo">
                    {props.room.name}
                </div>

                <div className="roomListingInfo">
                    Created by: {props.room.creator}
                </div>

                <div className="roomListingInfo">
                    Active Users: {props.room.activeUsers.length}
                </div>
            </div>
        </Link>
    )
}

RoomListing.propTypes = {
    room: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        creator: PropTypes.string,
        activeUsers: PropTypes.array,
    }).isRequired,
}
