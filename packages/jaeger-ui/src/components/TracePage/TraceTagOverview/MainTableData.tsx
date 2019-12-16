// Copyright (c) 2018 The Jaeger Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import './MainTableData.css';

/**
 * Used to render the main column.
 */
export const MainTableData = (props: any) => {
  const trOption1 = {
    background: props.searchColor,
    borderColor: props.searchColor,
    cursor: 'pointer',
  };

  const trOption2 = {
    background: props.searchColor,
    borderColor: props.searchColor,
  };

  const labelOption1 = {
    borderColor: props.color,
    color: 'rgb(153,153,153)',
    fontStyle: 'italic',
  };

  const labelOption2 = {
    borderColor: props.color,
  };

  const others = 'Others';
  const noItemSelected = 'No Item selected';

  const trStyle = props.dropdowntestTitle2 !== noItemSelected ? trOption1 : trOption2;
  const onClickOption =
    props.dropdownTestTitle1 === 'sql' && props.name !== others
      ? () => props.togglePopup(props.name)
      : undefined;
  const labelStyle = props.name === others ? labelOption1 : labelOption2;
  return (
    <tr className="MainTableData--tr" onClick={() => props.clickColumn(props.name)} style={trStyle}>
      <td className="MainTableData--td" onClick={onClickOption}>
        <label title={props.name} className="MainTableData--labelBorder" style={labelStyle}>
          {props.name}
        </label>
      </td>
      {props.values.map(
        (value: any, index: number, content1: any, content2: any) => (
          (content1 = props.columnsArray[index + 1].isDecimal ? value.toFixed(2) : value),
          (content2 = props.columnsArray[index + 1].suffix),
          (
            <td key={index} className="MainTableData--td">
              {' '}
              {content1}
              {content2}
            </td>
          )
        )
      )}
    </tr>
  );
};
