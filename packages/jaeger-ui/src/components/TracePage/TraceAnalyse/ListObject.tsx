import React, { Component } from 'react';
import './ListObject.css';
import TraceTimelineViewer from '../TraceTimelineViewer'

type Props = {
    operationName: string,
    self: number,
    jumpIsClicked: ()=> void

}

/**
 * Content of the list.
 */
export default class ListObject extends Component<Props> {

    constructor(props:any){
        super(props);

        this.clickMe = this.clickMe.bind(this);

    }

    render() {
        return (
            <tr className="tr--ListObject" onClick={this.clickMe}>
                <th className="name--ListObject">
                    <p>{this.props.operationName}</p>
                </th>
                <th className= "self--ListObject">
                    <p>{(Math.round((this.props.self / 1000) * 100) / 100)}ms</p>
                </th>
            </tr>
        )
    }

    clickMe(){
      console.log(this.props)
      this.props.jumpIsClicked();

    }
}