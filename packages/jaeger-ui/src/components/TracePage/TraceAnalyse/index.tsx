import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import './index.css';
import { generateAnalyseData } from './generateAnaylseData';


type Props = {
    trace: Trace,
}


export default class TraceAnalyse extends Component<Props>{

    constructor(props: any) {
        super(props);

        this.startAnalyse = this.startAnalyse.bind(this);
    }


    startAnalyse() {
        generateAnalyseData(this.props.trace);
    }

    render() {

        return (
            <div>
                <h3 id="title">
                    Trace Analyse
                </h3>
                <button id="analyseButton" onClick={this.startAnalyse}>
                    Start Analyze
                </button>

            <div>
            <textarea>
                    
            </textarea>

            </div>
               
            </div>
        )
    }


}