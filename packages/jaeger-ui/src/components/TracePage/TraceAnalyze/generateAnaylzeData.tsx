import { Trace } from '../../../types/trace';
import { NPlusOneRule } from './Rules/nPlusOneRule';
import {TimeOperationRule} from './Rules/timeOperationRule';
import {PercentageDeviation} from './Rules/percentageDeviation';
import {LongDatabasecall} from './Rules/longDatabasecall';
import {PercentST} from './Rules/percentST';

function generateAnalyseData() {

    var nPlusOneRule = new NPlusOneRule();
    //var timeOperationRule = new TimeOperationRule();
    //var percentageDeviation = new PercentageDeviation();
    // var longDatabasecall = new LongDatabasecall();
    var percentST = new PercentST();

    var analyzeFunction = new Array();
    analyzeFunction.push(nPlusOneRule);
    //analyzeFunction.push(timeOperationRule);
    //analyzeFunction.push(percentageDeviation);
    //analyzeFunction.push(longDatabasecall);
    analyzeFunction.push(percentST);

    return analyzeFunction;
}

export function startAnalyse(trace:Trace) {

    const n1Rule = "N+1Rule";
    const percentST = "PercentST";

    var output = new Array();
    var outputTemp = generateAnalyseData();
    
    for (var i = 0; i < outputTemp.length; i++) {
        if (outputTemp[i].checkRule(trace)) {
            var ruleObject = {name:"", information:"", calls:""};
            ruleObject.name= outputTemp[i].ruleInformation();
            if(ruleObject.name === n1Rule){
                var temp = outputTemp[i].getInformation(trace);
                var diffInformation = new Array();
                diffInformation = temp.split("§");
                ruleObject.information=diffInformation[0];
                ruleObject.calls = diffInformation[1];
            }else if(ruleObject.name === percentST){
                ruleObject.information = outputTemp[i].getInformation(trace);
            }
            else{
                ruleObject.information ="";
            }
            output.push(ruleObject);
        }
    }
    return output;
}
