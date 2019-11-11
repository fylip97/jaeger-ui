import React, { Component } from 'react';
import { Button } from 'antd';
import './PopupSQL.css'

type Props = {
  closePopup: (popupContent: string, ) => void;
  popupContent: string,
}

/**
 * Render the popup that is needed for sql.
 */
export default class PopupSQL extends Component<Props>{

  render() {
    const value = "\"" + this.props.popupContent + "\"";
    return (
      <div className='PopupSQL'>
        <div className='PopupSQL--inner'>
          <h3 className="PopupSQL--header">Tag: "SQL" </h3>
          <textarea readOnly className="PopupSQL--sqlContent" value={value} />
          <Button className="PopupSQL--closeButton" onClick={() => this.props.closePopup("")}>close </Button>
        </div>
      </div>
    );
  }
}