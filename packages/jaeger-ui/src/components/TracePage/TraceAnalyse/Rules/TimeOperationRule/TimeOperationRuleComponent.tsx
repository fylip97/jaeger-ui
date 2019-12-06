import React from 'react';
import './TimeOperationRuleComponent.css';

/**
 * Used to render TimeOperationRuleComponent.
 */
export const TimeOperationRuleComponent = (props: any) => {

    var oneColumn = props.information.split(',');
    oneColumn.splice(oneColumn.length - 1, 1);

    return (
        <table className="TimeOperationRuleComponent--Table">
            <tbody>
                {oneColumn.map((oneInfo: String, index: number, value: String[]) => {
                    value = oneInfo.split("#")
                    return (<tr key={index + "TimeOperationRuleSpanID"}>
                        <th key={index + "TimeOperationRule"} className="TimeOperationRuleComponent--spandIDTH">
                            <label className="TimeOperationRuleComponent--label">SpanID: {value[0]}</label>
                        </th>
                        <th className="TimeOperationRuleComponent--durationTH">
                            <textarea key={index + "TimeOperationRuleSTDuration"} className="TimeOperationRuleComponent--durationInformation" readOnly value={value[1] + "ms"}></textarea>
                        </th>
                    </tr>)
                })}
            </tbody>
        </table>
    );
}

