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
}

type State = {
    displayMenu: boolean,
    title: string[],
    titleTag: string,


}


export default class TagDropdown extends Component<Props, State>{
    constructor(props: any) {
        super(props);

        var test = getValue(this.props.trace);
        this.state = {
            displayMenu: false,
            title: test,
            titleTag: "No Item is clicked",
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
        this.tagIsClicked = this.tagIsClicked.bind(this);


    };

    showDropdownMenu(event: any) {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
    }

    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });

    }

    tagIsClicked(title: string) {
        this.setState({
            titleTag: title,

        })
        this.props.handler(getColumnValues(title, this.props.trace));
        this.props.changeIsSelected();
        this.props.setTagDropdownTitle(title);
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
