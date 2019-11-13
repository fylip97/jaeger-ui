import React from 'react';
import { NPlusOneRuleComponent } from './nPlusOneRuleComponent';

/**
 * Used to render nPlus1Rule.
 * @param information 
 */
export default function nPlus1Rule(information: string) {

    return (
        <NPlusOneRuleComponent
            information={information} />
    )

}