import React from 'react';
import './mainTableContent.css';

/**
 * returns the detail table content
 * @param props all information needed to create the table
 */
export const MainTableContent = (props: any) => {
  return (
    <tr className="MainTableContentTR1" style={{ background: props.searchColor, borderColor: props.searchColor }}>
      <td onClick={() => props.clickColumn(props.oneSpan)}><label className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td onClick={() => props.clickColumn(props.oneSpan)} key={index} className="MainTableContentTD" > {value +props.columnsArray[index+1].suffix }</td>
      ))
      }
    </tr>
  )
}