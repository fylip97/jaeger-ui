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
import { calculateContent } from '../../../TraceTagOverview/tableValues';

/**
 * Used to check the long databasecall.
 */
export default class LongDatabasecall {
  name = 'Long databasecall';
  id = 'longDatabasecall';
  checkRule = false;
  information = '';

  constructor(trace: Trace) {
    this.getInformation(trace);
  }

  /**
   * Checks the rule and returns information.
   */
  getInformation(trace: Trace) {
    const DATABASE_DURATION_THRESHOLD = 0;
    const allSpans = trace.spans;
    for (let i = 0; i < allSpans.length; i++) {
      for (let j = 0; j < allSpans[i].tags.length; j++) {
        if (allSpans[i].tags[j].key === 'sql') {
          let resultArray = {
            name: allSpans[i].spanID,
            count: 0,
            total: 0,
            min: allSpans[i].duration,
            max: 0,
            self: 0,
            selfMin: allSpans[i].duration,
            selfMax: 0,
            selfAvg: 0,
            percent: 0,
          };
          resultArray = calculateContent(allSpans[i], allSpans, resultArray);
          if (Math.round((resultArray.total / 1000) * 100) / 100 > DATABASE_DURATION_THRESHOLD) {
            this.checkRule = true;
            this.information = `
              ${this.information} ${allSpans[i].spanID} 
              # ${Math.round((resultArray.total / 1000) * 100) / 100}
              , `;
          }
        }
      }
    }
  }
}
