import React from 'react';
import './PercentageDeviationComponent.css';

/**
 * Used to render TimeOperationRuleComponent.
 */
export const PercentageDeviationComponent = (props: any) => {

    var oneColumn = props.information.split(",");
    console.log("Hello World");
    oneColumn.splice(oneColumn.length-1,1);

    return (
            <table className="PercentageDeviationComponent--Table">
                <tbody>
                    {oneColumn.map((oneInfo: String, index: number, value : String[])=>{
                        value = oneInfo.split("#")
                        return (<tr key={index + "PercentageDeviationSpanID"}>
                        <th key={index + "PercentageDeviation"} className="PercentageDeviationComponent--spandIDTH">
                            <label className="PercentageDeviationComponent--label">SpanID: {value[0]}</label>
                        </th>
                        <th className="PercentageDeviationComponent--durationTH">
                            <textarea key={index + "PercentageDeviationDuration"} className="PercentageDeviationComponent--durationInformation" readOnly value={value[1]+"%"}></textarea>
                        </th>
                    </tr>)
    
                    })}
                </tbody>
            </table>
        );
}

