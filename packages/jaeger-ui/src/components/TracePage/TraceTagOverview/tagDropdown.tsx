import React, { Component } from 'react';
import { Icon } from 'antd';
import './tagDropdown.css';
import { Trace } from '../../../types/trace';
import {getValue, getColumnValues} from './dropDownValue';
import { TableSpan } from './types'



type Props = {
    trace: Trace,
    handler: (tableSpan: TableSpan[]) => void;

}

type State = {
    displayMenu: boolean,
    title: string[],
    titleTag:string,

}


export default class TagDropdown extends Component<Props, State>{
    constructor(props: any) {
        super(props);

        var test= getValue(this.props.trace);
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

        this.props.handler(getColumnValues(title,this.props.trace));

    }

    render() {
        return (
            <div className="dropdown" >
                <div><label id="dropDownLabel" onClick={this.showDropdownMenu}>{this.state.titleTag}</label> <button id="buttonDropDown" onClick={this.showDropdownMenu}><Icon type={this.state.displayMenu ? 'up' : 'down'} /></button></div>
                {this.state.displayMenu ? (
                    <ul>
                        {this.state.title.map((title: any) => (
                            <li key={title}><label onClick={() => this.tagIsClicked(title)}>{title}</label></li>

                        ))}
                    </ul>
                ) :
                    (
                        null
                    )
                }
            </div>

        );
    }
}
