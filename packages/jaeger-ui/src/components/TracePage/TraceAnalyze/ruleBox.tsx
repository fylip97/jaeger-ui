import React, { Component } from 'react';
import { Trace } from '../../../types/trace';

import './ruleBox.css';

export const RuleBox = (props: any) => {
    return (
        <div className="mainBox" style={props.index%2? {float:'right'}:{float: 'left'}}>
            
            <h1 className="nameRuleBox">Name: {props.name.name}</h1>
            <hr />
            <h3 className="informationRuleBox"> Information:</h3>
        </div>
    );
}

