import React from 'react';
import './DetailTableData.css';
import classNames from 'classnames';

/**
 * Used to render the detail column.
 * @param props 
 */

export const DetailTableData = (props: any) => {

  const var1 = {
    background: '#F8F8F8',
    color: '#999',
    fontStyle: 'italic'
  }

  const var2 ={
    background: props.colorToPercent,
    borderColor: props.colorToPercent 
  }

  const var3 = {
    background: props.searchColor, 
    borderColor: props.searchColor 
  }
  const onClickOption = props.secondTagDropdownTitle === "sql" && props.name !== "Others" ? () => props.togglePopup(props.name) : undefined;
  return (
    <tr className="detailTable--tr" style={props.name === 'Others' ? var1 : props.searchColor === "#F8F8F8" ? var2 : var3}>
      <td className="detailTableChild--td" onClick={onClickOption}><label title={props.name} className="serviceBorder" style={{ borderColor: props.color }}>{props.name}</label></td>
      {props.values.map((value: any, index: number, content1:any, content2:any) => (
        content1= props.columnsArray[index + 1].isDecimal ? (Number)(value).toFixed(2) : value,
        content2= props.columnsArray[index + 1].suffix,
        <td key={index} className="detailTable--td" >{content1}{content2}</td>
      ))
      }
    </tr>
  )
}