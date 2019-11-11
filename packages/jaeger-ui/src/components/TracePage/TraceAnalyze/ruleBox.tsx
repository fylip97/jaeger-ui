import React from 'react';
import { NPlusOneRuleComponent } from './Rules/RuleComponent/nPlusOneRuleComponent';
import { TimeOperationRuleComponent } from './Rules/RuleComponent/timeOperationRuleComponent';
import { PercentSTComponent } from './Rules/RuleComponent/percentSTConponent'

import './ruleBox.css';


export const RuleBox = (props: any) => {
    const n1Rule = "N+1Rule";
    const timeOperationRule = "timeOperationRule";
    const percentST = "PercentST" 
    return (
        
        <div className="RuleBox--mainBox" style={props.index % 2 ? { float: 'right' } : { float: 'left' }}>
            <h1 className="RuleBox--nameRuleBox">{props.name}</h1>
            <hr />
            {props.name === n1Rule ? (
                <NPlusOneRuleComponent calls={props.calls}
                    information={props.information} />) :
                props.name === timeOperationRule ? (
                    <TimeOperationRuleComponent
                        information={props.information}
                    />
                ) : props.name === percentST ? (
                    <PercentSTComponent
                        information={props.information}
                    />

                ) : null
            }

        </div>
    );
}

