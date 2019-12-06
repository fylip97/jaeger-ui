import { Trace } from '../../../../../types/trace';
import { calculateContent } from '../../../TraceTagOverview/tableValues';

/**
 * Used to check the time operation rule.
 */
export class TimeOperationRule {

    name = "time operation rule";
    id = "timeOperationRule"
    checkRule = false;
    information = "";

    constructor(trace: Trace) {
        this.getInformation(trace);
    }

    /**
     * Checks the rule and returns information.
     */
    getInformation(trace: Trace) {
        var TIME_THRESHOLD = 55000;
        var allSpans = trace.spans;
        for (var i = 0; i < allSpans.length; i++) {
            var resultArray = {
                name: allSpans[i].spanID,
                count: 0,
                total: 0,
                min: allSpans[i].duration,
                max: 0,
                self: 0,
                selfMin: allSpans[i].duration,
                selfMax: 0,
                selfAvg: 0,
                percent: 0
            };
            resultArray = calculateContent(allSpans[i], allSpans, resultArray);
            if (resultArray.self > TIME_THRESHOLD) {
                this.checkRule= true;
                this.information = this.information+allSpans[i].spanID+"#"+Math.round((resultArray.self / 1000) * 100) / 100+",";
                
            }
        }
    }
}