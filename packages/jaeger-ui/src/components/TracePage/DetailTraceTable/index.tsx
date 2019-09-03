import React, { Component } from 'react';


import { Span, Trace } from '../../../types/trace';
import { TableSpan } from './types'
import { getDetailTableContent } from './exclusivtime'
import { fullTableContent } from './exclusivtime'
import { sortTable } from './sortTable'
import { Icon } from 'antd';
import { TNil } from '../../../types';
import { searchInTable } from './searchInTable';
import './index.css';
import { isNotClicked } from './exclusivtime'



type Props = {
  traceProps: Trace,
  uiFindVertexKeys: Set<string> | TNil;
};

type State = {
  allSpans: TableSpan[],

  nameButton: boolean,
  countButton: boolean,
  totalButton: boolean,
  avgButton: boolean,
  minButton: boolean,
  maxButton: boolean,
  excButton: boolean,
  excAvgButton: boolean,
  excMinButton: boolean,
  excMaxButton: boolean,
  percentButton: boolean,
};

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

      nameButton: true,
      countButton: true,
      totalButton: true,
      avgButton: true,
      minButton: true,
      maxButton: true,
      excButton: true,
      excAvgButton: true,
      excMinButton: true,
      excMaxButton: true,
      percentButton: true,

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
   * render the header of the table with the buttons needed for sorting
   */
  renderTableHeader() {
    return (<tr>
      <th id="DetailTraceTableTH" key='name'>Name <div id="buttonPosition"><button className="sortButton" id="nameButton" onClick={this.state.nameButton ? () => this.sortClick('name-Up', 'nameButton', false) : () => this.sortClick('name-Down', 'nameButton', true)} > {this.state.nameButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='count'>Count <div id="buttonPosition"><button className="sortButton" id="countButton" onClick={this.state.countButton ? () => this.sortClick('count-Up', 'countButton', false) : () => this.sortClick('count-Down', 'countButton', true)} > {this.state.countButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='total'>Total<div id="buttonPosition"> <button className="sortButton" id="totalButton" onClick={this.state.totalButton ? () => this.sortClick('total-Up', 'totalButton', false) : () => this.sortClick('total-Down', 'totalButton', true)} > {this.state.totalButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='avg'>Avg <div id="buttonPosition"><button className="sortButton" id="avgButton" onClick={this.state.avgButton ? () => this.sortClick('avg-Up', 'avgButton', false) : () => this.sortClick('avg-Down', 'avgButton', true)} > {this.state.avgButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='min'>Min <div id="buttonPosition"><button className="sortButton" id="minButton" onClick={this.state.minButton ? () => this.sortClick('min-Up', 'minButton', false) : () => this.sortClick('min-Down', 'minButton', true)} > {this.state.minButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='max'>Max  <div id="buttonPosition"><button className="sortButton" id="maxButton" onClick={this.state.maxButton ? () => this.sortClick('max-Up', 'maxButton', false) : () => this.sortClick('max-Down', 'maxButton', true)} > {this.state.maxButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='exc'>Total Exc <div id="buttonPosition"><button className="sortButton" id="excButton" onClick={this.state.excButton ? () => this.sortClick('exc-Up', 'excButton', false) : () => this.sortClick('exc-Down', 'excButton', true)} > {this.state.excButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='excAvg'>Exc. Avg <div id="buttonPosition"><button className="sortButton" id="excAvgButton" onClick={this.state.excAvgButton ? () => this.sortClick('excAvg-Up', 'excAvgButton', false) : () => this.sortClick('excAvg-Down', 'excAvgButton', true)} > {this.state.excAvgButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='excMin'>Exc. Min <div id="buttonPosition"><button className="sortButton" id="excMinButton" onClick={this.state.excMinButton ? () => this.sortClick('excMin-Up', 'excMinButton', false) : () => this.sortClick('excMin-Down', 'excMinButton', true)} > {this.state.excMinButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='excMax'>Exc. Max <div id="buttonPosition"><button className="sortButton" id="excMaxButton" onClick={this.state.excMaxButton ? () => this.sortClick('excMax-Up', 'excMaxButton', false) : () => this.sortClick('excMax-Down', 'excMaxButton', true)} > {this.state.excMaxButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
      </th>
      <th id="DetailTraceTableTH" key='percent'>Percent<div id="buttonPosition"><button className="sortButton" id="percentButton" onClick={this.state.percentButton ? () => this.sortClick('percent-Up', 'percentButton', false) : () => this.sortClick('percent-Down', 'percentButton', true)} > {this.state.percentButton ? <Icon type={"up"} /> : <Icon type={"down"} />}</button></div>
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
   * @param name whitch parameter is clicked
   * @param buttonId button with this name is clicked
   * @param status  status of the button 
   */
  sortClick(name: string, buttonId: string, status: boolean) {

    this.setAllOpacityLower();

    this.setState((prevState) => ({
      ...prevState,
      [buttonId]: status,
    }));

    var element = document.getElementById(buttonId);
    element!.style.opacity = '1.0';

    //sort 
    var diffParameter = name.split("-");
    this.setState({
      allSpans: sortTable(this.state.allSpans, diffParameter[0], diffParameter[1]),
    })
  }

  /**
   * as standard count is sorted 
   */
  componentDidMount() {
    this.sortClick('count-Down', 'countButton', true);
  }

  /**
   * sets the opasity of all buttons lower
   */
  setAllOpacityLower() {

    var allIds = ['nameButton', 'countButton', 'totalButton', 'avgButton', 'minButton', 'maxButton', 'excButton', 'excAvgButton', 'excMinButton', 'excMaxButton', 'percentButton'];
    for (var i = 0; i < allIds.length; i++) {
      var element = document.getElementById(allIds[i]);
      element!.style.opacity = '0.2';
    }

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









