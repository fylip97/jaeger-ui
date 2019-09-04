import React, { Component } from 'react';


import { Trace } from '../../../types/trace';
import { TableSpan } from './types'
import { getDetailTableContent } from './exclusivtime'
import { fullTableContent } from './exclusivtime'
import { sortTable } from './sortTable'
import { Icon } from 'antd';
import { TNil } from '../../../types';
import { searchInTable } from './searchInTable';
import './index.css';
import { isNotClicked } from './exclusivtime';



type Props = {
  traceProps: Trace,
  uiFindVertexKeys: Set<string> | TNil;
};

type State = {
  allSpans: TableSpan[],
  sortIndex: number,
  sortAsc: boolean,


};

const columnsArray: any[] = [
  {
    "title": "Name",
    "attribute": "name",
    "suffix": "",
    "isDecimal": false
  },
  {
    "title": "Count",
    "attribute": "count",
    "suffix": "",
    "isDecimal": false
  },
  {
    "title": "Total",
    "attribute": "total",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Avg",
    "attribute": "avg",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Min",
    "attribute": "min",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Max",
    "attribute": "max",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Total Exc",
    "attribute": "exc",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Exc Avg",
    "attribute": "excAvg",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Exc Min",
    "attribute": "excMin",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Exc Max",
    "attribute": "excMax",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Percent",
    "attribute": "percent",
    "suffix": "%",
    "isDecimal": true
  }
];

export default class DetailTraceTable extends Component<Props, State>{

  constructor(props: any) {
    super(props);

    var allSpans = this.props.traceProps.spans;
    var allSpansDiffOpName = new Array();

    for (var i = 0; i < allSpans.length; i++) {
      if (allSpansDiffOpName.length == 0) {
        allSpansDiffOpName.push(allSpans[i].operationName);
      } else {
        var sameName = false;
        for (var j = 0; j < allSpansDiffOpName.length; j++) {
          if (allSpansDiffOpName[j] === allSpans[i].operationName) {
            sameName = true;
          }
        }
        if (!sameName) {
          allSpansDiffOpName.push(allSpans[i].operationName);
        }
      }
    }

    var allSpansTrace = Array();

    allSpansTrace = fullTableContent(allSpansDiffOpName, allSpans);

    this.state = {
      allSpans: allSpansTrace,
      sortIndex: 0,
      sortAsc: false,
    }


    searchInTable(this.props.uiFindVertexKeys!, this.state.allSpans);
  }

  /**
   * when clicking on column
   *  shows the child if the column has not been clicked before
   *  does not show the children any more if the column has been clicked before
   * @param selectedSpan the column who is been clicked
   */
  clickColumn(selectedSpan: TableSpan) {

    var wholeTraceSpans = this.props.traceProps.spans;
    var allSpans = this.state.allSpans;
    var sameOperationName = new Array();
    var diffServiceName = new Array();
    var addItemArray = new Array();

    var isClicked;
    var rememberIndex = 0;
    for (var i = 0; i < allSpans.length; i++) {
      if (allSpans[i].name === selectedSpan.name) {
        isClicked = allSpans[i].child
        rememberIndex = i;

      }
    }
    if (!isClicked) {

      var tempArray = isNotClicked(allSpans, rememberIndex, wholeTraceSpans, selectedSpan, sameOperationName, diffServiceName);
      addItemArray = getDetailTableContent(tempArray[0], tempArray[1], wholeTraceSpans, selectedSpan.name);
      var rememberIndex = 0;
      for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].name === selectedSpan.name) {
          rememberIndex = i;
        }
      }
      for (var i = 0; i < addItemArray.length; i++) {
        allSpans.splice(rememberIndex + 1, 0, addItemArray[i]);
        rememberIndex += 1;
      }
    } else {
      var tempArray = new Array();
      for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].parentElement !== selectedSpan.name) {
          tempArray.push(allSpans[i]);
        }
        allSpans[rememberIndex].child = false;
      }
      allSpans = [];
      allSpans = tempArray;
    }

    this.setState({
      allSpans: allSpans,

    });

    searchInTable(this.props.uiFindVertexKeys!, this.state.allSpans);
  }

  /**
   * if the search props change the search function is called
   * @param props all props 
   */
  componentDidUpdate(props: any) {
    if ((this.props.uiFindVertexKeys !== props.uiFindVertexKeys)) {
      searchInTable(this.props.uiFindVertexKeys!, this.state.allSpans);
    }
  }

   sortClick(index: number) {
    const { allSpans,sortIndex, sortAsc } = this.state;

    columnsArray[sortIndex].title;

    if (sortIndex != index) {
      this.setState({
        sortIndex: index,
        sortAsc: false,
        allSpans: sortTable(allSpans, columnsArray[index].attribute, sortAsc),
      });
    } else {
      this.setState({
        sortAsc: !sortAsc,
        allSpans: sortTable(allSpans, columnsArray[index].attribute, !sortAsc),
      });
    }
  }

  componentDidMount() {
    this.sortClick(1);
  }



  /**
   * render the header of the table with the buttons needed for sorting
   */
  renderTableHeader() { 
    const { sortIndex, sortAsc } = this.state;

    return (
      <tr>
        {columnsArray.map((element: any, index: number) => (
          <th className="DetailTraceTableTH" key={element.title}>
            {element.title}
            <div className="buttonPosition">
              <button className="sortButton" onClick={() => this.sortClick(index)}>
                <Icon style={{ opacity: sortIndex == index ? 1.0 : 0.2 }} type={sortAsc && sortIndex == index ? "up" : "down"} />
              </button>
            </div>
          </th>
        ))}
      </tr>
    );
  }

   /*
           {columnsArray.map((element: any, index: number) => (
          <TableOverviewHead element={element} />    ############ Stateless Components
        ))}


    */


  /**
  * render the table data
  *  first return is for span operationname
  *  second return for the child 
  */
  renderTableData() {
    return this.state.allSpans.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, isDetail, key, exc, excAvg, excMin, excMax, percent, color, searchColor } = oneSpan
      const values: any[] = [name, count, total, avg, min, max, exc, excAvg, excMin, excMax, percent];
      const values2: any[] = [count, total, avg, min, max, exc, excAvg, excMin, excMax, percent];

      if (!oneSpan.isDetail) {
        return (
          <tr id="DetailTraceTableTR" key={key} onClick={() => this.clickColumn(oneSpan)} style={{ background: searchColor, borderColor: searchColor }}>
            {values.map((value, index) => (
              <td className="DetailTraceTableTD" title={index == 0 ? value : ""}>{columnsArray[index].isDecimal ? value.toFixed(2) : value}{columnsArray[index].suffix}</td>
            ))
            }
          </tr>
        )
      } else {
        return (
          <tr className="DetailTraceTableTR1" key={key} style={{ background: searchColor, borderColor: searchColor }}>
            <td className="DetailTraceTableChildTD" ><label className="serviceBorder" style={{ borderColor: color }}>{name}</label></td>
            {values2.map((value, index) => (
              <td className="DetailTraceTableTD" >{columnsArray[index + 1].isDecimal ? (Number)(value).toFixed(2) : value}{columnsArray[index + 1].suffix}</td>
            ))
            }
          </tr>
        )

      }
    })
  }

  render() {
    return (
      <div id="mainDiv">
        <h3 id='title'>Trace Detail</h3>
        <table>
          <tbody id="DetailTraceTableTbody">
            {this.renderTableHeader()}
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }

}









