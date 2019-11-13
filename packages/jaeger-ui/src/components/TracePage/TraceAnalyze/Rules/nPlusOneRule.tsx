import { Trace } from '../../../../types/trace';

/**
 * Used to check NPlusOneRule.
 */
export class NPlusOneRule {

    name = "n+1 Rule"
    id = "n+1Rule"
    checkRule = false;
    information = "";

    constructor(trace: Trace) {
        this.getInformation(trace);
    }

    /**
     * Checks the rule and returns information.
     */
    getInformation(trace: Trace) {
        const NUMBER_OF_CALLS_THRESHOLD = 9;
        var allSpans = trace.spans;
        var count = 1;
        var sqlCheck = "";

        for (var i = 0; i < allSpans.length; i++) {
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                if (allSpans[i].tags[j].key === "sql") {
                    if (sqlCheck !== allSpans[i].tags[j].value) {
                        if (count > NUMBER_OF_CALLS_THRESHOLD) {
                            this.checkRule = true;
                            this.information = this.information + count + "#" + sqlCheck + "§";
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
            this.checkRule= true;
            this.information = this.information + count + '#' + sqlCheck + '§';
        }
    }
}  