import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { startAnalyse } from './generateAnaylseData';
import { RuleBox } from './RuleBox';
import prefixUrl from '../../../utils/prefix-url';
import ListTopST from './ListTopST';


type Props = {
    trace: Trace,
    backend: number,
}
type State = {
    output: any[],
    traceJSON: string,
}

export default class TraceAnalyse extends Component<Props, State>{

    constructor(props: any) {
        super(props);

        if (this.props.backend == 0) {
            this.state = {
                output: startAnalyse(this.props.trace),
                traceJSON: "",
            }
        } else {
            this.state = {
                output: [],
                traceJSON: "",
            }
        }
        JSON.stringify(this.props.trace)
    }

    componentDidMount() {

        if (this.props.backend == 1) {
            fetch(prefixUrl(`/api/traces/${this.props.trace.traceID}?raw=true&prettyPrint=true`))
                .then(res => res.json())
                .then(
                    (result) => {
                        this.sendRequest(result);
                        this.setState({
                            traceJSON: JSON.stringify(result),
                        });
                    },
                    (error) => {
                        this.setState({
                            traceJSON: "error"
                        });
                    }
                )
        } else if (this.props.backend == 2) {
            this.sendTrace();
        }
    }

    sendRequest(traceJSON: any) {
        var test = (JSON.stringify(traceJSON))
        fetch('http://localhost:8084/analyseTrace', {
            method: 'post',
            mode: "no-cors",
            headers: { 'Content-Type': 'application/json' },
            body: test

        }).then(
            (result) => {
                this.getTraceAnalyse();
            },
            (error) => {
                console.log(error)
            });
    }

    getTraceAnalyse() {
        fetch(prefixUrl(`http://localhost:8084/getAnalyseInformation`))
            .then(res => res.json())
            .then(
                (result) => {
                    var allRules = new Array();
                    for (var i = 0; i < result.length; i++) {
                        allRules.push(result[i]);
                    }
                    this.setState({
                        output: allRules,
                    });
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    sendTrace() {
        var test = (JSON.stringify(this.props.trace))
        fetch('http://localhost:8084/analyseTraceDiffJS0N', {
            method: 'post',
            mode: "no-cors",
            headers: { 'Content-Type': 'application/json' },
            body: test

        }).then(
            (result) => {
                this.getTraceAnalyse();
            },
            (error) => {
                console.log(error)
            });

    }
    renderRuleBox() {
        return (this.state.output.map((oneRule, index) => {
            return (
                <RuleBox key={"ruleBox" + index}
                    name={oneRule.name}
                    id={oneRule.id}
                    information={oneRule.information}
                    index={index}
                    calls={oneRule.calls} />
            )
        })
        );
    }

    render() {
        return (
            <div>
                <h3 className="title--index">
                    Trace Analyse
                </h3>
                <div>
                    <div className="table--div">
                        <ListTopST
                            trace={this.props.trace}
                        />
                    </div>
                    <div className="rule--div">
                        {this.state.output.length > 0 ? <div className="frameRule">
                            {this.renderRuleBox()}
                        </div> : <div className="noProblemRuleBox">No Problem found </div>}
                    </div>
                </div>
            </div>
        );
    }
}