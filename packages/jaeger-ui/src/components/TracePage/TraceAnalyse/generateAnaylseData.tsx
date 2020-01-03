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

import * as _ from 'lodash';
import { Trace } from '../../../types/trace';
import NPlusOneRule from './Rules/nPlusOneRule/nPlusOneRule';
import TimeOperationRule from './Rules/TimeOperationRule/timeOperationRule';
import PercentageDeviation from './Rules/PercentageDeviation/percentageDeviation';
import LongDatabasecall from './Rules/LongDatabasecall/longDatabasecall';
import PercentST from './Rules/PercentST/percentST';

/**
 * Is used to add all the rules that are to be taken into account.
 */
function generateAnalyseData(trace: Trace) {
  const nPlusOneRule = new NPlusOneRule(trace);
  const timeOperationRule = new TimeOperationRule(trace);
  const percentageDeviation = new PercentageDeviation(trace);
  const longDatabasecall = new LongDatabasecall(trace);
  const percentST = new PercentST(trace);
  const analyzeFunction = [];

  analyzeFunction.push(nPlusOneRule);
  analyzeFunction.push(timeOperationRule);
  analyzeFunction.push(percentageDeviation);
  analyzeFunction.push(longDatabasecall);
  analyzeFunction.push(percentST);

  return analyzeFunction;
}

/**
 * Starts the analysis.
 */
export default function startAnalyse(trace: Trace) {
  const output = [];
  const outputTemp = generateAnalyseData(trace);

  for (let i = 0; i < outputTemp.length; i++) {
    if (outputTemp[i].checkRule) {
      const ruleObject = {
        id: outputTemp[i].id,
        uid: _.uniqueId('id'),
        name: outputTemp[i].name,
        information: outputTemp[i].information,
      };
      output.push(ruleObject);
    }
  }
  return output;
}
