import React, { Component } from 'react';
import './ListObject.css';

type Props = {
    spanId: string,
    self: number
}

/**
 * Content of the list.
 */
export default class ListObject extends Component<Props> {

    render() {
        return (
            <tr className="tr--ListObject">
                <th className="name--ListObject">
                    <p>{this.props.spanId}</p>
                </th>
                <th className= "self--ListObject">
                    <p>{(Math.round((this.props.self / 1000) * 100) / 100)}ms</p>
                </th>
            </tr>
        )
    }
}