import React from "react";
import PropTypes from 'prop-types';
import "./Result.css"

export default function Result(props){
    return (
        <div className="result">
            <p className="resultTitle">Voting completed</p>
            <p className="resultDescription">Your average was</p>
            <p className="resultScore">{props.result.toFixed(1)}</p>
        </div>
    )
}

Result.propTypes = {
    result: PropTypes.number.isRequired
}