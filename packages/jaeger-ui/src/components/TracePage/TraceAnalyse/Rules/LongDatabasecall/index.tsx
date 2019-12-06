import React from 'react';
import { LongDatabasecallComponent } from './LongDatabasecallComponent'

/**
 * Used to render LongDatabasecall. 
 */
export default function longDatabasecall(information: string) {

    return (
        <LongDatabasecallComponent
            information={information} />
    )

}