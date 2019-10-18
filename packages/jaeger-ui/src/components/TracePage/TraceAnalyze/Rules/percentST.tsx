import { Trace } from '../../../../types/trace';
import { calculateContent } from '../../TraceTagOverview/tableValues';

export class PercentST {
     

    ruleInformation() {
        var info = "PercentST"
        return info;
    }

    checkRule(trace: Trace) {

        var allSpans = trace.spans;
        var PERCENT_THRESHOLD = 70;

        var onePercent = trace.duration / 100;
        for (var i = 0; i < allSpans.length; i++) {
            var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 }
            resultArray = calculateContent(allSpans[i], allSpans, resultArray);
            var resultPercent = resultArray.self / onePercent;
            if (resultPercent > PERCENT_THRESHOLD && allSpans[i].hasChildren) {
                return true;
            }
        }
        return false;
    }


    getInformation(trace: Trace) {

        var result = "";
        var allSpans = trace.spans;
        var PERCENT_THRESHOLD = 50;
        var affectedSpans = new Array();

        var onePercent = trace.duration / 100;
        for (var i = 0; i < allSpans.length; i++) {
            var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 };
            resultArray = calculateContent(allSpans[i], allSpans, resultArray);
            var resultPercent = resultArray.self / onePercent;
            if (resultPercent > PERCENT_THRESHOLD && allSpans[i].hasChildren) {
                affectedSpans.push(allSpans[i].spanID)
            }
        }
        if (affectedSpans.length > 0) {
            for (var i = 0; i < affectedSpans.length; i++) {
                if (result === "") {
                    result = affectedSpans[i];
                } else {
                    result = result + "#" + affectedSpans[i];
                }
            }
        }
        return result;

    }


}   