import { Trace } from '../../../../types/trace';
import { calculateContent } from '../../TraceTagOverview/tableValues';

/*
export const xy = {

    ruleInformation: function() : string {
        var info =  "longDatabasecall"
        return info;
    }

};*/


export class LongDatabasecall {

    ruleInformation() {
        var info = "longDatabasecall"
        return info;
    }

    checkRule(trace: Trace) {
        var DATABASE_DURATION_THRESHOLD = 120;
        var allSpans = trace.spans;
        for (var i = 0; i < allSpans.length; i++) {
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                if (allSpans[i].tags[j].key === "sql") {
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
                    }
                    resultArray = calculateContent(allSpans[i], allSpans, resultArray);
                    if ((Math.round((resultArray.self / 1000) * 100) / 100) > DATABASE_DURATION_THRESHOLD) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getInformation(trace: Trace) {
        return "";
    }
}