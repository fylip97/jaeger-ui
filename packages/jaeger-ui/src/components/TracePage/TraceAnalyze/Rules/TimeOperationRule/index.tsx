import React from 'react';
import { TimeOperationRuleComponent } from './timeOperationRuleComponent'

/**
 * Used to render TimeOperationRule.
 * @param information 
 */
export default function timeOperationRule(information: string) {

    return (
        <TimeOperationRuleComponent
            information={information} />
    )
}