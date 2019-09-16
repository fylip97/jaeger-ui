import React, { Component } from 'react';
import { Button } from 'antd';
import './popupSQL.css'

type Props = {
    closePopup: (popupContent: string,)=> void ;
    popupContent: string,
    
}
/**
 * render the popup that is needed for sql
 */
export default class PopupSQL extends Component<Props>{

    render(){
        return (
            <div className='popup'>
              <div className='popup_inner'>
                <h3 className="headerPopup">Tag SQL </h3>
                <textarea readOnly  className= "sqlContent" value={"\""+this.props.popupContent+"\""} />
              <Button className= "closeButton" onClick={()=>this.props.closePopup("")}>close </Button>
              </div>
            </div>
          );
    }
}