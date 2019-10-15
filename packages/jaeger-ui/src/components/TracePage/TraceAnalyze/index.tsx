import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import readJsonFile from '../../../utils/readJsonFile'
import './index.css';
import { startAnalyse } from './generateAnaylzeData';
import { RuleBox } from './ruleBox';
import prefixUrl from '../../../utils/prefix-url';


type Props = {
    trace: Trace,
}
type State = {
    output: any[],
    traceJSON: string,
}

export default class TraceAnalyse extends Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            output: startAnalyse(this.props.trace),
           // output: [],
            traceJSON: "",
        }
        console.log(startAnalyse(this.props.trace));
        console.log("Hello world");
    }
/*
    componentDidMount() {

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
                console.log("Error")
            });

        //JSON.stringify({tracJSON})
    }

    getTraceAnalyse() {

        fetch(prefixUrl(`http://localhost:8084/getAnalyseInformation`))
            .then(res => res.json())
            .then(
                (result) => {
                    var allRules = new Array();
                    for(var i =0; i<result.length; i++){
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

*/
    renderRuleBox() {
        return (this.state.output.map((oneRule, index) => {
            return (
                <RuleBox key={"ruleBox" + index} name={oneRule.name}
                    information={oneRule.information}
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
                {this.state.output.length > 0 ? <div className="frameRule">
                    {this.renderRuleBox()}
                </div> : <div className="noProblemRuleBox">No Problem found </div>}

            </div>
        );
    }
}