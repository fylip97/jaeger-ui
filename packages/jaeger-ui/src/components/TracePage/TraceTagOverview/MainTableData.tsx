import React from 'react';
import './MainTableData.css';


/**
 * Used to render the main column.
 */
export const MainTableData = (props: any) => {
  const trStyle = props.secondTagDropdownTitle !== 'No item selected' ? { background: props.searchColor, borderColor: props.searchColor, cursor: "pointer" } : { background: props.searchColor, borderColor: props.searchColor };
  const onClickOption= props.tagDropdownTitle === "sql" && props.name !== "Others" ? () => props.togglePopup(props.name) : undefined
  const labelStyle= props.name === "Others" ? { borderColor: props.color, color: "#999", fontStyle: "italic" } : { borderColor: props.color }
  return (
    <tr className="MainTableData--tr" onClick={() => props.clickColumn(props.name)} style={trStyle}>
      <td className="" onClick={onClickOption}><label title={props.name} className="LabelBorder" style={labelStyle}>{props.name === "default" ? "-" : props.name}</label></td>
      {props.values.map((value: any, index: number, content1: any, content2: any) => (
        content1 = props.name === "default" ? "-" : props.columnsArray[index + 1].isDecimal ? value.toFixed(2) : value,
        content2 = props.name !== "default" ? props.columnsArray[index + 1].suffix : "",
        <td key={index} className="MainTableData--td"> {content1}{content2}</td>
      ))
      }
    </tr>
  )
}