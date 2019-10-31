import React from 'react';
import { Icon } from 'antd';
import './TableOverviewHeadTag.css';

/**
 * used to render the table header
 * @param props 
 */
export const TableOverviewHeaderTag = (props: any) => {
  const thStyle = { width: Math.round(window.innerWidth * 0.2) };
  const titleValue = props.element.title === "Percent" ? "Share of ST Total in Duration" : "";
  const iconStyle = { opacity: props.sortIndex == props.index ? 1.0 : 0.2 };
  const iconType = props.sortAsc && props.sortIndex == props.index ? "up" : "down";
  return (
    <th className="tableOverviewHeadTag--th" style={thStyle} title={titleValue}>
      {props.element.title}
      <div className="tableOverviewHeaderTag--buttonPosition">
        <button className="tableOverviewHeaderTag--sortButton" onClick={() => props.sortClick(props.index)}>
          <Icon style={iconStyle} type={iconType} />
        </button>
      </div>
    </th>
  )
}