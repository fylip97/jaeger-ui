import React from 'react';
import { Icon } from 'antd';
import './tableOverviewHeadTag.css';


export const TableOverviewHeaderTag = (props: any) => {
  return (
    <th className="DetailTraceTableTH"  style= {{width: Math.round(window.innerWidth * 0.2)}} title={props.element.title==="Percent"? "Share of ST Total in Duration" : ""}>
      {props.element.title}
      <div className="buttonPosition">
        <button className="sortButton" onClick={() => props.sortClick(props.index)}>
          <Icon style={{ opacity: props.sortIndex == props.index ? 1.0 : 0.2 }} type={props.sortAsc && props.sortIndex == props.index ? "up" : "down"} />
        </button>
      </div>
    </th>
  )
}