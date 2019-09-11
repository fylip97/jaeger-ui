import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import './tagDropdown.css';
import { Trace } from '../../../types/trace';
import { getValue } from './secondDropDownValue';
import { getColumnValues, getColumnValuesSecondDropdown } from './tableValues';
import { TableSpan } from './types'
import * as _ from 'lodash';




type Props = {
    trace: Trace,
    handler: (tableSpan: TableSpan[]) => void;
    isSelected: boolean,
    tableValue: TableSpan[],
    tagDropdownTitle: string,
}

type State = {
    displayMenu: boolean,
    title: string[],
    titleTag: string,
}


export default class SecondDropDown extends Component<Props, State>{
    constructor(props: any) {
        super(props);

        var list = getValue(this.props.tableValue, this.props.trace, this.props.tagDropdownTitle);
        this.state = {
            displayMenu: false,
            title: list,
            titleTag: "No Item is clicked",
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
        this.tagIsClicked = this.tagIsClicked.bind(this);


    };

    componentDidUpdate = (prevProps: Props) => {

        if (prevProps.tagDropdownTitle !== this.props.tagDropdownTitle) {
            this.setState({
                titleTag: "No Item is selected",
            })
        }

        if (!_.isEqual(this.state.title, getValue(this.props.tableValue, this.props.trace, this.props.tagDropdownTitle))) {
            this.setState({
                title: getValue(this.props.tableValue, this.props.trace, this.props.tagDropdownTitle)
            })
        }
    }

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
        this.props.handler(getColumnValuesSecondDropdown(this.props.tableValue, this.props.tagDropdownTitle, title, this.props.trace));



    }

    render() {

        const menu = (<Menu>
            {this.state.title.map((title: any, index: number) => (
                <Menu.Item key={index}>
                    <a onClick={() => this.tagIsClicked(title)} role="button">{title}</a>
                </Menu.Item>
            ))}
        </Menu>)
        return (
            <div className="dropdown" style={!this.props.isSelected ? { visibility: 'hidden' } : { visibility: 'visible' }}>
                <Dropdown overlay={menu} >
                    <Button> {this.state.titleTag} <Icon type={'down'} /></Button>
                </Dropdown>

            </div>

        );
    }
}
