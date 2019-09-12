import React from 'react';
import './mainTableContent.css';

export const MainTableContent = (props: any) => {
  return (
    <tr className="DetailTraceTableTR1" style={{ background: props.searchColor, borderColor: props.searchColor }}>
      <td ><label className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td onClick={() => props.clickColumn2(props.oneSpan)} key={index} className="DetailTraceTableTD" >{(props.columnsArray[index+1].attribute ==='count'|| props.columnsArray[index+1].attribute==='total') ? value +props.columnsArray[index+1].suffix : ""}</td>
      ))
      }
    </tr>
  )
}