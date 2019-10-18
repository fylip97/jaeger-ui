import React, { Component } from 'react';
import { Trace } from '../../../../../types/trace';

import './percentSTComponent.css';

export const PercentSTComponent = (props: any) => {

    var information = new Array();
    information = props.information.split("#");

    
    return (
        <table className="percentSTTable"> 
            <tbody>
            {information.map((oneInfo: String, index: number) => {
                        return (<tr key={index + "percentST"}>
                            <th className="percentSTidTH">Span Id:</th>
                            <th className="percentSTTH">
                                <textarea key={index + "percentSTinfo"} className="percentSTInformation" readOnly value={information[index]}></textarea>
                            </th>
                        </tr>)
                    })}
            </tbody>
        </table>
    
    );
}

