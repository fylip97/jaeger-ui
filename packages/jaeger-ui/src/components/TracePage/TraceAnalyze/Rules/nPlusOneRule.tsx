import { Trace } from '../../../../types/trace';

/**
 * 
 */
export class NPlusOneRule {

    /**
     * Used to return the rule information. 
     */
    ruleInformation() {
        var info = "N+1Rule"
        return info;
    }

    /**
     * Used to check the rule
     * @param trace 
     */
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

    /**
     * 
     * @param trace 
     */
    getInformation(trace: Trace) {
        var information = "";
        var calls = "";

        var resultInformation = new Array();
        var callInformation = new Array();

        const NUMBER_OF_CALLS_THRESHOLD = 9;
        var allSpans = trace.spans;
        var count = 1;
        var sqlCheck = "";

        for (var i = 0; i < allSpans.length; i++) {
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                if (allSpans[i].tags[j].key === "sql") {
                    if (sqlCheck !== allSpans[i].tags[j].value) {
                        if (count > NUMBER_OF_CALLS_THRESHOLD) {
                            resultInformation.push(sqlCheck);
                            callInformation.push(count);
                        }
                        sqlCheck = allSpans[i].tags[j].value
                        count = 1;
                    } else {
                        ++count;
                    }
                }
            }
        }
        if (count > NUMBER_OF_CALLS_THRESHOLD) {
            resultInformation.push(sqlCheck);
            callInformation.push(count);
        }
        if (resultInformation.length > 0) {
            for (var i = 0; i < resultInformation.length; i++) {
                if (information === "") {
                    information = resultInformation[i];
                } else {
                    information = information + "#" + resultInformation[i];
                }
                if (calls === "") {
                    calls = callInformation[i];
                } else {
                    calls = calls + "#" + callInformation[i]
                }
            }
        }
        var result = information+"§"+calls;
        return result;
    }


}   