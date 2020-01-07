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
import { Trace } from '../../../types/trace';
import './index.css';
import startAnalyse from './generateAnaylseData';
import RuleBox from './RuleBox';
import prefixUrl from '../../../utils/prefix-url';
import ListTopST from './ListTopST';

type Props = {
  trace: Trace;
  backend: number;
  jumpIsClicked: (spanID: string) => void;
};
type State = {
  output: any[];
};

export default class TraceAnalyse extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    if (this.props.backend === 0) {
      this.state = {
        output: startAnalyse(this.props.trace),
      };
    } else {
      this.state = {
        output: [],
      };
    }
    JSON.stringify(this.props.trace);
  }

  componentDidMount() {
    if (this.props.backend === 1) {
      fetch(prefixUrl(`/api/traces/${this.props.trace.traceID}?raw=true&prettyPrint=true`))
        .then(res => res.json())
        .then(result => {
          this.sendRequest(result);
        });
    } else if (this.props.backend === 2) {
      this.sendTrace();
    }
  }

  sendRequest = (traceJSON: any) => {
    const json = JSON.stringify(traceJSON);
    fetch('http://localhost:8084/analyseTrace', {
      method: 'post',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    });
  };

  getTraceAnalyse() {
    fetch(prefixUrl(`http://localhost:8084/getAnalyseInformation`))
      .then(res => res.json())
      .then(result => {
        const allRules = [];
        for (let i = 0; i < result.length; i++) {
          allRules.push(result[i]);
        }
        this.setState({
          output: allRules,
        });
      });
  }

  sendTrace() {
    const json = JSON.stringify(this.props.trace);
    fetch('http://localhost:8084/analyseTraceDiffJS0N', {
      method: 'post',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    });
  }

  renderRuleBox() {
    return this.state.output.map((oneRule, index) => {
      return (
        <RuleBox
          key={`ruleBox ${oneRule.uid}`}
          name={oneRule.name}
          id={oneRule.id}
          information={oneRule.information}
          index={index}
          calls={oneRule.calls}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3 className="title--index">Trace Analyse</h3>
        <div>
          <div className="table--div">
            <ListTopST trace={this.props.trace} jumpIsClicked={this.props.jumpIsClicked} />
          </div>
          <div className="rule--div">
            {this.state.output.length > 0 ? (
              <div className="frameRule">{this.renderRuleBox()}</div>
            ) : (
              <div>
                <label className="noProblemRuleBoxLabel">No Problem found</label>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
