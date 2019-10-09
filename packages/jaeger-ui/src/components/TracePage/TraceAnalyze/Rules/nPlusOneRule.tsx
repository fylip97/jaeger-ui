import { Trace } from '../../../../types/trace';

export class NPlusOneRule {

    ruleInformation() {
        var info = { name: "nPlusOneRule" }
        return info;
    }

    checkRule(trace: Trace) {
        var NUMBER_OF_CALLS_THRESHOLD = 9;
        var allSpans = trace.spans;
        var count = 1;
        var sqlCheck = "";
        for (var i = 0; i < allSpans.length; i++) {
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                if (allSpans[i].tags[j].key === "sql") {
                    if (sqlCheck !== allSpans[i].tags[j].value) {
                        sqlCheck = allSpans[i].tags[j].value;
                        count = 1;
                    } else {
                        ++count;
                    }
                }
            }
        }
        if (count > NUMBER_OF_CALLS_THRESHOLD) {
            return true;
        }
        return false;
    }

}