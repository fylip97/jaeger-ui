import React, { Component } from 'react';
import { Trace } from '../../../../../types/trace';

import './timeOperationRuleComponent.css';

export const TimeOperationRuleComponent = (props: any) => {
    var information = new Array();
    information = props.information.split("#");

    return (
            <table className="TORTable">
                <tbody>
                    <tr>
                        <th>
                            <textarea className="TORInformation" value={"the span " +information[0]+ " has a self time of: " +information[1]}></textarea>
                        </th>
                    </tr>
                </tbody>
            </table>
            
    );
}

