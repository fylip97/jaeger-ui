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
import './ListObject.css';

type Props = {
  spanID: string;
  operationName: string;
  self: number;
  jumpIsClicked: (spanId: string) => void;
};

/**
 * Content of the list.
 */
export default class ListObject extends Component<Props> {
  constructor(props: any) {
    super(props);

    this.clickIntoList = this.clickIntoList.bind(this);
  }

  /**
   * Changes the view to trace timeline and opens the span.
   */
  clickIntoList(spanID: string) {
    this.props.jumpIsClicked(spanID);
  }

  render() {
    return (
      <tr className="tr--ListObject" onClick={() => this.clickIntoList(this.props.spanID)}>
        <th className="name--ListObject">
          <p>{this.props.operationName}</p>
        </th>
        <th className="self--ListObject">
          <p>{Math.round((this.props.self / 1000) * 100) / 100}ms</p>
        </th>
      </tr>
    );
  }
}
