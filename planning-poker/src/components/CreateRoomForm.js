import React, {Component} from "react";
import PropTypes from 'prop-types';
import "./CreateRoomForm.css"

export default class CreateRoomForm extends Component {

    onSubmit = (event) => {
        event.preventDefault()
        this.props.onSubmit()
    }

    render() {
        return (
            <div className="createRoomForm">
                <form onSubmit={this.onSubmit}>
                    <label>
                        Create a new poll
                    </label>
                    <input className="textFormInput"
                           type="text"
                           value={this.props.userName}
                           placeholder="Username"
                           onChange={event => this.props.onUsernameChanged(event.target.value)}
                    />

                    <input className="textFormInput"
                           type="text"
                           value={this.props.roomName}
                           placeholder="Room Name"
                           onChange={event => this.props.onRoomNameChanged(event.target.value)}
                    />
                    <input className="submitButton" type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

CreateRoomForm.propTypes = {
    userName: PropTypes.string.isRequired,
    roomName: PropTypes.string.isRequired,
    onUsernameChanged: PropTypes.func.isRequired,
    onRoomNameChanged: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}
