import { Trace } from '../../../../types/trace';
import { calculateContent } from '../../TraceTagOverview/tableValues';

/**
 * Used to check the percentage self time.
 */
export class PercentST {

    name = "Percent self time rule";
    id = "percentST"
    checkRule = false;
    information = "";

    constructor(trace: Trace) {
        this.getInformation(trace);
    }

    /**
     * Checks the rule and returns information.
     */
    getInformation(trace: Trace) {

        var allSpans = trace.spans;
        var PERCENT_THRESHOLD = 70;
        var affectedSpans = new Array();
        var onePercent = trace.duration / 100;
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
            var resultPercent = resultArray.self / onePercent;
            if (resultPercent > PERCENT_THRESHOLD && allSpans[i].hasChildren) {
                this.checkRule = true;
                affectedSpans.push(allSpans[i].spanID);
                this.information = this.information+allSpans[i].spanID +"#"+resultPercent+','; 
            }
        }

    }
}   