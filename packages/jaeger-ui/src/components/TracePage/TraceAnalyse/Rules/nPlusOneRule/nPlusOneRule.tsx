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

import { Trace } from '../../../../../types/trace';

/**
 * Used to check NPlusOneRule.
 */
export default class NPlusOneRule {
  name = 'n+1 Rule';
  id = 'nPlus1Rule';
  checkRule = false;
  information = '';

  constructor(trace: Trace) {
    this.getInformation(trace);
  }

  /**
   * Checks the rule and returns information.
   */
  getInformation(trace: Trace) {
    const NUMBER_OF_CALLS_THRESHOLD = 9;
    const allSpans = trace.spans;
    let count = 1;
    let sqlCheck = '';

    for (let i = 0; i < allSpans.length; i++) {
      for (let j = 0; j < allSpans[i].tags.length; j++) {
        if (allSpans[i].tags[j].key === 'sql') {
          if (sqlCheck !== allSpans[i].tags[j].value) {
            if (count > NUMBER_OF_CALLS_THRESHOLD) {
              this.checkRule = true;
              this.information = `${this.information} ${count} # ${sqlCheck} § `;
            }
            sqlCheck = allSpans[i].tags[j].value;
            count = 1;
          } else {
            ++count;
          }
        }
      }
    }
    if (count > NUMBER_OF_CALLS_THRESHOLD) {
      this.checkRule = true;
      this.information = ` ${this.information} ${count} # ${sqlCheck} § `;
    }
  }
}
