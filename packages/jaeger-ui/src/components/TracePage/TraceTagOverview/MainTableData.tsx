import React from 'react';
import './MainTableData.css';

/**
 * Used to render the main column.
 */
export const MainTableData = (props: any) => {

  const trOption1 = {
    background: props.searchColor,
    borderColor: props.searchColor,
    cursor: "pointer"
  };

  const trOption2 = {
    background: props.searchColor,
    borderColor: props.searchColor
  }

  const labelOption1 = {
    borderColor: props.color,
    color: "rgb(153,153,153)",
    fontStyle: "italic"
  }

  const labelOption2 = {
    borderColor: props.color
  }

  const trStyle = props.dropdowntestTitle2 !== 'No Item selected' ? trOption1 : trOption2;
  const onClickOption = props.dropdownTestTitle1 === "sql" && props.name !== "Others" ? () => props.togglePopup(props.name) : undefined
  const labelStyle = props.name === "Others" ? labelOption1 : labelOption2
  return (
    <tr className="MainTableData--tr" onClick={() => props.clickColumn(props.name)} style={trStyle}>
      <td className="MainTableData--td" onClick={onClickOption}><label title={props.name} className="MainTableData--labelBorder" style={labelStyle}>{props.name}</label></td>
      {props.values.map((value: any, index: number, content1: any, content2: any) => (
        content1 = props.columnsArray[index + 1].isDecimal ? value.toFixed(2) : value,
        content2 = props.columnsArray[index + 1].suffix,
        <td key={index} className="MainTableData--td"> {content1}{content2}</td>
      ))
      }
    </tr>
  )
}