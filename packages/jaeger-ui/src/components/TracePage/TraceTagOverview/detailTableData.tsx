import React from 'react';
import './detailTableData.css';

export const DetailTableData = (props: any) => {
  return (
    <tr className="DetailTraceTableTR1" style={ props.name ==='rest2'? {background: '#C5D9D9'}: props.searchColor==="#ECECEC"? { background: props.colorToPercent, borderColor: props.colorToPercent }: {background: props.searchColor, borderColor: props.searchColor}}>
      <td className="DetailTraceTableChildTD" onClick= {props.secondTagDropdownTitle==="sql" && props.name!== "rest" ? ()=> props.togglePopup(props.name): undefined }><label title={props.name}className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number) => (
        <td key={index} className="DetailTraceTableTD" >{props.columnsArray[index + 1].isDecimal ? (Number)(value).toFixed(2) : value}{props.columnsArray[index + 1].suffix}</td>
      ))
      }
    </tr>
  )
}