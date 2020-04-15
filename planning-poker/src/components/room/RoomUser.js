import React from "react";
import PropTypes from 'prop-types';
import "./RoomUser.css"

export default function RoomUser(props) {
    return (
        <div className="roomUser">
            <div className="vote">
                {
                    props.voted
                        ? props.isVotingComplete
                        ? <div className="votedIndicator">{props.voted}</div>
                        : <div className="votedIndicator"/>
                        : <div className="isVotingIndicator">Voting</div>
                }

            </div>

            <div className="emoji">
                {props.emoji}
            </div>
        </div>
    )
}

RoomUser.propTypes = {
    clientId: PropTypes.string.isRequired,
    voted: PropTypes.string,
    emoji: PropTypes.string.isRequired,
    isVotingComplete: PropTypes.bool.isRequired
}