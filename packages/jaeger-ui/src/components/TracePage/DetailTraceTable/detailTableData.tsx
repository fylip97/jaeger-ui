import React from 'react';
import './index.css';

export const DetailTableData = (props: any) => {
    return(
        <tr className="DetailTraceTableTR1" style={{ background: props.searchColor, borderColor: props.searchColor }}>
            <td className="DetailTraceTableChildTD" ><label className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
            {props.values2.map((value:any, index:number) => (
              <td key={index} className="DetailTraceTableTD" >{props.columnsArray[index + 1].isDecimal ? (Number)(value).toFixed(2) : value}{props.columnsArray[index + 1].suffix}</td>
            ))
            }
          </tr>
   
    )

}