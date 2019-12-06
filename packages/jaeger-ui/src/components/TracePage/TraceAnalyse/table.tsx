import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { calculateContent } from '../TraceTagOverview/tableValues';
import { sortByKey } from '../TraceTagOverview/sortTable';
import ListObject from './listObject';
import './table.css'

type Props = {
    trace: Trace;
}

type State = {
    topTen: any
}


export default class Table extends Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            topTen: this.calcTopTen()
        }
    }

    calcTopTen() {
        var allSpans = this.props.trace.spans;
        var temp = new Array();
        var allCalcSpans = new Array();


        for (var i = 0; i < allSpans.length; i++) {
            var resultArray = {
                count: 0,
                total: 0,
                min: this.props.trace.duration,
                max: 0,
                selfMin: this.props.trace.duration,
                selfMax: 0,
                self: 0,
                percent: 0,
                spanId: allSpans[i].spanID,
            }
            allCalcSpans.push(calculateContent(allSpans[i], allSpans, resultArray));
        }
        temp = sortByKey(allCalcSpans, "self",false);
        var sortedSpans = new Array();
        for(var i=0; i<temp.length; i++){
            if(i<=9){
                sortedSpans.push(temp[i])
            }
        }
        return sortedSpans;
    }


    render() {
        return (
            <div>
                <h3 className="title--table">Spans with longest Self Time</h3>
                <table className ="table--table">
                    <tbody>
                        <tr className="header--tr--table">
                            <th className="name--th--table">Name</th>
                            <th className="self--th--table">Self Time (ms)</th>
                        </tr>
                        {this.state.topTen.map((value: any, index: number) => (
                                <ListObject
                                    spanId={value.spanId}
                                    self={value.self}
                                    key= {index+"table"}
                                />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

