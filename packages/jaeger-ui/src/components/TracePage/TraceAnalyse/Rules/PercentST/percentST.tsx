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
import { calculateContent } from '../../../TraceStatistics/tableValues';

/**
 * Used to check the percentage self time.
 */
export default class PercentST {
  name = 'Percent ST Rule';
  id = 'percentST';
  checkRule = false;
  information = '';

  constructor(trace: Trace) {
    this.getInformation(trace);
  }

  /**
   * Returns the spanId if the self time is higher then the threshold.
   */
  getInformation(trace: Trace) {
    const allSpans = trace.spans;
    const PERCENT_THRESHOLD = 70;
    const affectedSpans = [];
    const onePercent = trace.duration / 100;
    for (let i = 0; i < allSpans.length; i++) {
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
      resultArray = calculateContent(trace, allSpans[i], allSpans, resultArray);
      const resultPercent = resultArray.self / onePercent;
      if (resultPercent > PERCENT_THRESHOLD && allSpans[i].hasChildren) {
        this.checkRule = true;
        affectedSpans.push(allSpans[i].spanID);
        this.information = `${this.information} ${allSpans[i].spanID} # ${resultPercent} ,`;
      }
    }
  }
}
