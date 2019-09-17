import React from 'react';
import { Icon } from 'antd';
import './tableOverviewHead.css';


export const TableOverviewHeader = (props: any) => {
  return (
    <th className="DetailTraceTableTH"  style= {{width: Math.round(window.innerWidth * 0.2)}}>
      {props.element.title}
      {props.element.title==="Percent" ? <button onClick={props.toggleColorToPercent}> c</button>: null}
      <div className="buttonPosition">
        <button className="sortButton" onClick={() => props.sortClick(props.index)}>
          <Icon style={{ opacity: props.sortIndex == props.index ? 1.0 : 0.2 }} type={props.sortAsc && props.sortIndex == props.index ? "up" : "down"} />
        </button>
      </div>
    </th>
  )
}