import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { generateAnalyseData } from './generateAnaylzeData';
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
            output: this.startAnalyse(),
        }
        this.startAnalyse = this.startAnalyse.bind(this);

    }

    startAnalyse() {

        var output = new Array();
        var outputTemp = generateAnalyseData(this.props.trace);
        for (var i = 0; i < outputTemp.length; i++) {
            if (outputTemp[i].checkRule(this.props.trace)) {
                output.push(outputTemp[i]);
            }
        }
        console.log(output.length);
        return output;
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