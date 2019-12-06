import React from 'react';
import { Icon } from 'antd';
import './TableOverviewHeadTag.css';

/**
 * Used to render the table header.
 * @param props 
 */
export const TableOverviewHeaderTag = (props: any) => {
  const thStyle = { width: Math.round(window.innerWidth * 0.2) };
  const iconStyle = { opacity: props.sortIndex == props.index ? 1.0 : 0.2 };
  const iconType = props.sortAsc && props.sortIndex == props.index ? "up" : "down";
  return (
    <th className="TableOverviewHeadTag--th" style={thStyle} >
      {props.element.title}
      <div className="TableOverviewHeaderTag--buttonPosition">
        <button className="TableOverviewHeaderTag--sortButton" onClick={() => props.sortClick(props.index)}>
          <Icon style={iconStyle} type={iconType} />
        </button>
      </div>
    </th>
  )
}