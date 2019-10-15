import React, { Component } from 'react';
import { Trace } from '../../../types/trace';

import './ruleBox.css';

export const RuleBox = (props: any) => {
    return (
        <div className="mainBox" style={props.index%2? {float:'right'}:{float: 'left'}}>
            
            <h1 className="nameRuleBox">{props.name}</h1>
            <hr />
            <h3 className="informationRuleBox"> Information: {props.information}</h3>
        </div>
    );
}

