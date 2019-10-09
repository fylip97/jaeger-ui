import { Trace } from '../../../types/trace';
import { NPlusOneRule } from './Rules/nPlusOneRule';
import {TimeOperationRule} from './Rules/timeOperationRule';
import {PercentageDeviation} from './Rules/percentageDeviation';
import {LongDatabasecall} from './Rules/longDatabasecall';

export function generateAnalyseData(trace: Trace) {

    var nPlusOneRule = new NPlusOneRule();
    var timeOperationRule = new TimeOperationRule();
    var percentageDeviation = new PercentageDeviation();
    var longDatabasecall = new LongDatabasecall()

    var analyzeFunction = new Array();
    analyzeFunction.push(nPlusOneRule);
    analyzeFunction.push(timeOperationRule);
    analyzeFunction.push(percentageDeviation);
    analyzeFunction.push(longDatabasecall);

    
    return analyzeFunction;
}
