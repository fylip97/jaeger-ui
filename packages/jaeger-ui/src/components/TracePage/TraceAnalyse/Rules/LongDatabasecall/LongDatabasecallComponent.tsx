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
import './LongDatabasecallComponent.css';

type Props = {
  information: string;
};

type State = {
  element: any | undefined;
};

/**
 * Used to render TimeOperationRuleComponent.
 */
export default class LongDatabasecallComponent extends Component<Props, State> {
  componentWillMount() {
    const oneColumn = this.props.information.split(',');
    oneColumn.splice(oneColumn.length - 1, 1);

    const element = oneColumn.map((oneInfo: String) => {
      return { uid: _.uniqueId('id'), oneInfo };
    });

    this.setState(prevState => {
      return {
        ...prevState,
        element,
      };
    });
  }

  render() {
    return (
      <table className="LongDatabasecall--Table">
        <tbody>
          {this.state.element.map((element: any) => {
            const value = element.oneInfo.split('#');
            return (
              <tr key={`${element.uid} longDatabasecallSpanID`}>
                <th key={`${element.uid} longDatabasecall`} className="LongDatabasecall--spandIDTH">
                  <label className="LongDatabasecall--label">SpanID: {value[0]}</label>
                </th>
                <th className="LongDatabasecall--durationTH">
                  <textarea
                    key={`${element.uid}  longDatabasecallDuration`}
                    className="LongDatabasecall--durationInformation"
                    readOnly
                    value={`${value[1]}ms`}
                  />
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
