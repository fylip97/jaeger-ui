import React from 'react';
import './mainTableData.css';

export const MainTableData = (props: any) => {
  return (
    <tr className="MainTableDataTR" style={props.values[0]!=='rest' ?{  background: props.searchColor, borderColor: props.searchColor }: {background: '#C5D9D9', borderColor: '#C5D9D9' }}>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="MainTableDataTD" title={index == 0 ? value : ""}onClick= {(props.tagDropdownTitle==="sql" && index==0 && value !=="rest") ? ()=> props.togglePopup(value): undefined }>{props.columnsArray[index].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index].suffix}</td>
      ))
      }
    </tr>
  )
}