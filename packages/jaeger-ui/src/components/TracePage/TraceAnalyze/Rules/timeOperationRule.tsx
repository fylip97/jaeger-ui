import { Trace } from '../../../../types/trace';
import { calculateContent } from '../../TraceTagOverview/tableValues';


export class TimeOperationRule {

    ruleInformation() {
        var info = "timeOperationRule" 
        return info;
    }

    checkRule(trace: Trace) {
        var PERCENT_THRESHOLD = 80;
        var allSpans = trace.spans;
        for (var i = 0; i < allSpans.length; i++) {
            var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 };
            resultArray = calculateContent(allSpans[i], allSpans, resultArray);
            var percent = resultArray.self / (trace.duration / 100);
            if (percent > PERCENT_THRESHOLD) {
                return true;
            }
        }
        return false;
    }

    getInformation(){
        return "";
    }
}