import React from "react";
import PropTypes from 'prop-types';
import "./ErrorComponent.css";

export default function ErrorComponent(props) {

    function getErrorText() {
        switch (props.errorCode) {
            case 404:
                return <p className="error-text">The page you're looking for does not exist</p>

            default:
                return <p>Something went wrong</p>;
        }
    }

    return (
        <div className="error-component">
            <h2 className="error-title">Error</h2>
            <h1 className="error-code">{props.errorCode}</h1>
            {getErrorText()}
        </div>
    )
}

ErrorComponent.propTypes = {
    errorCode: PropTypes.number.isRequired,
}
