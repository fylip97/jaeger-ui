import React, { Component } from 'react';

import { Span, Trace } from '../../../types/trace';
import { TableSpan } from './types'


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

    // find spans with diff operationName
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

    for (var i = 0; i < allSpansDiffOpName.length; i++) {

      var exc = 0;
      var excAvg = 0;
      var excMin = allSpans[0].duration;
      var excMax = 0;
      //avg && min && max
      var total = 0;
      var avg = 0;
      var min = allSpans[0].duration;
      var max = 0;
      var count = 0;
      var durationCount = 0;
      for (var j = 0; j < allSpans.length; j++) {
        if (allSpansDiffOpName[i] === allSpans[j].operationName) {
          count += 1;
          total += allSpans[j].duration;
          if (min > allSpans[j].duration) {
            min = allSpans[j].duration;
          }
          if (max < allSpans[j].duration) {
            max = allSpans[j].duration;
          }

          //Für jeden Span mit gleichem operationName 
          //Hab ich Kinder?

          if (allSpans[j].hasChildren) {
            var sumAllChildInSpan = 0;
            // wenn ich kinder habe dann suche meine Kinder
            for (var l = 0; l < allSpans.length; l++) {
              //bin ich ein Kind?
              if (allSpans[l].references.length == 1) {
                //bin ich kind von diesem span?
                if (allSpans[j].spanID == allSpans[l].references[0].spanID) {

                  sumAllChildInSpan = sumAllChildInSpan + allSpans[l].duration
                }
              }
            }
            if (excMin > (allSpans[j].duration - sumAllChildInSpan)) {
              excMin = allSpans[j].duration - sumAllChildInSpan;
            }
            if (excMax < (allSpans[j].duration - sumAllChildInSpan)) {
              excMax = allSpans[j].duration - sumAllChildInSpan;
            }
            exc = exc + allSpans[j].duration - sumAllChildInSpan;

          } else {
            if (excMin > (allSpans[j].duration)) {
              excMin = allSpans[j].duration;
            }
            if (excMax < allSpans[j].duration) {
              excMax = allSpans[j].duration;
            }
            exc = exc + allSpans[j].duration;
          }
        }

      }

      excAvg = (exc / count);
      avg = total / count;

      var tableSpan = {
        name: allSpansDiffOpName[i], count: count, total: Math.round((total / 1000) * 100) / 100,
        avg: Math.round((avg / 1000) * 100) / 100, min: Math.round((min / 1000) * 100) / 100,
        max: Math.round((max / 1000) * 100) / 100, isDetail: false, key: allSpansDiffOpName[i], child: false, parentElement: "none", exc: exc / 1000,
        excAvg: Math.round((excAvg / 1000) * 100) / 100, excMin: Math.round((excMin / 1000) * 100) / 100, excMax: Math.round((excMax / 1000) * 100) / 100
      };

      allSpansTrace.push(tableSpan);
    }

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


    // wurde schon gecklickt?
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

      for (var i = 0; i < diffServiceName.length; i++) {
        var total = 0;
        var count = 0;
        var avg = 0;
        var min = sameOperationName[0].duration;
        var max = 0;
        for (var j = 0; j < sameOperationName.length; j++) {
          if (diffServiceName[i].process.serviceName === sameOperationName[j].process.serviceName) {
            if (min > sameOperationName[j].duration) {
              min = sameOperationName[j].duration;
            }
            if (max < sameOperationName[j].duration) {
              max = sameOperationName[j].duration;
            }
            total += sameOperationName[j].duration;
            count += 1;
          }
        }
        avg = total / count;

        var safeItem = {
          name: sameOperationName[i].process.serviceName, count: count,
          total: Math.round((total / 1000) * 100) / 100, avg: Math.round((avg / 1000) * 100) / 100, min: Math.round((min / 1000) * 100) / 100,
          max: Math.round((max / 1000) * 100) / 100, isDetail: true, key: sameOperationName[i].operationName + i,
          child: false, parentElement: selectedSpan.name,
        };

        addItemArray.push(safeItem);
      }

      // an welche stelle soll es geaddet werden
      var rememberIndex = 0;

      for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].name === selectedSpan.name) {
          rememberIndex = i;
        }
      }


      // wird geaddet
      for (var i = 0; i < addItemArray.length; i++) {
        allSpans.splice(rememberIndex + 1, 0, addItemArray[i]);
        rememberIndex += 1;
      }

      // wird gelöscht
    } else {
      var tempArray = new Array();
      var nextParantElement = false;
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
      <th id="DetailTraceTableTH" key='count'>Count </th>
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
          <tr id="DetailTraceTableTR" key={key}>
            <td id="DetailTraceTableChildTD">{name}</td>
            <td id="DetailTraceTableChildTD">{count}</td>
            <td id="DetailTraceTableChildTD">{total + "ms"}</td>
            <td id="DetailTraceTableChildTD">{avg + "ms"}</td>
            <td id="DetailTraceTableChildTD">{min + "ms"}</td>
            <td id="DetailTraceTableChildTD">{max + "ms"}</td>
            <td id="DetailTraceTableChildTD">{exc + 'ms'}</td>
            <td id="DetailTraceTableChildTD">{excAvg + 'ms'}</td>
            <td id="DetailTraceTableChildTD">{excMin + 'ms'}</td>
            <td id="DetailTraceTableChildTD">{excMax + 'ms'}</td>
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
