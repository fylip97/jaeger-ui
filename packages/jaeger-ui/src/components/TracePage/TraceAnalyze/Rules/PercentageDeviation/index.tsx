import React from 'react';
import { PercentageDeviationComponent } from './percentageDeviationComponent'

/**
 * Used to render PercentageDeviation.
 */
export default function percentageDeviation(information: string) {

    return (
        <PercentageDeviationComponent
            information={information} />
    )
}