import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import './TagDropdown.css';
import { Trace } from '../../../types/trace';
import { getColumnValues } from './tableValues';
import { TableSpan } from './types'
import _ from 'lodash';

type Props = {
    trace: Trace,
    handler: (tableSpan: TableSpan[]) => void;
    changeIsSelected: () => void;
    setTagDropdownTitle: (title: string) => void;
    setSecondDropdownTitle: (title: string) => void;
}

type State = {
    displayMenu: boolean,
    title: string[],
    titleTag: string,
}

/**
 * Used to render the first Dropdown.
 */
export default class TagDropdown extends Component<Props, State>{
    constructor(props: any) {
        super(props);

        var content = this.getValue(this.props.trace);
        this.state = {
            displayMenu: false,
            title: content,
            titleTag: "Service Name",
        };

        this.props.handler(getColumnValues("Service Name", this.props.trace));
        this.props.changeIsSelected();
        this.props.setTagDropdownTitle("Service Name")
        this.props.setSecondDropdownTitle("No item selected");
        this.tagIsClicked = this.tagIsClicked.bind(this);
    };

    /**
     * Called when item was clicked from dropdown.
     * @param title this item was clicked 
     */
    tagIsClicked(title: string) {
        this.setState({
            titleTag: title,
        })
        this.props.handler(getColumnValues(title, this.props.trace));
        this.props.changeIsSelected();
        this.props.setTagDropdownTitle(title)
        this.props.setSecondDropdownTitle("No item selected");
    }

    /**
    * Returns the value of the dropdown.
    * @param trace all informations about the trace.
    */
    getValue(trace: Trace) {

        const allSpans = trace.spans;
        const tags = _(allSpans).map("tags").flatten().value();
        const tagKeys = _(tags).map("key").uniq().value(); 
        const values = _.concat("Service Name", "Operation Name", tagKeys); 
        return values;
    }

    render() {
        const menu = (<Menu>
            {this.state.title.map((title: any, index: number, menuTitle: any) => (
                menuTitle = title !== "Service Name" && title !== "Operation Name" ? "Tag: " + title : title,
                <Menu.Item key={title}>
                    <a onClick={() => this.tagIsClicked(title)} role="button">{menuTitle}</a>
                </Menu.Item>
            ))}
        </Menu>)
        const buttonTitleTag =this.state.titleTag !== "Service Name" && this.state.titleTag !== "Operation Name" ? "Tag: " + this.state.titleTag : this.state.titleTag;
        return (
            <div className="tagDropdown1">
                <Dropdown overlay={menu} >
                    <Button>{buttonTitleTag} <Icon type={'down'} /></Button>
                </Dropdown>
            </div>
        );
    }
}
