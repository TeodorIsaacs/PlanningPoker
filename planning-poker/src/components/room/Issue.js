import React from "react";
import PropTypes from 'prop-types';
import "./Issue.css"

export default function Issue(props) {


    /*
    This is extremely hacky and I hate it,
    buuuuut it kinda works, and I have not found a simpler solution online
     */
    return (
        <div className="issueCard">
            {props.link && '<a className="ghostLink" target="_blank" href={props.link}>'}
            <div className="issueContent">
                <h3 className="issueName">{props.name}</h3>
                <p className="issueDescription">{props.description}</p>
            </div>
            {props.link && '</a> '}
        </div>
    )
}

Issue.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
}