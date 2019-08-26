// Copyright (c) 2018 Uber Technologies, Inc.
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

import * as React from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { trackAltViewOpen } from './TracePageHeader.track';
import prefixUrl from '../../../utils/prefix-url';

type Props = {
  onTraceGraphViewClicked: (index: number) => void;
  traceGraphView: boolean;
  traceID: string;
  selectedTraceGraphView: number;
};

export default function AltViewOptions(props: Props) {
  const { onTraceGraphViewClicked, traceGraphView, traceID, selectedTraceGraphView, } = props;

  var diffTraceGraphView = [1, 2, 3];

  var possibTraceGraphView = new Array();
  for (var i = 0; i < diffTraceGraphView.length; i++) {
    if (diffTraceGraphView[i] != selectedTraceGraphView) {
      possibTraceGraphView.push(diffTraceGraphView[i]);
    }
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => onTraceGraphViewClicked(possibTraceGraphView[0])} role="button">
          {possibTraceGraphView[0] == 1 ? 'Trace Timeline' : possibTraceGraphView[0] == 2 ? 'Trace Graph' : 'Trace Overview'}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => onTraceGraphViewClicked(possibTraceGraphView[1])} role="button">
          {possibTraceGraphView[1] == 1 ? 'Trace Timeline' : possibTraceGraphView[1] == 2 ? 'Trace Graph' :  'Trace Overview' }
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => onTraceGraphViewClicked(possibTraceGraphView[2])} role="button">
          {possibTraceGraphView[2] == 1 ? 'Trace Timeline' : possibTraceGraphView[2] == 2 ? 'Trace Graph' : 'Trace Overview'}
        </a>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={prefixUrl(`/api/traces/${traceID}?prettyPrint=true`)}
          rel="noopener noreferrer"
          target="_blank"
          onClick={trackAltViewOpen}
        >
          Trace JSON
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={prefixUrl(`/api/traces/${traceID}?raw=true&prettyPrint=true`)}
          rel="noopener noreferrer"
          target="_blank"
          onClick={trackAltViewOpen}
        >
          Trace JSON (unadjusted)
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button className="ub-mr2" htmlType="button" onClick={() => onTraceGraphViewClicked(0)}>
        {selectedTraceGraphView == 1 ? 'Trace Timeline' : selectedTraceGraphView == 2 ? 'Trace Graph' :  ' Trace Overview'} <Icon type="down" />
      </Button>
    </Dropdown>
  );
}
