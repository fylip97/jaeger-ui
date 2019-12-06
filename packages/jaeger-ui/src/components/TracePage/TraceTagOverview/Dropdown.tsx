import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import './Dropdown.css';
import { Trace } from '../../../types/trace';
import { getColumnValues, getColumnValuesSecondDropdown } from './tableValues';
import { TableSpan } from './types'

type Props = {
    position: number,
    trace: Trace,
    tableValue: TableSpan[],
    content: string[],
    setDropDownTitle: (title: string) => void;
    title: string,
    firstDropdownTitle: string
    handler: (tableSpan: TableSpan[]) => void;
}

type State = {
    displayMenu: boolean,
    title: string,
}

const serviceName = "Service Name";
const operationName = "Operation Name";
const noItemSelected = "No Item selected";

/**
 * Used to build the Dropdown.
 */
export default class DropDown extends Component<Props, State>{

    constructor(props: any) {
        super(props)

        this.state = {
            displayMenu: false,
            title: noItemSelected,
        }
        if (this.props.position == 1) {
            this.props.handler(getColumnValues(serviceName, this.props.trace));
        }
    }

    /**
     * Is called if a tag is clicked.
     * @param title name of the clicked tag
     */
    tagIsClicked(title: string) {
        this.setState({
            title: title,
        })
        this.props.setDropDownTitle(title);
        if (this.props.position == 1) {
            this.props.handler(getColumnValues(title, this.props.trace));
        } else {
            this.props.handler(getColumnValuesSecondDropdown(this.props.tableValue, this.props.firstDropdownTitle, title, this.props.trace));
        }
    }

    render() {
        const menu = (<Menu>
            {this.props.content.map((title: any, index: number, menuTitle: any) => (
                menuTitle = title !== serviceName && title !== operationName ? "Tag: " + title : title,
                <Menu.Item key={title}>
                    <a onClick={() => this.tagIsClicked(title)} role="button">{menuTitle}</a>
                </Menu.Item>
            ))}
        </Menu>)
        const buttonTitleTag = this.props.title !== serviceName && this.props.title !== operationName && this.props.title !== noItemSelected ? "Tag: " + this.props.title : this.props.title;
        return (
            <div className="DropDown">
                <Dropdown overlay={menu} >
                    <Button>{buttonTitleTag} <Icon type={'down'} /></Button>
                </Dropdown>
            </div>
        );
    }
}