import React from 'react';
import './PercentSTComponent.css';

/**
 * Used to render the PercentSTComponent.
 */
export const PercentSTComponent = (props: any) => {

    var oneColumn = props.information.split(',');
    oneColumn.splice(oneColumn.length - 1, 1);

    return (
        <table className="PercentSTComponent--Table">
            <tbody>
                {oneColumn.map((oneInfo: String, index: number, value: String[]) => {
                    value = oneInfo.split("#")
                    return (<tr key={index + "PercentSTSpanID"}>
                        <th key={index + "PercentST"} className="PercentSTComponent--spandIDTH">
                            <label className="PercentSTComponent--label">SpanID: {value[0]}</label>
                        </th>
                        <th className="PercentSTComponent--durationTH">
                            <textarea key={index + "PercentSTDuration"} className="PercentSTComponent--durationInformation" readOnly value={value[1] + "ms"}></textarea>
                        </th>
                    </tr>)
                })}
            </tbody>
        </table>
    );
}

