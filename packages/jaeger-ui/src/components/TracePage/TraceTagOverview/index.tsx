// Copyright (c) 2018 The Jaeger Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import './index.css';
import { Trace } from '../../../types/trace';
import { TableOverviewHeaderTag } from './TableOverviewHeadTag';
import { MainTableData } from './MainTableData';
import { DetailTableData } from './DetailTableData';
import DropDown from './Dropdown';
import { TableSpan } from './types';
import { sortTable } from './sortTable';
import { generateColor } from './generateColor';
import { TNil } from '../../../types';
import PopupSQL from './PopupSQL';
import * as _ from 'lodash';
import { generateDropdownValue } from './generateDropdownValue';
import { generateSecondDropdownValue } from './generateDropdownValue';

type Props = {
  trace: Trace;
  uiFindVertexKeys: Set<string> | TNil;
  uiFind: string | null | undefined;
};

type State = {
  tableValue: TableSpan[];
  sortIndex: number;
  sortAsc: boolean;
  isSelected: boolean;
  showPopup: boolean;
  popupContent: string;
  colorButton: boolean;
  wholeTable: TableSpan[];
  dropdownTestTitle1: string;
  dropdowntestTitle2: string;
};

const others = 'Others';
const noItemSelected = 'No Item selected';

const columnsArray: any[] = [
  {
    title: 'Name',
    attribute: 'name',
    suffix: '',
    isDecimal: false,
  },
  {
    title: 'Count',
    attribute: 'count',
    suffix: '',
    isDecimal: false,
  },
  {
    title: 'Total',
    attribute: 'total',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'Avg',
    attribute: 'avg',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'Min',
    attribute: 'min',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'Max',
    attribute: 'max',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'Total ST',
    attribute: 'self',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'ST Avg',
    attribute: 'selfAvg',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'ST Min',
    attribute: 'selfMin',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'ST Max',
    attribute: 'selfMax',
    suffix: 'ms',
    isDecimal: true,
  },
  {
    title: 'ST in Duration',
    attribute: 'percent',
    suffix: '%',
    isDecimal: true,
  },
];

/**
 * Trace Tag Overview Component
 */
export default class TraceTagOverview extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      tableValue: [],
      sortIndex: 1,
      sortAsc: false,
      isSelected: false,
      showPopup: false,
      popupContent: '',
      colorButton: false,
      wholeTable: [],
      dropdownTestTitle1: 'Service Name',
      dropdowntestTitle2: noItemSelected,
    };

    this.handler = this.handler.bind(this);
    this.sortClick = this.sortClick.bind(this);
    this.changeIsSelected = this.changeIsSelected.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleColorButton = this.toggleColorButton.bind(this);
    this.clickColumn = this.clickColumn.bind(this);
    this.setDropDownTitle = this.setDropDownTitle.bind(this);
    this.setDropDownTitle2 = this.setDropDownTitle2.bind(this);

    this.searchInTable(this.props.uiFindVertexKeys!, this.state.tableValue, this.props.uiFind);
  }

  /**
   * Change the sortButton an calls the sort function.
   * @param index the index of the clicked column
   */
  sortClick(index: number) {
    const { tableValue, sortIndex, sortAsc } = this.state;
    if (sortIndex != index) {
      this.setState({
        sortIndex: index,
        sortAsc: false,
        tableValue: this.sortTableWithOthers(tableValue, index, false),
      });
    } else {
      this.setState({
        sortAsc: !sortAsc,
        tableValue: this.sortTableWithOthers(tableValue, index, !sortAsc),
      });
    }
  }

  /**
   * Is called from the child to change the state of the parent.
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
      tableValue: this.searchInTable(
        this.props.uiFindVertexKeys!,
        this.sortTableWithOthers(tableValue, 1, false),
        this.props.uiFind
      ),
      wholeTable: tableValue,
    });
  }

  /**
   * Searches for the others of the share and sorts afterwards.
   */
  sortTableWithOthers(tableValue: TableSpan[], sortIndex: number, sortAsc: boolean) {
    var rememberIndexNoDetail = -1;
    var rememberIndex = -1;
    var othersInDetail = false;
    var sortArray = new Array();
    var sortArray2 = new Array();

    for (var i = 0; i < tableValue.length; i++) {
      if (tableValue[i].name !== others) {
        sortArray.push(tableValue[i]);
      } else {
        if (!tableValue[i].isDetail) {
          rememberIndexNoDetail = i;
        } else {
          othersInDetail = true;
        }
      }
    }
    sortArray = sortTable(sortArray, columnsArray[sortIndex].attribute, sortAsc);
    if (rememberIndexNoDetail != -1) {
      sortArray.push(tableValue[rememberIndexNoDetail]);
    }

    if (!othersInDetail) {
      return sortArray;
    } else {
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
          if (parentElements[i].name === tableValue[j].parentElement && tableValue[j].name !== others) {
            tempArray.push(tableValue[j]);
          } else if (
            parentElements[i].name === tableValue[j].parentElement &&
            tableValue[j].name === others
          ) {
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
      return sortArray2;
    }
  }

  changeIsSelected() {
    this.setState({
      isSelected: true,
    });
  }

  setDropDownTitle(title: string) {
    this.setState({
      dropdownTestTitle1: title,
      dropdowntestTitle2: noItemSelected,
    });
  }

  setDropDownTitle2(title: string) {
    this.setState({
      dropdowntestTitle2: title,
      colorButton: false,
    });
  }

  /**
   * Opern the popup button.
   * @param popupContent
   */
  togglePopup(popupContent: string) {
    this.setState({
      showPopup: !this.state.showPopup,
      popupContent: popupContent,
    });
  }

  /**
   * Colors the last line by percent.
   */
  toggleColorButton() {
    if (this.state.dropdowntestTitle2 !== noItemSelected) {
      generateColor(this.state.tableValue, !this.state.colorButton);
      this.setState({
        tableValue: this.state.tableValue,
        colorButton: !this.state.colorButton,
      });
    }
  }

  /**
   * If the search props change the search function is called.
   * @param props all props
   */
  componentDidUpdate(props: any, prevState: State) {
    if (this.props.uiFindVertexKeys !== props.uiFindVertexKeys) {
      this.searchInTable(this.props.uiFindVertexKeys!, this.state.tableValue, this.props.uiFind);
      // reload the componente
      this.setState({
        tableValue: this.state.tableValue,
      });
    }
  }

  /**
   * Hides the child at the first click.
   */
  clickColumn(selectedSpan: string) {
    if (this.state.dropdowntestTitle2 !== noItemSelected) {
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
            newTable.push(actualTable[i]);
            for (var j = 0; j < this.state.wholeTable.length; j++) {
              if (this.state.wholeTable[j].parentElement === selectedSpan) {
                newTable.push(this.state.wholeTable[j]);
              }
            }
          }
        }
        generateColor(
          this.sortTableWithOthers(newTable, this.state.sortIndex, this.state.sortAsc),
          this.state.colorButton
        );
        newTable = this.searchInTable(this.props.uiFindVertexKeys!, newTable, this.props.uiFind);
        newTable = this.sortTableWithOthers(newTable, this.state.sortIndex, this.state.sortAsc);
      }
      this.setState({
        tableValue: newTable,
      });
    }
  }

  /**
   * Colors found entries in the table.
   * @param uiFindVertexKeys Set of found spans
   * @param allTableSpans entries that are shown
   */
  searchInTable(
    uiFindVertexKeys: Set<string>,
    allTableSpans: TableSpan[],
    uiFind: string | null | undefined
  ) {
    const yellowSearchCollor = 'rgb(255,243,215)';
    const defaultGrayCollor = 'rgb(248,248,248)';
    for (var i = 0; i < allTableSpans.length; i++) {
      if (!allTableSpans[i].isDetail && allTableSpans[i].name !== others) {
        allTableSpans[i].searchColor = 'transparent';
      } else if (allTableSpans[i].name !== others) {
        allTableSpans[i].searchColor = defaultGrayCollor;
      } else {
        allTableSpans[i].searchColor = defaultGrayCollor;
      }
    }
    if (typeof uiFindVertexKeys !== 'undefined') {
      uiFindVertexKeys!.forEach(function(value) {
        var uiFindVertexKeysSplit = value.split('');

        for (var i = 0; i < allTableSpans.length; i++) {
          if (uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(allTableSpans[i].name) != -1) {
            if (allTableSpans[i].parentElement === 'none') {
              allTableSpans[i].searchColor = yellowSearchCollor;
            } else if (
              uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(
                allTableSpans[i].parentElement
              ) != -1
            ) {
              allTableSpans[i].searchColor = yellowSearchCollor;
            }
          }
        }
      });
    }
    if (uiFind) {
      for (var i = 0; i < allTableSpans.length; i++) {
        if (allTableSpans[i].name.indexOf(uiFind!) != -1) {
          allTableSpans[i].searchColor = yellowSearchCollor;

          for (var j = 0; j < allTableSpans.length; j++) {
            if (allTableSpans[j].parentElement === allTableSpans[i].name) {
              allTableSpans[j].searchColor = yellowSearchCollor;
            }
          }
          if (allTableSpans[i].isDetail) {
            for (var j = 0; j < allTableSpans.length; j++) {
              if (allTableSpans[i].parentElement === allTableSpans[j].name) {
                allTableSpans[j].searchColor = yellowSearchCollor;
              }
            }
          }
        }
      }
    }
    return allTableSpans;
  }

  renderTableData() {
    return this.state.tableValue.map((oneSpan, index) => {
      const {
        name,
        count,
        total,
        avg,
        min,
        max,
        self,
        selfAvg,
        selfMin,
        selfMax,
        percent,
        color,
        searchColor,
        colorToPercent,
      } = oneSpan;
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
            dropdownTestTitle1={this.state.dropdownTestTitle1}
            dropdowntestTitle2={this.state.dropdowntestTitle2}
            color={color}
            clickColumn={this.clickColumn}
          />
        );
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
            secondTagDropdownTitle={this.state.dropdowntestTitle2}
            colorToPercent={colorToPercent}
          />
        );
      }
    });
  }

  renderTableHead() {
    var { sortAsc, sortIndex } = this.state;
    return (
      <tr>
        {columnsArray.map((element: any, index: number) => (
          <TableOverviewHeaderTag
            element={element}
            key={element.title}
            sortIndex={sortIndex}
            index={index}
            sortClick={this.sortClick}
            sortAsc={sortAsc}
          />
        ))}
      </tr>
    );
  }

  render() {
    var values = generateDropdownValue(this.props.trace);
    var values2 = generateSecondDropdownValue(
      this.state.tableValue,
      this.props.trace,
      this.state.dropdownTestTitle1
    );
    return (
      <div>
        <h3 id="title"> Trace Overview</h3>
        <DropDown
          position={1}
          tableValue={this.state.tableValue}
          trace={this.props.trace}
          content={values}
          setDropDownTitle={this.setDropDownTitle}
          title={this.state.dropdownTestTitle1}
          firstDropdownTitle={this.state.dropdownTestTitle1}
          handler={this.handler}
        />
        <DropDown
          position={2}
          tableValue={this.state.tableValue}
          trace={this.props.trace}
          content={values2}
          setDropDownTitle={this.setDropDownTitle2}
          title={this.state.dropdowntestTitle2}
          firstDropdownTitle={this.state.dropdownTestTitle1}
          handler={this.handler}
        />
        <button
          style={this.state.colorButton ? { color: 'red' } : { color: 'rgba(0, 0, 0, 0.65)' }}
          onClick={this.toggleColorButton}
          className="ButtonColor"
        >
          {' '}
          color
        </button>

        {this.state.showPopup ? (
          <PopupSQL closePopup={this.togglePopup} popupContent={this.state.popupContent} />
        ) : null}
        <table>
          <tbody id="DetailTraceTableTbody">
            {this.renderTableHead()}
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    );
  }
}
