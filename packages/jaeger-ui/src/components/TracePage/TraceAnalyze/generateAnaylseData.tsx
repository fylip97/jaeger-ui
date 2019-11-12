import { Trace } from '../../../types/trace';
import { NPlusOneRule } from './Rules/nPlusOneRule';
import { TimeOperationRule } from './Rules/timeOperationRule';
import { PercentageDeviation } from './Rules/percentageDeviation';
import { LongDatabasecall } from './Rules/longDatabasecall';
import { PercentST } from './Rules/percentST';


/**
 * Is used to add all the rules that are to be taken into account.
 */
function generateAnalyseData(trace: Trace) {

    var nPlusOneRule = new NPlusOneRule(trace);
    var timeOperationRule = new TimeOperationRule(trace);
    var percentageDeviation = new PercentageDeviation(trace);
    var longDatabasecall = new LongDatabasecall(trace);
    var percentST = new PercentST(trace);
    var analyzeFunction = new Array();

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
export function startAnalyse(trace: Trace) {

    var output = new Array();
    var outputTemp = generateAnalyseData(trace);

    for (var i = 0; i < outputTemp.length; i++) {
        if (outputTemp[i].checkRule) {
            var ruleObject = { id: "", name: "", information: "" };
            ruleObject.id = outputTemp[i].id;
            ruleObject.name = outputTemp[i].name;
            ruleObject.information = outputTemp[i].information;
            output.push(ruleObject);
        }
    }
    return output;
}
