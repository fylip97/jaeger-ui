import React from 'react';
import './mainTableContent.css';

export const MainTableContent = (props: any) => {
  return (
    <tr className="MainTableContentTR1" style={{ background: props.searchColor, borderColor: props.searchColor }}>
      <td onClick={() => props.clickColumn(props.oneSpan)}><label className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td onClick={() => props.clickColumn(props.oneSpan)} key={index} className="MainTableContentTD" >{(props.columnsArray[index+1].attribute ==='count') ? value +props.columnsArray[index+1].suffix : ""}</td>
      ))
      }
    </tr>
  )
}