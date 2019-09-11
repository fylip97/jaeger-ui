import React, { Component } from 'react';
import './index.css';
import TagDropdown from './tagDropdown'
import SecondDropDown from './secondDropDown'
import { Trace } from '../../../types/trace';
import { TableOverviewHeader } from '../DetailTraceTable/tableOverviewHead';
import { MainTableData } from '../DetailTraceTable/mainTableData';
import { DetailTableData } from '../DetailTraceTable/detailTableData'
import { TableSpan } from './types';
import { sortTable } from '../DetailTraceTable/sortTable';
import * as _ from 'lodash';

type Props = {
  trace: Trace,
};

type State = {
  tableValue: TableSpan[],
  sortIndex: number,
  sortAsc: boolean,
  isSelected: boolean,
  tagDropdownTitle: string,

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

export default class TraceTagOverview extends Component<Props, State>{

  constructor(props: any) {
    super(props);
    var firstInputA = Array();
    var firstInput = { name: "", count: 0, total: 0, avg: 0, min: 0, max: 0, exc: 0, excAvg: 0, excMin: 0, excMax: 0, percent: 0 }
    firstInputA.push(firstInput)
    this.state = {
      tableValue: firstInputA,
      sortIndex: 1,
      sortAsc: false,
      isSelected: false,
      tagDropdownTitle: "",
    }

    this.handler = this.handler.bind(this);
    this.sortClick = this.sortClick.bind(this);
    this.changeIsSelected = this.changeIsSelected.bind(this);
    this.setTagDropdownTitle = this.setTagDropdownTitle.bind(this);

  }

  /**
   * change the sortButton an calls the sort function
   * @param index the index of the clicked column
   */
  sortClick(index: number) {
    const { tableValue, sortIndex, sortAsc } = this.state;
    if (sortIndex != index) {
      this.setState({
        sortIndex: index,
        sortAsc: false,
        tableValue: sortTable(tableValue, columnsArray[index].attribute, false),
      });
    } else {
      this.setState({
        sortAsc: !sortAsc,
        tableValue: sortTable(tableValue, columnsArray[index].attribute, !sortAsc),
      });
    }
  }

  /**
   * 
   */
  noClick() {

  }
  /**
   * is called from the child to change the state of the parent
   * @param tableValue the values of the column
   */
  handler(tableValue: TableSpan[]) {

    this.setState((previousState, currentProps) => {
      return {
        ...previousState,
        tableValue: tableValue,
        sortIndex: 1,
        sortAsc: false,
      };
    });

  }

  changeIsSelected() {
    this.setState({
      isSelected: true,
    })
  }

  setTagDropdownTitle(title: string) {
    this.setState({
      tagDropdownTitle: title,
    })
  }


  componentDidUpdate(prevProps: Props, prevState: State) {

    if (this.state.tableValue.length != prevState.tableValue.length) {

      this.sortClick(1);
    }
  }

  renderTableData() {
    return this.state.tableValue.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, exc, excAvg, excMin, excMax, percent } = oneSpan
      const values: any[] = [name, count, total, avg, min, max, exc, excAvg, excMin, excMax, percent];
      const values2: any[] = [count, total, avg, min, max, exc, excAvg, excMin, excMax, percent];

      if (!oneSpan.isDetail) {
        return (
          <MainTableData
            key={name + index}
            oneSpan={oneSpan}
            searchColor={"transparent"}
            values={values}
            index={index}
            columnsArray={columnsArray}
            clickColumn={this.noClick} />
        )
      } else {
        return (
          <DetailTableData
            key={oneSpan.name + index}
            name={oneSpan.name}
            searchColor={"#ECECEC"}
            values2={values2}
            columnsArray={columnsArray}
            color={"#807F7F"} />
        )
      }
    })
  }

  renderTableHead() {
    var { sortAsc, sortIndex } = this.state
    return (
      <tr>
        {columnsArray.map((element: any, index: number) => (
          <TableOverviewHeader element={element}
            key={element.title}
            sortIndex={sortIndex}
            index={index}
            sortClick={this.sortClick}
            sortAsc={sortAsc} />
        ))}
      </tr>
    )

  }


  render() {
    return (
      <div>
        <h3 id="title"> Trace Tag View</h3>
        <TagDropdown trace={this.props.trace}
          key={'main'}
          handler={this.handler}
          changeIsSelected={this.changeIsSelected}
          setTagDropdownTitle={this.setTagDropdownTitle}
        />
        <SecondDropDown trace={this.props.trace}
          key={'child'}
          handler={this.handler}
          isSelected={this.state.isSelected}
          tableValue={this.state.tableValue}
          tagDropdownTitle={this.state.tagDropdownTitle}
        />
        <table>
          <tbody id="DetailTraceTableTbody">
            {this.renderTableHead()}
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }


}