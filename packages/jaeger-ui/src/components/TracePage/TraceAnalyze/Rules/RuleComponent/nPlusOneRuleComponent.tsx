import React, { Component } from 'react';
import { Trace } from '../../../../../types/trace';

import './nPlusOneRuleComponent.css';

export const NPlusOneRuleComponent = (props: any) => {
    var information = new Array();
    information = props.information.split("#");
    var calls = new Array();
    calls = props.calls.split('#');   
    return (
            <table className="informationTable">
                <tbody>
                    {information.map((oneInfo: String, index: number) => {
                        return (<tr key={index + "nPlusOneRule"}>
                            <th key={index + "calls"} className="requestTH">
                                <label>Request: {calls[index]}</label>
                            </th>
                            <th className="sqlTH">
                                <textarea key={index + "info"} className="sqlInformation" readOnly value={information[index]}></textarea>
                            </th>
                        </tr>)
                    })}
                </tbody>
            </table>
    );
}

