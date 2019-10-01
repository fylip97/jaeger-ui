import { Trace } from '../../../types/trace';
import { calculateContent } from '../TraceTagOverview/tableValues';


export function generateAnalyseData(trace: Trace) {
    var resultString = "";
    var analyzeFunction = new Array();
    analyzeFunction.push({ string: "n+1 Rule: ", function: nPlusOneRule });
    analyzeFunction.push({ string: "\ntimeWastingOperationsRule: ", function: timeWastingOperationsRule });
    analyzeFunction.push({ string: "\npercentage Deviation: ", function: percentageDeviation });
    analyzeFunction.push({ string: "\nlong databasecall Rule: ", function: longDatabaseCall })
    for (var i = 0; i < analyzeFunction.length; i++) {
        resultString = resultString + analyzeFunction[i].string + analyzeFunction[i].function(trace);
    }
    return resultString;
}

/**
 * returns true if n plus one Rule is true
 * @param trace whole trace
 */
function nPlusOneRule(trace: Trace) {
    var NUMBER_OF_CALLS_THRESHOLD = 10;
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
 * returns true if selfDuration is higher than 80%
 * @param trace whole trace
 */
function timeWastingOperationsRule(trace: Trace) {
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
/**
 * returns true if percentage Deviation is higher than 70%
 * @param trace whole trace
 */
function percentageDeviation(trace: Trace) {
    var PERCENTAGE_DEVIATION_THRESHOLD = 70;
    var allSpans = trace.spans;
    var totalSelf = 0;
    var calculatedSpan = new Array();
    for (var i = 0; i < allSpans.length; i++) {
        var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 }
        resultArray = calculateContent(allSpans[i], allSpans, resultArray);
        calculatedSpan.push(resultArray);
        totalSelf = totalSelf + resultArray.self;
    }
    for (var i = 0; i < calculatedSpan.length; i++) {
        var percentageDeviation = ((calculatedSpan[i].self - (totalSelf / allSpans.length)) / calculatedSpan[i].self) * 100;
        if (percentageDeviation > PERCENTAGE_DEVIATION_THRESHOLD) {
            return true;
        }
    }
    return false;
}

/**
 * returns true if databasecall is longer than 120ms
 * @param trace whole trace
 */
function longDatabaseCall(trace: Trace) {
    var DATABASE_DURATION_THRESHOLD = 120;
    var allSpans = trace.spans;
    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            if (allSpans[i].tags[j].key === "sql") {
                var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 }
                resultArray = calculateContent(allSpans[i], allSpans, resultArray);
                if ((Math.round((resultArray.self / 1000) * 100) / 100) > DATABASE_DURATION_THRESHOLD) {
                    return true;
                }
            }
        }
    }
    return false;
}

