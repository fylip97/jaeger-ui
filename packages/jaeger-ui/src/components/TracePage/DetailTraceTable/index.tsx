import React, { Component } from 'react';

import { Span, Trace } from '../../../types/trace';
import { TableSpan } from './types'
import { getDetailTableContent } from './exclusivtime'
import { fullTableContent } from './exclusivtime'

import './index.css';
import { all } from 'q';



type Props = {
  traceProps: Trace,
};

type State = {
  allSpans: TableSpan[],
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

    }
  }


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

      allSpans[rememberIndex].child = true;

      for (var i = 0; i < wholeTraceSpans.length; i++) {
        if (wholeTraceSpans[i].operationName === selectedSpan.name) {
          sameOperationName.push(wholeTraceSpans[i]);
        }
      }

      for (var i = 0; i < sameOperationName.length; i++) {
        if (diffServiceName.length == 0) {
          diffServiceName.push(sameOperationName[i]);
        } else {
          var remember = false;
          for (var j = 0; j < diffServiceName.length; j++) {
            if (diffServiceName[j].process.serviceName === sameOperationName[i].process.serviceName) {
              remember = true;
            }
          } if (!remember) {
            diffServiceName.push(sameOperationName[i]);
          }
        }
      }

      addItemArray = getDetailTableContent(diffServiceName, sameOperationName, wholeTraceSpans, selectedSpan.name);

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
  }

  renderTableHeader() {
    return (<tr>
      <th id="DetailTraceTableTH" key='name'>Name</th>
      <th id="DetailTraceTableTH" key='count'>Count</th>
      <th id="DetailTraceTableTH" key='total'>Total</th>
      <th id="DetailTraceTableTH" key='avg'>Avg</th>
      <th id="DetailTraceTableTH" key='min'>Min</th>
      <th id="DetailTraceTableTH" key='max'>Max</th>
      <th id="DetailTraceTableTH" key='exc'>Total Exc</th>
      <th id="DetailTraceTableTH" key='excAvg'>Exc. Avg</th>
      <th id="DetailTraceTableTH" key='excMin'>Exc. Min</th>
      <th id="DetailTraceTableTH" key='excMax'>Exc. Max</th>
    </tr>
    );
  }


  renderTableData() {
    return this.state.allSpans.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, isDetail, key, exc, excAvg, excMin, excMax } = oneSpan
      if (!oneSpan.isDetail) {
        return (
          <tr id="DetailTraceTableTR" key={key} onClick={() => this.clickColumn(oneSpan)}>
            <td id="DetailTraceTableTD">{name}</td>
            <td id="DetailTraceTableTD">{count}</td>
            <td id="DetailTraceTableTD">{total + "ms"}</td>
            <td id="DetailTraceTableTD">{avg + "ms"}</td>
            <td id="DetailTraceTableTD">{min + "ms"}</td>
            <td id="DetailTraceTableTD">{max + "ms"}</td>
            <td id="DetailTraceTableTD">{exc + 'ms'}</td>
            <td id="DetailTraceTableTD">{excAvg + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMin + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMax + 'ms'}</td>
          </tr>
        )
      } else {
        return (
          <tr id="DetailTraceTableTR1" key={key}>
            <td id="DetailTraceTableChildTD">{name}</td>
            <td id="DetailTraceTableTD">{count}</td>
            <td id="DetailTraceTableTD">{total + "ms"}</td>
            <td id="DetailTraceTableTD">{avg + "ms"}</td>
            <td id="DetailTraceTableTD">{min + "ms"}</td>
            <td id="DetailTraceTableTD">{max + "ms"}</td>
            <td id="DetailTraceTableTD">{exc + 'ms'}</td>
            <td id="DetailTraceTableTD">{excAvg + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMin + 'ms'}</td>
            <td id="DetailTraceTableTD">{excMax + 'ms'}</td>
          </tr>
        )

      }
    })
  }


  render() {

    return (

      <div id="mainDiv">
        <p id='title'>Trace Detail</p>
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
