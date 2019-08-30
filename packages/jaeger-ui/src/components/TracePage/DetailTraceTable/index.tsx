import React, { Component } from 'react';


import { Span, Trace } from '../../../types/trace';
import { TableSpan } from './types'
import { getDetailTableContent } from './exclusivtime'
import { fullTableContent } from './exclusivtime'


import './index.css';
import { all } from 'q';
import { formatRelativeDate } from '../../../utils/date';
import BreakableText from '../../common/BreakableText';



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
      <th id="DetailTraceTableTH" key='count'>Count <button onClick={() => this.sortClick('count-Up', 'countUp')} id="countUp"> up</button>
        <button onClick={() => this.sortClick('count-Down', 'countDown')} id="countDown">down</button>  </th>
      <th id="DetailTraceTableTH" key='total'>Total<button onClick={() => this.sortClick('total-Up', 'totalUp')} id="totalUp"> up</button>
        <button onClick={() => this.sortClick('total-Down', 'totalDown')} id="totalDown">down</button> </th>
      <th id="DetailTraceTableTH" key='avg'>Avg<button onClick={() => this.sortClick('avg-Up', 'avgUp')} id="avgUp"> up</button>
        <button onClick={() => this.sortClick('avg-Down', 'avgDown')} id="avgDown">down</button> </th>
      <th id="DetailTraceTableTH" key='min'>Min<button onClick={() => this.sortClick('min-Up', 'minUp')} id="minUp"> up</button>
        <button onClick={() => this.sortClick('min-Down', 'minDown')} id="minDown">down</button> </th>
      <th id="DetailTraceTableTH" key='max'>Max<button onClick={() => this.sortClick('max-Up', 'maxUp')} id="maxUp"> up</button>
        <button onClick={() => this.sortClick('max-Down', 'maxDown')} id="maxDown">down</button> </th>
      <th id="DetailTraceTableTH" key='exc'>Total Exc<button onClick={() => this.sortClick('exc', 'totalExcUp')} id="totalExcUp"> up</button>
        <button onClick={() => this.sortClick('exc', 'totalExcDown')} id="totalExcDown">down</button> </th>
      <th id="DetailTraceTableTH" key='excAvg'>Exc. Avg<button onClick={() => this.sortClick('excAvg-Up', 'excAvgUp')} id="excAvgUp"> up</button>
        <button onClick={() => this.sortClick('excAvg-Down', 'excAvgDown')} id="excAvgDown">down</button> </th>
      <th id="DetailTraceTableTH" key='excMin'>Exc. Min<button onClick={() => this.sortClick('excMin-Up', 'excMinUp')} id="excMinUp"> up</button>
        <button onClick={() => this.sortClick('excMin-Down', 'excMinDown')} id="excMinDown">down</button> </th>
      <th id="DetailTraceTableTH" key='excMax'>Exc. Max<button onClick={() => this.sortClick('excMax-Up', 'excMaxUp')} id="excMaxUp"> up</button>
        <button onClick={() => this.sortClick('excMax-Down', 'excMaxDown')} id="excMaxDown">down</button> </th>
    </tr>
    );
  }


  renderTableData() {
    return this.state.allSpans.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, isDetail, key, exc, excAvg, excMin, excMax, color } = oneSpan
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
            <td id="DetailTraceTableChildTD"><label id="serviceBorder" style={{ borderColor: color }}>{name}</label></td>
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




  sortClick(name: string, id: string) {


    this.setAllButtonTransparent();
    var element = document.getElementById(id);
    element!.style.background = "#7CFC00";

    var diffParameter = name.split("-");

    this.setState({
      allSpans: this.sortTable(this.state.allSpans, diffParameter[0], diffParameter[1])
    })

  }


  sortTable(array: TableSpan[], key: string, upDown: string) {
    var isDetailArray = new Array();
    var isNoDetail = new Array();

    for (var i = 0; i < array.length; i++) {
      if (array[i].isDetail == true) {
        isDetailArray.push(array[i]);
      } else {
        isNoDetail.push(array[i]);
      }

    }
    if (upDown === "Up") {
      isNoDetail = this.sortByKeyUp(isNoDetail, key);
    } else {
      isNoDetail = this.sortByKeyDown(isNoDetail, key);
    }

    var diffParentNames = new Array();
    for (var i = 0; i < isDetailArray.length; i++) {
      if (diffParentNames.length == 0) {
        diffParentNames.push(isDetailArray[i]);
      } else {
        var sameName = false;
        for (var j = 0; j < diffParentNames.length; j++) {
          if (diffParentNames[j].parentElement === isDetailArray[i].parentElement) {
            sameName = true;
          }
        }
        if (!sameName) {
          diffParentNames.push(isDetailArray[i]);
        }
      }

    }

    var tempArray = new Array();
    for (var j = 0; j < diffParentNames.length; j++) {
      tempArray = this.groupBy(isDetailArray, diffParentNames[j].parentElement)

      if (upDown === "Up") {
        tempArray = this.sortByKeyUp(tempArray, key);
      } else {
        tempArray = this.sortByKeyDown(tempArray, key);
      }

      if (tempArray.length > 0) {

        // build whole array
        var rememberIndex = 0;
        for (var i = 0; i < isNoDetail.length; i++) {
          if (isNoDetail[i].name === tempArray[0].parentElement) {
            rememberIndex = i;
          }
        }

        for (var i = 0; i < tempArray.length; i++) {
          isNoDetail.splice(rememberIndex + 1, 0, tempArray[i]);
          rememberIndex += 1;
        }
      }
    }

    return isNoDetail;
  }


  groupBy(tempArray: TableSpan[], key: string) {
    var groupedArray = new Array();
    for (var i = 0; i < tempArray.length; i++) {
      if (tempArray[i].parentElement === key) {
        groupedArray.push(tempArray[i]);
      }
    }
    return groupedArray;
  }



  sortByKeyUp(array: TableSpan[], key: string) {

    //sort 
    return array.sort(function (a, b) {
      var x = (a as any)[key]; var y = (b as any)[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  sortByKeyDown(array: TableSpan[], key: string) {
    return array.sort(function (a, b) {
      var x = (a as any)[key]; var y = (b as any)[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }



  setAllButtonTransparent() {

    var allIds = ['countUp', 'countDown', 'totalUp', 'totalDown', 'avgUp', 'avgDown', 'minUp', 'minDown', 'maxUp', 'maxDown', 'totalExcUp', 'totalExcDown',
      'excAvgUp', 'excAvgDown', 'excMinUp', 'excMinDown', 'excMaxUp', 'excMaxDown'];

    for (var i = 0; i < allIds.length; i++) {
      var element = document.getElementById(allIds[i]);
      element!.style.backgroundColor = "transparent";
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









