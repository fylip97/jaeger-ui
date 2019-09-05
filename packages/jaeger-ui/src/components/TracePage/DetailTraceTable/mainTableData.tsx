import React, {Component} from 'react';
import './index.css';

export const MainTableData = (props: any) => {
    return(
    <tr id="DetailTraceTableTR" onClick={() => props.clickColumn(props.oneSpan)} style={{ background: props.searchColor, borderColor: props.searchColor }}>
            {props.values.map((value: any, index:number) => (
              <td key ={index} className="DetailTraceTableTD" title={index == 0 ? value : ""}>{props.columnsArray[index].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index].suffix}</td>
            ))
            }
          </tr>
    )

}