import React, {Component} from "react";
import PropTypes from 'prop-types';
import RoomUser from "../components/RoomUser";

export default class Room extends Component {

    componentDidMount() {
        this.props.onEnter(this.props.roomId)
    }

    componentWillUnmount() {
        this.props.onExit(this.props.roomId)
    }

    render() {
        console.log(this.props.users)
        return (
            <div>
                {this.props.users
                    ? this.props.users.map(user =>
                        <RoomUser
                            key={user.clientId}
                            clientId={user.clientId}
                            voted={user.voted}
                        />)
                    : ""
                }

                {[1, 2, 3, 5, 8, 13].map(num =>
                    <button
                        onClick={() => this.props.onCastVote(this.props.roomId, num)}
                        key={num}
                    >
                        {num}
                    </button>
                )}
            </div>
        )
    }
}

Room.prototypes = {
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
