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

import { ITableSpan } from './types';

/**
 * colors found entries in the table
 * @param uiFindVertexKeys Set of found spans
 * @param allTableSpans entries that are shown
 */
export default function searchInTable(
  uiFindVertexKeys: Set<string>,
  allTableSpans: ITableSpan[],
  uiFind: string | null | undefined
) {
  const allTableSpansChange = allTableSpans;
  for (let i = 0; i < allTableSpansChange.length; i++) {
    if (!allTableSpansChange[i].isDetail && allTableSpansChange[i].name !== 'rest') {
      allTableSpansChange[i].searchColor = 'transparent';
    } else if (allTableSpansChange[i].name !== 'rest') {
      allTableSpansChange[i].searchColor = '#ECECEC';
    } else {
      allTableSpansChange[i].searchColor = 'rgb(197,217,213)';
    }
  }
  if (typeof uiFindVertexKeys !== 'undefined') {
    uiFindVertexKeys!.forEach(function calc(value) {
      const uiFindVertexKeysSplit = value.split('');

      for (let i = 0; i < allTableSpansChange.length; i++) {
        if (
          uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(allTableSpansChange[i].name) !== -1
        ) {
          if (allTableSpansChange[i].parentElement === 'none') {
            allTableSpansChange[i].searchColor = '#FFF3D7';
          } else if (
            uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(
              allTableSpansChange[i].parentElement
            ) !== -1
          ) {
            allTableSpansChange[i].searchColor = '#FFF3D7';
          }
        }
      }
    });
  }
  if (uiFind !== undefined || uiFind !== null) {
    for (let i = 0; i < allTableSpansChange.length; i++) {
      if (allTableSpansChange[i].name.indexOf(uiFind!) !== -1) {
        allTableSpansChange[i].searchColor = '#FFF3D7';

        for (let j = 0; j < allTableSpansChange.length; j++) {
          if (allTableSpansChange[j].parentElement === allTableSpansChange[i].name) {
            allTableSpansChange[j].searchColor = '#FFF3D7';
          }
        }
        if (allTableSpansChange[i].isDetail) {
          for (let j = 0; j < allTableSpansChange.length; j++) {
            if (allTableSpansChange[i].parentElement === allTableSpansChange[j].name) {
              allTableSpansChange[j].searchColor = '#FFF3D7';
            }
          }
        }
      }
    }
  }
  return allTableSpansChange;
}
