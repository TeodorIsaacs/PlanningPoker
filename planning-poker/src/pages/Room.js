import React, {useEffect} from "react";
import PropTypes from 'prop-types';
import RoomUser from "../components/RoomUser";

export default function Room(props) {

    useEffect(() => {
        props.onEnter(props.roomId)

        console.log(props)

        return () => props.onExit(props.roomId)
    }, [])

    return (
        <div>
            {props.users
                ? props.users.map(user =>
                    <RoomUser
                        key={user.clientId}
                        clientId={user.clientId}
                        voted={user.voted}
                    />)
                : ""
            }

            {[1, 2, 3, 5, 8, 13].map(num =>
                <button
                    onClick={() => props.onCastVote(props.roomId, num)}
                    key={num}
                >
                    {num}
                </button>
            )}
        </div>
    )
}

Room.prototypes = {
    room: PropTypes.object.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            clientId: PropTypes.string,
            userName: PropTypes.string,
            voted: PropTypes.number,
        })
    ),
    roomId: PropTypes.number.isRequired,
    onEnter: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    onCastVote: PropTypes.func.isRequired,
}
