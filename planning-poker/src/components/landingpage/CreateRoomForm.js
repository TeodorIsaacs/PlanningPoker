import React, {useState} from "react";
import PropTypes from 'prop-types';
import "./CreateRoomForm.css"

export default function CreateRoomForm(props) {

    const initialState = {
        issueName: "",
        issueDescription: "",
        issueLink: "",
        isPublic: false,
        roomName: ""
    };

    const [
        {issueName, issueDescription, issueLink, isPublic, roomName},
        setState
    ] = useState(initialState)

    function clearState() {
        setState({...initialState})
    }

    function onChange(event) {
        let {name, value} = event.target;
        value = name === 'isPublic' ? event.target.checked : value;
        setState(prevState => ({...prevState, [name]: value}));
    }

    function onSubmit(event) {
        event.preventDefault()
        props.onSubmit({issueName, issueDescription, issueLink, isPublic, roomName})
        clearState()
    }

    return (
        <div className="createRoomForm">
            <form onSubmit={onSubmit}>
                <label className="formLabel">
                    Create a new poll
                </label>

                <input className="textFormInput issueNameInput"
                       name="issueName"
                       value={issueName}
                       placeholder="Issue title"
                       required
                       onChange={onChange}
                />

                <input className="textFormInput"
                       name="issueLink"
                       value={issueLink}
                       placeholder="Link to issue"
                       onChange={onChange}
                />

                <textarea className="textFormInput issueDescriptionInput"
                          name="issueDescription"
                          value={issueDescription}
                          placeholder="Description"
                          onChange={onChange}
                />

                <div className="checkboxRow">
                    <label className="makePublicLabel">Make room public</label>

                    <label className="checkbox-label">
                        <input
                            className="isPublicCheckbox"
                            name="isPublic"
                            type="checkbox"
                            value={isPublic}
                            onChange={onChange}
                        />
                        <span className="checkbox-custom rectangular"/>
                    </label>
                </div>

                {isPublic &&
                <div className="onPublicInputs">
                    <input className="textFormInput"
                           name="roomName"
                           type="text"
                           value={roomName}
                           required
                           placeholder="Room Name"
                           onChange={onChange}
                    />
                </div>

                }
                <input className="submitButton" type="submit" value="Submit"/>
            </form>
        </div>
    );
}

CreateRoomForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}
