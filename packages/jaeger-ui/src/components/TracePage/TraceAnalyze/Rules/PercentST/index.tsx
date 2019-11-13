import React from 'react';
import { PercentSTComponent } from './percentSTConponent'

/**
 * Used to render PercentSTComponent.
 * @param information 
 */
export default function percentST(information: string) {

    return (
        <PercentSTComponent
            information={information} />
    )

}