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

import * as _ from 'lodash';
import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { calculateContent } from '../TraceTagOverview/tableValues';
import { sortByKey } from '../TraceTagOverview/sortTable';
import ListObject from './ListObject';
import './ListTopST.css';

type Props = {
  trace: Trace;
  jumpIsClicked: (spanID: string) => void;
};

type State = {
  topTen: any;
};

export default class ListTopST extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      topTen: this.calcTopTen(),
    };
  }

  /**
   * Used to get the top ten of the spans with the longest self time.
   */
  calcTopTen() {
    const allSpans = this.props.trace.spans;
    let temp = [];
    const allCalcSpans = [];

    for (let i = 0; i < allSpans.length; i++) {
      const resultArray = {
        uid: _.uniqueId('id'),
        count: 0,
        total: 0,
        min: this.props.trace.duration,
        max: 0,
        selfMin: this.props.trace.duration,
        selfMax: 0,
        self: 0,
        percent: 0,
        operationName: allSpans[i].operationName,
        spanID: allSpans[i].spanID,
      };
      allCalcSpans.push(calculateContent(allSpans[i], allSpans, resultArray));
    }
    temp = sortByKey(allCalcSpans, 'self', false);
    const sortedSpans = [];
    for (let i = 0; i < temp.length; i++) {
      if (i < 10) {
        sortedSpans.push(temp[i]);
      }
    }
    return sortedSpans;
  }

  render() {
    return (
      <div>
        <h3 className="title--table">Spans with longest Self Time</h3>
        <table className="table--table">
          <tbody>
            <tr className="header--tr--table">
              <th className="name--th--table">Name</th>
              <th className="self--th--table">Self Time (ms)</th>
            </tr>
            {this.state.topTen.map((value: any) => (
              <ListObject
                spanID={value.spanID}
                operationName={value.operationName}
                self={value.self}
                key={`${value.uid} + table`}
                jumpIsClicked={this.props.jumpIsClicked}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
