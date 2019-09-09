import React, { Component } from 'react';
import './index.css';
import TagDropdown from './tagDropdown'
import { Trace } from '../../../types/trace';
import { TableOverviewHeader } from '../DetailTraceTable/tableOverviewHead';
import { MainTableData } from '../DetailTraceTable/mainTableData';
import { TableSpan } from './types'

type Props = {
  trace: Trace,
};

type State = {
  tableValue: TableSpan[];

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
  },
  {
    "title": "Avg",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Min",
    "suffix": "ms",
    "isDecimal": true
  },
  {
    "title": "Max",
    "suffix": "ms",
    "isDecimal": true
  }
];



export default class TraceTagOverview extends Component<Props, State>{

  constructor(props: any) {
    super(props);

    var firstInputA = Array();
    var firstInput = { name: "", count: 0, total: 0, avg: 0, min: 0, max: 0 }
    firstInputA.push(firstInput)
    this.state={
      tableValue: firstInputA,
    }

    this.handler = this.handler.bind(this);
  }

  sortClick() {

  }



  handler(tableValue: TableSpan[]){

    this.setState({
      tableValue: tableValue
    })
  }


  renderTableData(){

    return this.state.tableValue.map((oneSpan, index) =>{

      const { name, count, total, avg, min, max} = oneSpan
      const values: any[] = [name, count, total, avg, min, max];
      
      return(
      <MainTableData
            key={index}
            oneSpan={oneSpan}
            searchColor={'transparent'}
            values={values}
            index={index}
            columnsArray={columnsArray}
            clickColumn={this.sortClick} />
      )
    })
  }




  renderTableHead() {
    var sortAsc = false;
    var sortIndex = 1;

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
        handler={this.handler} />
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