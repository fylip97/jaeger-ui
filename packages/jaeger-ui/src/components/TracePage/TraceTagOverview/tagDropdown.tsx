import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import './tagDropdown.css';
import { Trace } from '../../../types/trace';
import { getValue } from './dropDownValue';
import { getColumnValues } from './tableValues';
import { TableSpan } from './types'

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

export default class TagDropdown extends Component<Props, State>{
    constructor(props: any) {
        super(props);

        var content = getValue(this.props.trace);
        this.state = {
            displayMenu: false,
            title: content,
            titleTag: "No item selected",
        };
        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
        this.tagIsClicked = this.tagIsClicked.bind(this);
    };
    /**
     * show the dropdown menu 
     * @param event 
     */
    showDropdownMenu(event: any) {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
    }
    /**
     * hide the dropdown
     */
    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });
    }
    /**
     * called when item was clicked from dropdown
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

    render() {
        const menu = (<Menu>
            {this.state.title.map((title: any, index: number) => (
                <Menu.Item key={title}>
                    <a onClick={() => this.tagIsClicked(title)} role="button">{title}</a>
                </Menu.Item>
            ))}
        </Menu>)
        return (
            <div className="dropdown">
                <Dropdown overlay={menu} >
                    <Button> {this.state.titleTag} <Icon type={'down'} /></Button>
                </Dropdown>
            </div>
        );
    }
}
