import React, { Component } from 'react';
import { Icon } from 'antd';



const TableOverviewHeader =(element:any, sortIndex:number, index:number, sortClick: (index:number) => void, sortAsc:boolean) => {
    return(
        <th className="DetailTraceTableTH" key={element.title}>
            {element.title}
            <div className="buttonPosition">
            <button className="sortButton" onClick={() => sortClick(index)}>
                <Icon style={{ opacity: sortIndex == index ? 1.0 : 0.2 }} type={sortAsc && sortIndex == index ? "up" : "down"} />
              </button>
            </div>
          </th>
    )
}