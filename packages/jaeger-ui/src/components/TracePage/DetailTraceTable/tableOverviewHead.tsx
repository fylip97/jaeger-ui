import React from 'react';
import { Icon } from 'antd';
import './tableOverviewHead.css';


export const TableOverviewHeader = (props: any) => {
  return (
    <th className="DetailTraceTableTH"  style= {{width: Math.round(window.innerWidth * 0.2)}} title={props.element.title==="Percent"? "Share of ST Total in Duration" : ""}>
      {props.element.title}
      {props.element.title==="Percent" ? <button className="colorButton" style ={{color: props.colorToPercent ? "red": "#6AA7AB"}}onClick={props.toggleColorToPercent}> color</button>: null}
      <div className="buttonPosition">
        <button className="sortButton" onClick={() => props.sortClick(props.index)}>
          <Icon style={{ opacity: props.sortIndex == props.index ? 1.0 : 0.2 }} type={props.sortAsc && props.sortIndex == props.index ? "up" : "down"} />
        </button>
      </div>
    </th>
  )
}