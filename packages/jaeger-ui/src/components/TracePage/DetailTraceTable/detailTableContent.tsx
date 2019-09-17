import React from 'react';
import './detailTableContent.css';

/**
 * returns the detail table content
 * @param props all information needed to create the table
 */
export const DetailTableContent = (props: any) => {
  return (
    <tr className="DetailTraceTableTR" style={ props.searchColor==="#ECECEC"? { background: props.colorToPercent, borderColor: props.colorToPercent }: {background: props.searchColor, borderColor: props.searchColor}}>
      <td ><label className="DetailTableContentTDL" title={props.name}> {props.name} </label></td>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="DetailTableContentTD" >{props.columnsArray[index].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index+1].suffix}</td>
      ))
      }
    </tr>
  )
}