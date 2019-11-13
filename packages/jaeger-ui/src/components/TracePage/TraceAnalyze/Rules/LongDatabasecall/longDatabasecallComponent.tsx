import React from 'react';
import './longDatabasecallComponent.css';

/**
 * Used to render TimeOperationRuleComponent
 */
export const LongDatabasecallComponent = (props: any) => {

    var oneColumn = props.information.split(',');
    oneColumn.splice(oneColumn.length-1,1);

    return (
        <table className="LongDatabasecall--Table">
            <tbody>
                {oneColumn.map((oneInfo: String, index: number, value : String[])=>{
                    value = oneInfo.split("#");
                    return (<tr key={index + "longDatabasecallSpanID"}>
                    <th key={index + "longDatabasecall"} className="LongDatabasecall--spandIDTH">
                        <label className="LongDatabasecall--label">SpanID: {value[0]}</label>
                    </th>
                    <th className="LongDatabasecall--durationTH">
                        <textarea key={index + "longDatabasecallDuration"} className="LongDatabasecall--durationInformation" readOnly value={value[1]+"ms"}></textarea>
                    </th>
                </tr>)

                })}
            </tbody>
        </table>
    );
}
