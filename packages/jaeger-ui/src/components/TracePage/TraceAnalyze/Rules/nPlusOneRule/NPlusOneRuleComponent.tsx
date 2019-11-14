import React from 'react';
import './NPlusOneRuleComponent.css';

/**
 * Used to render the NPlusOneRuleComponent. 
 */
export const NPlusOneRuleComponent = (props: any) => {

    var oneColumn = props.information.split("§");
    oneColumn.splice(oneColumn.length-1,1);

    return (
        <table className="nPlusOneRuleComponent--informationTable">
            <tbody>
                {oneColumn.map((oneInfo: String, index: number, value: string[]) => {
                    value = oneInfo.split("#");
                    return (<tr key={index + "nPlusOneRule"}>
                        <th key={index + "calls"} className="requestTH">
                            <label>Request: {value[0]}</label>
                        </th>
                        <th className="nPlusOneRuleComponent--sqlTH">
                            <textarea key={index + "info"} className="nPlusOneRuleComponent--sqlInformation" readOnly value={value[1]}></textarea>
                        </th>
                    </tr>)
                })}
            </tbody>
        </table>
    );
}

