import { Trace } from '../../../../types/trace';
import { calculateContent } from '../../TraceTagOverview/tableValues';


/**
 * Used to check the percentage deviation.
 */
export class PercentageDeviation {

    name = "percentage deviation rule";
    id = "percentageDeviation"
    checkRule = false;
    information = "";

    constructor(trace: Trace) {
        this.getInformation(trace);
    }
    /**
     * Checks the rule and returns information.
     */
    getInformation(trace: Trace) {
        const PERCENTAGE_DEVIATION_THRESHOLD = 90;
        var allSpans = trace.spans;
        var totalSelf = 0;
        var calculatedSpan = new Array();
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
            }
            resultArray = calculateContent(allSpans[i], allSpans, resultArray);
            calculatedSpan.push(resultArray);
            totalSelf = totalSelf + resultArray.self;
        }
        for (var i = 0; i < calculatedSpan.length; i++) {
            var percentageDeviation = ((calculatedSpan[i].self - (totalSelf / allSpans.length)) / calculatedSpan[i].self) * 100;
            if (percentageDeviation > PERCENTAGE_DEVIATION_THRESHOLD) {
                this.checkRule = true;
                this.information = this.information+allSpans[i].spanID +"#"+(Math.round((percentageDeviation/1)*100)/100)+",";
            }
        }
    }

}