import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Issue from "../components/Issue";
import Voting from "../components/Voting";
import "./Room.css"
import RoomUsers from "../components/RoomUsers";
import Result from "../components/Result";

export default function Room(props) {
    const [allVoted, setAllVoted] = useState(false)
    const [averageScore, setAverageScore] = useState(0)

    useEffect(() => {
        props.onEnter(props.roomId)

        return () => props.onExit(props.roomId)
    }, [])

    function getAverageScore(users) {
        let votes = users.map(user => parseInt(user.voted || 0))
        return votes.reduce((a, b) => a + b, 0) / votes.length
    }

    useEffect(() => {
        if (props.room && props.room.activeUsers) {
            setAllVoted(props.room.activeUsers.find(user => user.voted === undefined) === undefined)

            setAverageScore(getAverageScore(props.room.activeUsers))
        }
    }, [props.room])

    return (
        props.room
            ? <div className="room">
                <Issue
                    name={props.room.issueName}
                    description={props.room.issueDescription}
                    link={props.room.issueLink}
                />

                {allVoted ? <Result result={averageScore}/> : null}

                <RoomUsers
                    activeUsers={
                        props.room.activeUsers
                            .map(user =>
                                ({...user, emoji: generateRandomEmoji(user.clientId)})
                            )
                    }
                    allVoted={allVoted}
                />

                <Voting
                    onCastVote={allVoted ? () => {
                    } : props.onCastVote}
                    allVoted={allVoted}
                    roomId={props.roomId}
                    emoji={generateRandomEmoji(props.clientId)}
                />
            </div>
            : <p>loading...</p>
    )
}

const emojis = [
    '😄', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '👿', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '👲', '👳', '👮', '👷', '💂', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '😽', '😼', '🙀', '😿', '😹', '😾', '👹', '👺', '🙈', '🙉', '🙊', '💀', '👽', '💩'
];

function generateRandomEmoji(s) {
    for (var i = 0, hash = 0; i < s.length; i++)
        hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
    let res = hash % emojis.length
    return emojis[Math.abs(res)];
}

Room.prototypes = {
    room: PropTypes.shape({
        activeUsers: PropTypes.array,
        id: PropTypes.string,
        issueDescription: PropTypes.string,
        issueLink: PropTypes.string,
        issueName: PropTypes.string,
        name: PropTypes.string
    }).isRequired,

    roomId: PropTypes.number.isRequired,
    onEnter: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    onCastVote: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
}
