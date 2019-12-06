import React from 'react';
import * as diffRuleComponents from './Rules/index';
import './RuleBox.css';

/**
 * Used to define the basic structure of the rule box.
 */
export const RuleBox = (props: any) => {

    return (
        <div className="RuleBox--mainBox" style={props.index % 2 ? { float: 'right' } : { float: 'left' }}>
            <h1 className="RuleBox--nameRuleBox">{props.name}</h1>
            <hr />
            {(diffRuleComponents as any)[props.id](props.information)}
        </div>
    );
}

