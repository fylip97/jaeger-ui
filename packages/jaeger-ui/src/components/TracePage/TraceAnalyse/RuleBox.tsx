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

import React from 'react';
import * as diffRuleComponents from './Rules/index';
import './RuleBox.css';

/**
 * Used to define the basic structure of the rule box.
 */
export default function(props: any) {
  return (
    <div className="RuleBox--mainBox" style={props.index % 2 ? { float: 'right' } : { float: 'left' }}>
      <h1 className="RuleBox--nameRuleBox">{props.name}</h1>
      <hr />
      {(diffRuleComponents as any)[props.id](props.information)}
    </div>
  );
}
