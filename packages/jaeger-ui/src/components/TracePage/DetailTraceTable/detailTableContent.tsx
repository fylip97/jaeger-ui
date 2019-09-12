import React from 'react';
import './detailTableContent.css';

export const DetailTableContent = (props: any) => {
  return (
    <tr className="DetailTraceTableTR" style={{ background: props.searchColor, borderColor: props.searchColor }}>
      <td ><label className="DetailTraceTableChildTD" > {props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="DetailTraceTableTD" title={index == 0 ? value : ""}>{props.columnsArray[index].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index].suffix}</td>
      ))
      }
    </tr>
  )
}