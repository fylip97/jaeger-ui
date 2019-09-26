import React, { Component } from 'react';
import './index.css';
import TagDropdown from './tagDropdown'
import SecondDropDown from './secondDropDown'
import { Trace } from '../../../types/trace';
import { TableOverviewHeaderTag } from './tableOverviewHeadTag';
import { MainTableData } from './mainTableData';
import { DetailTableData } from './detailTableData'
import { TableSpan } from './types';
import { sortTable } from './sortTable';
import { generateColor } from './generateColor';
import { searchInTable } from './searchInTable'
import { TNil } from '../../../types';

import PopupSQL from './popupSQL';
import * as _ from 'lodash';

type Props = {
  trace: Trace,
  uiFindVertexKeys: Set<string> | TNil;
  uiFind: string | null | undefined
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
  wholeTable: TableSpan[];
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
    "title": "ST in Duration",
    "attribute": "percent",
    "suffix": "%",
    "isDecimal": true
  }
];

export default class TraceTagOverview extends Component<Props, State>{

  constructor(props: any) {
    super(props);
    var firstInputA = Array();
    var firstInput = { name: "default", count: 0, total: 0, avg: 0, min: 0, max: 0, self: 0, selfAvg: 0, selfMin: 0, selfMax: 0, percent: 0 }
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
      wholeTable: [],

    }

    this.handler = this.handler.bind(this);
    this.sortClick = this.sortClick.bind(this);
    this.changeIsSelected = this.changeIsSelected.bind(this);
    this.setTagDropdownTitle = this.setTagDropdownTitle.bind(this);
    this.setSecondDropdownTitle = this.setSecondDropdownTitle.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleColorButton = this.toggleColorButton.bind(this);
    this.clickColumn = this.clickColumn.bind(this);

    searchInTable(this.props.uiFindVertexKeys!, this.state.tableValue, this.props.uiFind);
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
      tableValue: searchInTable(this.props.uiFindVertexKeys!, (this.splitRest(tableValue, 1, false)), this.props.uiFind),
      wholeTable: tableValue
    })
  }

  /**
   * searches for the rest of the share and sorts afterwards 
   * @param tableValue 
   * @param sortIndex 
   * @param sortAsc 
   */
  splitRest(tableValue: TableSpan[], sortIndex: number, sortAsc: boolean) {

    var rememberIndexNoDetail = -1;
    var rememberIndex = -1;
    var restInDetail = false;
    var sortArray = new Array();
    var sortArray2 = new Array();

    for (var i = 0; i < tableValue.length; i++) {
      if (tableValue[i].name !== 'rest') {
        sortArray.push(tableValue[i]);
      }
      else {
        if (!tableValue[i].isDetail) {
          rememberIndexNoDetail = i;
        }
        else {
          restInDetail = true;
        }
      }
    }

    sortArray = sortTable(sortArray, columnsArray[sortIndex].attribute, sortAsc);
    if (rememberIndexNoDetail != -1) {
      sortArray.push(tableValue[rememberIndexNoDetail]);
    }

    if (!restInDetail) {
      return sortArray;
    }
    else {
      var parentElements = new Array();
      for (var i = 0; i < tableValue.length; i++) {
        if (!tableValue[i].isDetail) {
          parentElements.push(tableValue[i]);
        }
      }
      parentElements = sortTable(parentElements, columnsArray[sortIndex].attribute, sortAsc);
      for (var i = 0; i < parentElements.length; i++) {
        sortArray2.push(parentElements[i]);
        var tempArray = new Array();
        for (var j = 0; j < tableValue.length; j++) {
          if (parentElements[i].name === tableValue[j].parentElement && tableValue[j].name !== "rest") {
            tempArray.push(tableValue[j]);
          } else if (parentElements[i].name === tableValue[j].parentElement && tableValue[j].name === "rest") {
            rememberIndex = j;
          }
        }
        tempArray = sortTable(tempArray, columnsArray[sortIndex].attribute, sortAsc);
        if (rememberIndex != -1) {
          tempArray.push(tableValue[rememberIndex]);
          rememberIndex = -1;
        }
        for (var j = 0; j < tempArray.length; j++) {
          sortArray2.push(tempArray[j]);
        }
      }
      return sortArray2
    }

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
      colorButton: false,
    })
  }

  /**
   * opern the popup button
   * @param popupContent 
   */
  togglePopup(popupContent: string) {

    this.setState({
      showPopup: !this.state.showPopup,
      popupContent: popupContent,
    })
  }

  /**
   * colors the last line by percent
   */
  toggleColorButton() {

    if (this.state.secondTagDropdownTitle !== "No item selected") {
      this.setState({
        tableValue: generateColor(this.state.tableValue, !this.state.colorButton),
        colorButton: !this.state.colorButton,
      })
    }
  }

  /**
  * if the search props change the search function is called
  * @param props all props 
  */
  componentDidUpdate(props: any, prevState: State) {
    if ((this.props.uiFindVertexKeys !== props.uiFindVertexKeys)) {
      searchInTable(this.props.uiFindVertexKeys!, this.state.tableValue, this.props.uiFind);
      // reload the componente
      this.setState({
        tableValue: this.state.tableValue
      })
    }
  }

  /**
   * hides the child at the first click
   * @param selectedSpan 
   */
  clickColumn(selectedSpan: string) {

    if (this.state.secondTagDropdownTitle !== "No item selected") {
      var add = true;
      var actualTable = this.state.tableValue;
      var newTable = new Array();
      for (var i = 0; i < actualTable.length; i++) {
        if (actualTable[i].parentElement === selectedSpan) {
          add = false;
        }
        if (actualTable[i].parentElement !== selectedSpan) {
          newTable.push(actualTable[i]);
        }
      }
      if (add) {
        newTable = [];
        for (var i = 0; i < actualTable.length; i++) {

          if (actualTable[i].name !== selectedSpan) {
            newTable.push(actualTable[i]);
          } else {
            newTable.push(actualTable[i])
            for (var j = 0; j < this.state.wholeTable.length; j++) {
              if (this.state.wholeTable[j].parentElement === selectedSpan) {
                newTable.push(this.state.wholeTable[j]);
              }
            }
          }
        }
        newTable = searchInTable(this.props.uiFindVertexKeys!, generateColor(this.splitRest(newTable, this.state.sortIndex, this.state.sortAsc), this.state.colorButton), this.props.uiFind);
      }
      this.setState({
        tableValue: newTable,
      });
    }
  }

  renderTableData() {
    return this.state.tableValue.map((oneSpan, index) => {
      const { name, count, total, avg, min, max, self, selfAvg, selfMin, selfMax, percent, color, searchColor, colorToPercent } = oneSpan
      const values: any[] = [count, total, avg, min, max, self, selfAvg, selfMin, selfMax, percent];

      if (!oneSpan.isDetail) {
        return (
          <MainTableData
            key={name + index}
            oneSpan={oneSpan}
            name={oneSpan.name}
            searchColor={searchColor}
            values={values}
            columnsArray={columnsArray}
            togglePopup={this.togglePopup}
            tagDropdownTitle={this.state.tagDropdownTitle}
            color={color}
            clickColumn={this.clickColumn} />
        )
      } else {
        return (
          <DetailTableData
            key={oneSpan.name + index}
            name={oneSpan.name}
            searchColor={searchColor}
            values={values}
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
        <h3 id="title"> Trace Overview</h3>
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
        <button style={this.state.colorButton ? { color: "red" } : { color: "rgba(0, 0, 0, 0.65)" }} onClick={this.toggleColorButton} id="ButtonColor"> color</button>

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