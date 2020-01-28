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
 * Used to check the percentage deviation.
 */
export default class PercentageDeviation {
  name = 'percentage deviation rule';
  id = 'percentageDeviation';
  checkRule = false;
  information = '';

  constructor(trace: Trace) {
    this.getInformation(trace);
  }

  /**
   * Checks the rule and returns information.
   */
  getInformation(trace: Trace) {
    const PERCENTAGE_DEVIATION_THRESHOLD = 90;
    const allSpans = trace.spans;
    let totalSelf = 0;
    const calculatedSpan = [];
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
      calculatedSpan.push(resultArray);
      totalSelf += resultArray.self;
    }
    for (let i = 0; i < calculatedSpan.length; i++) {
      const percentageDeviation =
        ((calculatedSpan[i].self - totalSelf / allSpans.length) / calculatedSpan[i].self) * 100;
      if (percentageDeviation > PERCENTAGE_DEVIATION_THRESHOLD) {
        this.checkRule = true;
        this.information = `
          ${this.information} 
          ${allSpans[i].spanID} #
          ${Math.round((percentageDeviation / 1) * 100) / 100}
          , `;
      }
    }
  }
}
