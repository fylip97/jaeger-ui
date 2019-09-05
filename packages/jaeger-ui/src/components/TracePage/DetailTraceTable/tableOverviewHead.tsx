import React, { Component } from 'react';
import { Icon } from 'antd';
import './index.css';





export const TableOverviewHeader = (props: any) => {
  
    return(
        <th className="DetailTraceTableTH">
            {props.element.title}
            <div className="buttonPosition">
            <button className="sortButton" onClick={() => props.sortClick(props.index)}>
                <Icon style={{ opacity: props.sortIndex == props.index ? 1.0 : 0.2 }} type={props.sortAsc && props.sortIndex == props.index ? "up" : "down"} />
              </button>
            </div>
          </th>
    )
  
}