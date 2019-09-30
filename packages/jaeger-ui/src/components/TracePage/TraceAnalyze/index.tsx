import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { generateAnalyseData } from './generateAnaylzeData';


type Props = {
    trace: Trace,
}
type State = {
    input: number,
    output: string
}

export default class TraceAnalyse extends Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            input: 0,
            output: "",
        }

        this.startAnalyse = this.startAnalyse.bind(this);
    }


    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            input: Number(e.target.value),
        })
    }


    startAnalyse() {
        this.setState({
            output: generateAnalyseData(this.props.trace, this.state.input),
        });
    }

    render() {
        return (
            <div>
                <h3 id="title">
                    Trace Analyse
                </h3>
                <div id="search">
                    <label id="labelSpanDuration" >Min. Span Duration in ms</label>
                    <input id="inputDuration" onChange={this.onChange} type="number" placeholder="Min Duration of Span" />
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