import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { startAnalyse } from './generateAnaylzeData';
import { RuleBox } from './ruleBox';


type Props = {
    trace: Trace,
}
type State = {
    output: any[],
}

export default class TraceAnalyse extends Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            output: startAnalyse(this.props.trace),
        }
    }

    renderRuleBox() {
        return (this.state.output.map((oneRule, index) => {
            return (
                <RuleBox key={"ruleBox" + index} name={oneRule.ruleInformation()}
                    index={index} />
            )
        })
        );
    }

    render() {
        return (
            <div>
                <h3 id="title">
                    Trace Analyze
                </h3>
                <div className = "frameRule">
                  {this.renderRuleBox()}
                </div>
            </div>
        );
    }
}