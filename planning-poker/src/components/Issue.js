import React from "react";
import PropTypes from 'prop-types';
import "./Issue.css"
import {useHistory} from "react-router-dom";

export default function Issue(props) {


    return (
        <div className="issueCard">
            <a className="ghostLink" target="_blank" href={props.link}>
                <div className="issueContent">
                    <h3 className="issueName">{props.name}</h3>
                    <p className="issueDescription">{props.description}</p>
                </div>
            </a>
        </div>
    )
}

Issue.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
}