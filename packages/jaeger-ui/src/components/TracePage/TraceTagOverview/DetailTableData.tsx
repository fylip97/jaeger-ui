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
import './DetailTableData.css';

/**
 * Used to render the detail column.
 */
export const DetailTableData = (props: any) => {
  const styleOption1 = {
    background: 'rgb(248,248,248)',
    color: 'rgb(153,153,153)',
    fontStyle: 'italic',
  };

  const styleOption2 = {
    background: props.colorToPercent,
    borderColor: props.colorToPercent,
  };

  const styleOption3 = {
    background: props.searchColor,
    borderColor: props.searchColor,
  };

  const others = 'Others';

  const styleCondition =
    props.name === others
      ? styleOption1
      : props.searchColor === 'rgb(248,248,248)'
      ? styleOption2
      : styleOption3;
  const onClickOption =
    props.secondTagDropdownTitle === 'sql' && props.name !== others
      ? () => props.togglePopup(props.name)
      : undefined;

  return (
    <tr className="DetailTableData--tr" style={styleCondition}>
      <td className="DetailTableData--child--td" onClick={onClickOption}>
        <label
          title={props.name}
          className="DetailTableData--serviceBorder"
          style={{ borderColor: props.color }}
        >
          {props.name}
        </label>
      </td>
      {props.values.map(
        (value: any, index: number, content1: any, content2: any) => (
          (content1 = props.columnsArray[index + 1].isDecimal ? Number(value).toFixed(2) : value),
          (content2 = props.columnsArray[index + 1].suffix),
          (
            <td key={index} className="DetailTableData--td">
              {content1}
              {content2}
            </td>
          )
        )
      )}
    </tr>
  );
};
