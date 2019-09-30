import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { generateAnalyseData } from './generateAnaylzeData';


type Props = {
    trace: Trace,
}
type State = {
    output: string
}

export default class TraceAnalyse extends Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            output: "",
        }
        this.startAnalyse = this.startAnalyse.bind(this);
    }

    startAnalyse() {
        this.setState({
            output: generateAnalyseData(this.props.trace),
        });
    }

    render() {
        return (
            <div>
                <h3 id="title">
                    Trace Analyze
                </h3>
                <div id="search">
                    <button id="analyseButton" onClick={this.startAnalyse}>
                        Start Analyze
                </button>
                </div>
                <div>
                    <textarea readOnly id="textarea" value={this.state.output} >
                    </textarea>
                </div>
            </div>
        )
    }
}