import React, { Component } from 'react';
import './index.css';
import TagDropdown from './tagDropdown'
import SecondDropDown from './secondDropDown'
import { Trace } from '../../../types/trace';
import { TableOverviewHeaderTag } from './tableOverviewHeadTag';
import { MainTableData } from './mainTableData';
import { DetailTableData } from './detailTableData'
import { TableSpan } from './types';
import { sortTable } from '../DetailTraceTable/sortTable';
import { generateColor} from './generateColor';

import PopupSQL from './popupSQL';
import * as _ from 'lodash';
import { Button } from 'antd/lib/radio';
import { color } from 'd3-color';

type Props = {
  trace: Trace,
};

type State = {
  tableValue: TableSpan[],
  sortIndex: number,
  sortAsc: boolean,
  isSelected: boolean,
  tagDropdownTitle: string,
  secondTagDropdownTitle: string,

  showPopup: boolean,
  popupContent: string,

  colorButton: boolean,


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
    "title": "Total ST",
    "attribute": "self",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "ST Avg",
    "attribute": "selfAvg",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "ST Min",
    "attribute": "selfMin",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "ST Max",
    "attribute": "selfMax",
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
    var firstInput = { name: "", count: 0, total: 0, avg: 0, min: 0, max: 0, self: 0, selfAvg: 0, selfMin: 0, selfMax: 0, percent: 0 }
    firstInputA.push(firstInput)
    this.state = {
      tableValue: firstInputA,
      sortIndex: 1,
      sortAsc: false,
      isSelected: false,
      tagDropdownTitle: "",

      showPopup: false,
      secondTagDropdownTitle: "No item selected",
      popupContent: "",

      colorButton: false,

    }

    this.handler = this.handler.bind(this);
    this.sortClick = this.sortClick.bind(this);
    this.changeIsSelected = this.changeIsSelected.bind(this);
    this.setTagDropdownTitle = this.setTagDropdownTitle.bind(this);
    this.setSecondDropdownTitle = this.setSecondDropdownTitle.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleColorButton = this.toggleColorButton.bind(this);
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
        tableValue: this.splitRest(tableValue, index, false),
      });
    } else {
      this.setState({
        sortAsc: !sortAsc,
        tableValue: this.splitRest(tableValue, index, !sortAsc),
      });
    }
  }


  /**
   * is called from the child to change the state of the parent
   * @param tableValue the values of the column
   */
  handler(tableValue: TableSpan[]) {

    const { sortIndex, sortAsc } = this.state;
    this.setState((previousState, currentProps) => {
      return {
        ...previousState,
        tableValue: tableValue,
        sortIndex: 1,
        sortAsc: false,
      };
    });

    this.setState({
      tableValue: this.splitRest(tableValue, 1, false)
    })
  }


  splitRest(tableValue: TableSpan[], sortIndex: number, sortAsc: boolean) {

    var rememberIndex = -1;
    var sortArray = new Array();
    for (var i = 0; i < tableValue.length; i++) {
      if (tableValue[i].name !== 'rest') {
        sortArray.push(tableValue[i]);
      }
      else {
        rememberIndex = i;
      }
    }
    sortArray = sortTable(sortArray, columnsArray[sortIndex].attribute, sortAsc);
    if (rememberIndex != -1) {
      sortArray.push(tableValue[rememberIndex]);
    }
    return sortArray
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
  setSecondDropdownTitle(title: string) {
    this.setState({
      secondTagDropdownTitle: title,
    })
  }

  togglePopup(popupContent: string) {

    this.setState({
      showPopup: !this.state.showPopup,
      popupContent: popupContent,
    })
  }

  toggleColorButton(){

  this.setState({
    tableValue: generateColor(this.state.tableValue, !this.state.colorButton),
    colorButton: !this.state.colorButton,

  })

  }

  renderTableData() {
    return this.state.tableValue.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, self, selfAvg, selfMin, selfMax, percent, color,colorToPercent  } = oneSpan
      const values: any[] = [count, total, avg, min, max, self, selfAvg, selfMin, selfMax, percent];
      const values2: any[] = [count, total, avg, min, max, self, selfAvg, selfMin, selfMax, percent];

      if (!oneSpan.isDetail) {
        return (
          <MainTableData
            key={name + index}
            oneSpan={oneSpan}
            name={oneSpan.name}
            searchColor={"transparent"}
            values={values}
            columnsArray={columnsArray}
            togglePopup={this.togglePopup}
            tagDropdownTitle={this.state.tagDropdownTitle}
            color={color} />
        )
      } else {
        return (
          <DetailTableData
            key={oneSpan.name + index}
            name={oneSpan.name}
            searchColor={"#ECECEC"}
            values2={values2}
            columnsArray={columnsArray}
            color={color}
            togglePopup={this.togglePopup}
            secondTagDropdownTitle={this.state.secondTagDropdownTitle}
            colorToPercent={colorToPercent} />
        )
      }
    })
  }

  renderTableHead() {
    var { sortAsc, sortIndex } = this.state
    return (
      <tr>
        {columnsArray.map((element: any, index: number) => (
          <TableOverviewHeaderTag element={element}
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
          key={'parent'}
          handler={this.handler}
          changeIsSelected={this.changeIsSelected}
          setTagDropdownTitle={this.setTagDropdownTitle}
          setSecondDropdownTitle={this.setSecondDropdownTitle}
        />
        <SecondDropDown trace={this.props.trace}
          key={'child'}
          handler={this.handler}
          isSelected={this.state.isSelected}
          tableValue={this.state.tableValue}
          tagDropdownTitle={this.state.tagDropdownTitle}
          setSecondTagDropdownTitle={this.setSecondDropdownTitle}
          secondTagDropdownTitle={this.state.secondTagDropdownTitle}
        />
        <button style ={this.state.colorButton ?{color: "red"}: {color: "rgba(0, 0, 0, 0.65)"} } onClick={this.toggleColorButton} id="ButtonColor"> color</button>

        {this.state.showPopup ?
          <PopupSQL
            closePopup={this.togglePopup}
            popupContent={this.state.popupContent}
          />
          : null
        }
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