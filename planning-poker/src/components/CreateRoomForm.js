import React, {Component} from "react";
import PropTypes from 'prop-types';
import "./CreateRoomForm.css"

export default class CreateRoomForm extends Component {

    state = {
        issueName: "",
        issueDescription: "",
        issueLink: "",
        isPublic: false,
        password: "",
        roomName: "",
    }

    onSubmit = (event) => {
        event.preventDefault()
        this.props.onSubmit(this.state)
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.name === 'isPublic' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="createRoomForm">
                <form onSubmit={this.onSubmit}>
                    <label className="formLabel">
                        Create a new poll
                    </label>

                    <input className="textFormInput issueNameInput"
                           name="issueName"
                           type="text"
                           value={this.state.issueName}
                           placeholder="Issue title"
                           required
                           onChange={this.handleInputChange}
                    />

                    <input className="textFormInput"
                              name="issueLink"
                              value={this.state.issueLink}
                              placeholder="Link to issue"
                              onChange={this.handleInputChange}
                    />

                    <textarea className="textFormInput issueDescriptionInput"
                           name="issueDescription"
                           type="text"
                           value={this.state.issueDescription}
                           placeholder="Description"
                           onChange={this.handleInputChange}
                    />

                    <div className="checkboxRow">
                        <label className="makePublicLabel">Make room public</label>

                        <label className="checkbox-label">
                            <input
                                className="isPublicCheckbox"
                                name="isPublic"
                                type="checkbox"
                                value={this.state.isPublic}
                                onChange={this.handleInputChange}
                            />
                            <span className="checkbox-custom rectangular"/>
                        </label>
                    </div>

                    {this.state.isPublic &&
                    <div className="onPublicInputs">
                        <input className="textFormInput"
                               name="roomName"
                               type="text"
                               value={this.state.roomName}
                               placeholder="Room Name"
                               onChange={this.handleInputChange}
                        />

                        <input className="textFormInput"
                               name="password"
                               type="text"
                               value={this.state.password}
                               placeholder="Password"
                               onChange={this.handleInputChange}
                        />
                    </div>

                    }
                    <input className="submitButton" type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

CreateRoomForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}
