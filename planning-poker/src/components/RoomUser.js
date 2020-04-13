import React from "react";
import PropTypes from 'prop-types';

export default function RoomUser(props){
        return (
            <div>
                {props.clientId || "no username"}, Voted: {props.voted}
            </div>
        )
}

RoomUser.propTypes = {
    clientId: PropTypes.string.isRequired,
    voted: PropTypes.number,
}