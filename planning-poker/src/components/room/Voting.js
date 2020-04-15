import React from "react";
import PropTypes from 'prop-types';
import "./Voting.css"

export default function Voting(props) {
    return (
        <div className="voting">

            <div className="votingInstructions">Give your vote by clicking on a card</div>

            <div className="voteButtonContainer">
                {[1, 2, 3, 5, 8, 13].map(num =>
                    <button className="voteButton"
                            onClick={() => props.onCastVote(props.roomId, num)}
                            key={num}>
                        {num}
                    </button>
                )}
            </div>

            <div className="userEmoji">You are: {props.emoji}</div>
        </div>
    )
}

Voting.propTypes = {
    onCastVote: PropTypes.func.isRequired,
    roomId: PropTypes.string.isRequired,
}