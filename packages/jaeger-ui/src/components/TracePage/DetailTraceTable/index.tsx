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

  countButton: number,
  totalButton: number,
  avgButton: number,
  minButton: number,
  maxButton: number,
  excButton: number,
  excAvgButton: number,
  excMinButton: number,
  excMaxButton: number,
  percentButton: number,
  nameButton: number,
};

const columnsArray: any[] = [
  {
    "title": "Name",
    "suffix": "",
    "isDecimal": false
  },
  {
    "title": "Count",
    "suffix": "",
    "isDecimal": false
  },
  {
    "title": "Total",
    "suffix": "ms",
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

      countButton: 0,
      totalButton: 0,
      avgButton: 0,
      minButton: 0,
      maxButton: 0,
      excButton: 0,
      excAvgButton: 0,
      excMinButton: 0,
      excMaxButton: 0,
      percentButton: 0,
      nameButton: 0,
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

  /**
   * sorts table according to selected parameters
   * @param Id button with this name is clicked
   * @param sortBy whitch parameter is clicked
   */
  sortClick(id: string, sortBy: string) {

    this.setAllStatusZero(id);

    var status1 = (this.state as any)[id];
    var element = document.getElementById(id);
    this.setAllOpacityLower();

    if ((this.state as any)[id] == 0) {
      element!.style.opacity = '1.0';
      status1 = 1;
      this.setState((prevState) => ({
        ...prevState,
        [id]: status1,
        allSpans: sortTable(this.state.allSpans, sortBy, 'Down'),
      }));
    } else if ((this.state as any)[id] == 1) {
      element!.style.opacity = '1.0';
      status1 = 2;
      this.setState((prevState) => ({
        ...prevState,
        [id]: status1,
        allSpans: sortTable(this.state.allSpans, sortBy, 'Up'),
      }));
    } else if ((this.state as any)[id] == 2) {
      element!.style.opacity = '1.0'
      status1 = 1;

      this.setState((prevState) => ({
        ...prevState,
        [id]: status1,
        allSpans: sortTable(this.state.allSpans, sortBy, 'Down'),
      }));

    }
  }
  /**
   * set the status of the button to 0
   * @param status clicked button should not be set to 0
   */

  setAllStatusZero(status: string) {

    var allButtons = new Array();

    allButtons.push('nameButton');
    allButtons.push('countButton');
    allButtons.push('totalButton');
    allButtons.push('avgButton');
    allButtons.push('minButton');
    allButtons.push('maxButton');
    allButtons.push('excButton');
    allButtons.push('excAvgButton');
    allButtons.push('excMinButton');
    allButtons.push('excMaxButton');
    allButtons.push('percentButton');

    var index = allButtons.indexOf(status);
    if (index !== -1) allButtons.splice(index, 1);

    this.setState((prevState) => ({
      ...prevState,
      [allButtons[0]]: 0,
      [allButtons[1]]: 0,
      [allButtons[2]]: 0,
      [allButtons[3]]: 0,
      [allButtons[4]]: 0,
      [allButtons[5]]: 0,
      [allButtons[6]]: 0,
      [allButtons[7]]: 0,
      [allButtons[8]]: 0,
      [allButtons[9]]: 0,
    }));

  }


  /**
   * as standard count is sorted 
   */
  componentDidMount() {
    this.sortClick('countButton', 'count');
  }

  /**
   * sets the opasity of all buttons lower
   */
  setAllOpacityLower() {

    var allIds = ['nameButton', 'countButton', 'totalButton', 'avgButton', 'minButton', 'maxButton',
      'excButton', 'excAvgButton', 'excMinButton', 'excMaxButton', 'percentButton'];
    for (var i = 0; i < allIds.length; i++) {
      var element = document.getElementById(allIds[i]);
      element!.style.opacity = '0.2';
    }
  }

  /*
  sortClick2(index: number) {
    const {sortIndex, sortAsc} = this.state;

    columnsArray[sortIndex].title;

    if (sortIndex != index) {
      // erste klick in die spalte
      this.setState({
        sortIndex: index,
        sortAsc: false
      });
    } else {
      // weitere klicks in selbe spalte
      this.setState({
        sortAsc: !sortAsc
      });
    }
  }
  */

  /**
   * render the header of the table with the buttons needed for sorting
   */
  renderTableHeader() {
  /*
    // annahme
    // state.sortIndex // spalte nach    
    // state.sortAsc // true falls aufsteigend   
    const {sortIndex, sortAsc} = this.state; //deconstruction syntax

    return (
      <tr>
        {columnsArray.map((element: any, index: number) => (
          <th className="DetailTraceTableTH" key={element.title}>
            {element.title}
            <div>
              <button className="sortButton" onClick={() => this.sortClick2(index)}>
                <Icon style={{opacity: sortIndex == index ? 1.0 : 0.2}} type={sortAsc && sortIndex == index ? "up" : "down"} />
              </button>
            </div>
          </th>
        ))}


        {columnsArray.map((element: any, index: number) => (
          <TableOverviewHead element={element} />    ############ Stateless Components
        ))}
      </tr>
    );
    */

    return (<tr>
      <th id="DetailTraceTableTH" key='name'>Name <div id="buttonPosition"><button className="sortButton" id="nameButton" onClick={() => this.sortClick('nameButton', 'name')}>   <Icon type={this.state.nameButton == 0 ? "down" : this.state.nameButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='count'>Count <div id="buttonPosition"><button className="sortButton" id="countButton" onClick={() => this.sortClick('countButton', 'count')}>  <Icon type={this.state.countButton == 0 ? "down" : this.state.countButton == 1 ? "down" : "up"} />  </button></div>
      </th>
      <th id="DetailTraceTableTH" key='total'>Total<div id="buttonPosition"> <button className="sortButton" id="totalButton" onClick={() => this.sortClick('totalButton', 'total')}> <Icon type={this.state.totalButton == 0 ? "down" : this.state.totalButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='avg'>Avg <div id="buttonPosition"><button className="sortButton" id="avgButton" onClick={() => this.sortClick('avgButton', 'avg')}> <Icon type={this.state.avgButton == 0 ? "down" : this.state.avgButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='min'>Min <div id="buttonPosition"><button className="sortButton" id="minButton" onClick={() => this.sortClick('minButton', 'min')}> <Icon type={this.state.minButton == 0 ? "down" : this.state.minButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='max'>Max  <div id="buttonPosition"><button className="sortButton" id="maxButton" onClick={() => this.sortClick('maxButton', 'max')}> <Icon type={this.state.maxButton == 0 ? "down" : this.state.maxButton == 1 ? "down" : "up"} /></button></div>
      </th>
      <th id="DetailTraceTableTH" key='exc'>Total Exc <div id="buttonPosition"><button className="sortButton" id="excButton" onClick={() => this.sortClick('excButton', 'exc')}> <Icon type={this.state.excButton == 0 ? "down" : this.state.excButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='excAvg'>Exc. Avg <div id="buttonPosition"><button className="sortButton" id="excAvgButton" onClick={() => this.sortClick('excAvgButton', 'excAvg')}> <Icon type={this.state.excAvgButton == 0 ? "down" : this.state.excAvgButton == 1 ? "down" : "up"} /></button></div>
      </th>
      <th id="DetailTraceTableTH" key='excMin'>Exc. Min <div id="buttonPosition"><button className="sortButton" id="excMinButton" onClick={() => this.sortClick('excMinButton', 'excMin')}>  <Icon type={this.state.excMinButton == 0 ? "down" : this.state.excMinButton == 1 ? "down" : "up"} /> </button></div>
      </th>
      <th id="DetailTraceTableTH" key='excMax'>Exc. Max <div id="buttonPosition"><button className="sortButton" id="excMaxButton" onClick={() => this.sortClick('excMaxButton', 'excMax')}>  <Icon type={this.state.excMaxButton == 0 ? "down" : this.state.excMaxButton == 1 ? "down" : "up"} /></button></div>
      </th>
      <th id="DetailTraceTableTH" key='percent'>Percent<div id="buttonPosition"><button className="sortButton" id="percentButton" onClick={() => this.sortClick('percentButton', 'percent')}>  <Icon type={this.state.percentButton == 0 ? "down" : this.state.percentButton == 1 ? "down" : "up"} /></button></div>
      </th>
    </tr>
    );
  }

  /**
  * render the table data
  *  first return is for span operationname
  *  second return for the child 
  */
  renderTableData() {
    return this.state.allSpans.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, isDetail, key, exc, excAvg, excMin, excMax, percent, color, searchColor } = oneSpan
      
      const values: any[] = [name, count, total];
      
      if (!oneSpan.isDetail) {
        return (
          <tr id="DetailTraceTableTR" key={key} onClick={() => this.clickColumn(oneSpan)} style={{ background: searchColor, borderColor: searchColor }}>
            <td id="DetailTraceTableTD" title={name}>{name} </td>
            <td id="DetailTraceTableTD">{count}</td>
            <td id="DetailTraceTableTD">{total.toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{avg.toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{min.toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{max.toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{exc.toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{excAvg.toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMin.toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMax.toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{percent.toFixed(2) + '%'}</td>
            {/*

              values.map((value, index) => (
                <td title={index==0 ? value : "" }>{columnsArray[index].isDecimal ? value.toFixed(2) : value}{columnsArray[index].suffix}</td>
              ))

            */ }
          </tr>
        )
      } else {
        return (
          <tr id="DetailTraceTableTR1" key={key} style={{ background: searchColor, borderColor: searchColor }}>
            <td id="DetailTraceTableChildTD" ><label id="serviceBorder" style={{ borderColor: color }}>{name}</label></td>
            <td id="DetailTraceTableTD">{count}</td>
            <td id="DetailTraceTableTD">{Number(total).toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{Number(avg).toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{Number(min).toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{Number(max).toFixed(2) + "ms"}</td>
            <td id="DetailTraceTableTD">{Number(exc).toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{Number(excAvg).toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{Number(excMin).toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{Number(excMax).toFixed(2) + 'ms'}</td>
            <td id="DetailTraceTableTD">{Number(percent).toFixed(2) + '%'}</td>
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









