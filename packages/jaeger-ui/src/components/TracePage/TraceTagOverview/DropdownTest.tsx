import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import './TagDropdown.css';
import { Trace } from '../../../types/trace';
import { getColumnValues } from './tableValues';
import { TableSpan } from './types'
import _ from 'lodash';


type Props={
    content: string[],

}


type State={
    displayMenu: boolean,
    title: string,
}
export default class TagDropdown extends Component<Props, State>{


    tagIsClicked(title: string) {
        this.setState({
            title: title,
        })
    }


    render(){
        const menu = (<Menu>
            {this.props.content.map((title: any, index: number, menuTitle: any) => (
                menuTitle = title !== "Service Name" && title !== "Operation Name" ? "Tag: " + title : title,
                <Menu.Item key={title}>
                    <a onClick={() => this.tagIsClicked(title)} role="button">{menuTitle}</a>
                </Menu.Item>
            ))}
        </Menu>)
        const buttonTitleTag =this.state.title !== "Service Name" && this.state.title !== "Operation Name" ? "Tag: " + this.state.title : this.state.title;
        return (
            <div className="tagDropdown1">
                <Dropdown overlay={menu} >
                    <Button>{buttonTitleTag} <Icon type={'down'} /></Button>
                </Dropdown>
            </div>
        );
        
    }

}