import React from 'react';
import './mainTableData.css';

export const MainTableData = (props: any) => {
  return (
    <tr className="MainTableDataTR" onClick={()=>props.clickColumn(props.name)} style={props.values[0]!=='rest' ?{  background: props.searchColor, borderColor: props.searchColor }: {background: '#C5D9D9', borderColor: '#C5D9D9' }}>
      <td className="" onClick= {props.secondTagDropdownTitle==="sql" && props.name!== "rest" ? ()=> props.togglePopup(props.name): undefined }><label title={props.name} className="LabelBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="MainTableDataTD">{props.columnsArray[index+1].isDecimal ? value.toFixed(2) : value}{props.columnsArray[index+1].suffix}</td>
      ))
      }
    </tr>
  )
}