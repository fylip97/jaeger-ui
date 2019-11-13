import React from 'react';
import { NPlusOneRuleComponent } from './Rules/nPlusOneRule/nPlusOneRuleComponent';
import { TimeOperationRuleComponent } from './Rules/TimeOperationRule/timeOperationRuleComponent';
import { PercentSTComponent } from './Rules/PercentST/percentSTConponent';
import { LongDatabasecallComponent } from './Rules/LongDatabasecall/longDatabasecallComponent';
import { PercentageDeviationComponent } from './Rules/PercentageDeviation/percentageDeviationComponent';
import './ruleBox.css';

/**
 * used to define the basic structure of the rule box
 */
export const RuleBox = (props: any) => {
    const n1Rule = "n+1Rule";
    const timeOperationRule = "timeOperationRule";
    const percentST = "percentST";
    const longDatabasecall = "longDatabasecall";
    const percentageDeviation = "percentageDeviation";
    return (
        <div className="RuleBox--mainBox" style={props.index % 2 ? { float: 'right' } : { float: 'left' }}>
            <h1 className="RuleBox--nameRuleBox">{props.name}</h1>
            <hr />
            {props.id === n1Rule ? (
                <NPlusOneRuleComponent calls={props.calls}
                    information={props.information} />) :
                props.id === timeOperationRule ? (
                    <TimeOperationRuleComponent
                        information={props.information}
                    />
                ) : props.id === percentST ? (
                    <PercentSTComponent
                        information={props.information}
                    />

                ) : props.id === longDatabasecall ? (
                    <LongDatabasecallComponent
                        information={props.information}
                    />

                ) : props.id === percentageDeviation ? (
                    <PercentageDeviationComponent
                        information={props.information}
                    />
                ) : null
            }

        </div>
    );
}

