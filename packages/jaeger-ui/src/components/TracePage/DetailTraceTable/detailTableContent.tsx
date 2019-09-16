import React from 'react';
import './detailTableContent.css';

/**
 * returns the detail table content
 * @param props all information needed to create the table
 */
export const DetailTableContent = (props: any) => {
  return (
    <tr className="DetailTraceTableTR" style={{ background: props.searchColor, borderColor: props.searchColor }}>
      <td ><label className="DetailTableContentTDL" > {props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="DetailTableContentTD" title={index == 0 ? value : ""}>{props.columnsArray[index].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index+1].suffix}</td>
      ))
      }
    </tr>
  )
}