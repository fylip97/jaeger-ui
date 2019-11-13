import React from 'react';
import { LongDatabasecallComponent } from './longDatabasecallComponent'

/**
 * Used to render LongDatabasecall. 
 */
export default function longDatabasecall(information: string) {

    return (
        <LongDatabasecallComponent
            information={information} />
    )

}