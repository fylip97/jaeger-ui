import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { NPlusOneRuleComponent } from './Rules/RuleComponent/nPlusOneRuleComponent';
import { TimeOperationRuleComponent } from './Rules/RuleComponent/timeOperationRuleComponent';
import { PercentSTComponent } from './Rules/RuleComponent/percentSTConponent'

import './ruleBox.css';


export const RuleBox = (props: any) => {
    return (
        <div className="mainBox" style={props.index % 2 ? { float: 'right' } : { float: 'left' }}>
            <h1 className="nameRuleBox">{props.name}</h1>
            <hr />
            {props.name === "N+1Rule" ? (
                <NPlusOneRuleComponent calls={props.calls}
                    information={props.information} />) :
                props.name === "timeOperationRule" ? (
                    <TimeOperationRuleComponent
                        information={props.information}
                    />
                ) : props.name === "PercentST" ? (
                    <PercentSTComponent
                        information={props.information}
                    />

                ) : null
            }

        </div>
    );
}

