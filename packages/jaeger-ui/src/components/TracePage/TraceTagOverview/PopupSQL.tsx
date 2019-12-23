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
import { Button } from 'antd';
import './PopupSQL.css';

type Props = {
  closePopup: (popupContent: string) => void;
  popupContent: string;
};

/**
 * Render the popup that is needed for sql.
 */
export default class PopupSQL extends Component<Props> {
  render() {
    const value = '"' + this.props.popupContent + '"';
    return (
      <div className="PopupSQL">
        <div className="PopupSQL--inner">
          <h3 className="PopupSQL--header">Tag: "SQL" </h3>
          <textarea readOnly className="PopupSQL--sqlContent" value={value} />
          <Button className="PopupSQL--closeButton" onClick={() => this.props.closePopup('')}>
            close{' '}
          </Button>
        </div>
      </div>
    );
  }
}
