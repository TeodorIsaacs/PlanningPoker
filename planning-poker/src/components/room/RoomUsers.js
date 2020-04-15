import React from "react";
import PropTypes from 'prop-types';
import RoomUser from "./RoomUser";

export default function RoomUsers(props) {

    return (
        <div className="roomUsers">
            {props.activeUsers
                ? props.activeUsers
                    .sort((a, b) => a.clientId.localeCompare(b.clientId))
                    .map(user =>
                        <RoomUser
                            key={user.clientId}
                            clientId={user.clientId}
                            voted={user.voted}
                            emoji={user.emoji}
                            isVotingComplete={props.allVoted}
                        />)
                : ""
            }
        </div>
    )
}

RoomUsers.propTypes = {
    activeUsers: PropTypes.arrayOf(
        PropTypes.shape({
            clientId: PropTypes.string,
            userName: PropTypes.string,
            voted: PropTypes.string,
            emoji: PropTypes.string,
        })
    ).isRequired,
    allVoted: PropTypes.bool.isRequired
}