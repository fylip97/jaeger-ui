import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { TableSpan } from './types';
import { getDetailTableContent } from './exclusivtime';
import { getDiffServiceName } from './exclusivtime';
import { getMainContent } from './exclusivtime';
import { fullTableContent } from './exclusivtime';
import { sortTable } from './sortTable';
import { TNil } from '../../../types';
import { searchInTable } from './searchInTable';
import './index.css';
import { isNotClicked } from './exclusivtime';
import { TableOverviewHeader } from './tableOverviewHead';
import { DetailTableContent } from './detailTableContent'
import { MainTableContent } from './mainTableContent';
import { getDetailContent } from './exclusivtime';

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

    var allSpans = new Array();
    allSpans = this.props.traceProps.spans;
    var diffServiceName = getDiffServiceName(allSpans)

    this.state = {
      allSpans: getMainContent(allSpans, diffServiceName),
      sortIndex: 0,
      sortAsc: false,
    }
    this.sortClick = this.sortClick.bind(this);
    this.clickColumn2 = this.clickColumn2.bind(this);


  }

  /**
  * when clicking on column
  *  shows the child if the column has not been clicked before
  *  does not show the children any more if the column has been clicked before
  * @param selectedSpan the column who is been clicked
  */
  clickColumn2(selectedSpan: TableSpan) {

    var allSpans = this.props.traceProps.spans;
    var spanServName = new Array();
    var allTableSpans = this.state.allSpans;

    var isClicked;

    // find the index wehre u should add
    var rememberIndex = 0;
    for (var i = 0; i < this.state.allSpans.length; i++) {
      if (selectedSpan.name === this.state.allSpans[i].name) {
        isClicked = allTableSpans[i].child
        rememberIndex = i;

      }
    }

    if (!isClicked) {

      allTableSpans[rememberIndex].child = true;
      for (var i = 0; i < allSpans.length; i++) {

        if (selectedSpan.name === allSpans[i].process.serviceName) {
          spanServName.push(allSpans[i]);
        }
      }

      //find diff operationNames

      var diffOperationNamesS = new Set();
      for (var i = 0; i < spanServName.length; i++) {
        diffOperationNamesS.add(spanServName[i].operationName);
      }

      // set into array
      var diffOperationNamesA = new Array();
      var iterator = diffOperationNamesS.values();
      for (var j = 0; j < diffOperationNamesS.size; j++) {
        diffOperationNamesA.push(iterator.next().value)
      }

      var addItemArray = getDetailContent(spanServName, diffOperationNamesA, allSpans);

      // build the new array
      for (var i = 0; i < addItemArray.length; i++) {

        allTableSpans.splice(rememberIndex + 1, 0, addItemArray[i]);
        rememberIndex += 1;
      }

    } else {
      var tempArray = new Array();
      for (var i = 0; i < allTableSpans.length; i++) {
        if (allTableSpans[i].parentElement !== selectedSpan.name) {
          tempArray.push(allTableSpans[i]);
        }
        allTableSpans[rememberIndex].child = false;
      }
      allTableSpans = [];
      allTableSpans = tempArray;

    }

    this.setState({
      allSpans: allTableSpans,

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
   * decides how to sort
   * @param index is the index of the clicked column
   */
  sortClick(index: number) {
    const { allSpans, sortIndex, sortAsc } = this.state;
    if (sortIndex != index) {
      this.setState({
        sortIndex: index,
        sortAsc: false,
        allSpans: sortTable(allSpans, columnsArray[index].attribute, false),
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
      <tr id="test">
        {columnsArray.map((element: any, index: number) => (
          <TableOverviewHeader element={element}
            key={element.attribute}
            sortIndex={sortIndex}
            index={index}
            sortClick={this.sortClick}
            sortAsc={sortAsc} />
        ))}
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
      const { name, count, total, avg, min, max, key, exc, excAvg, excMin, excMax, percent, color, searchColor } = oneSpan
      const values: any[] = [count, total, avg, min, max, exc, excAvg, excMin, excMax, percent];
      if (!oneSpan.isDetail) {
        return (
          <MainTableContent
            key={key + index + "main"}
            oneSpan={oneSpan}
            name={oneSpan.name}
            searchColor={searchColor}
            values={values}
            index={index}
            columnsArray={columnsArray}
            clickColumn2={this.clickColumn2}
            color={color}
          />
        )
      } else {
        return (
          <DetailTableContent
            key={oneSpan.key + index + "child"}
            name={oneSpan.name}
            searchColor={searchColor}
            values={values}
            columnsArray={columnsArray}
            color={color} />
        )
      }
    })
  }

  render() {
    return (
      <div id="mainDiv">
        <h3 id='title'>Trace Detail</h3>
        <table id="test" >
          <tbody id="DetailTraceTableTbody">
            {this.renderTableHeader()}
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }

}