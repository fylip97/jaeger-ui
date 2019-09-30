import { Trace } from '../../../types/trace';
import { calculateContent } from '../TraceTagOverview/tableValues';


export function generateAnalyseData(trace: Trace) {
    var resultString = "";
    var analyzeFunction = new Array();
    analyzeFunction.push({ string: "n+1 Rule: ", function: nPlusOneRule });
    analyzeFunction.push({ string: "\ntimeWastingOperationsRule: ", function: timeWastingOperationsRule });
    analyzeFunction.push({ string: "\npercentage Deviation: ", function: percentageDeviation });
    analyzeFunction.push({ string: "\nlong databasecall rule: ", function: longDatabaseCall })
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
    if (count > 9) {
        return true;
    } else {
        return false;
    }
}
/**
 * returns true if selfDuration is higher than 80%
 * @param trace whole trace
 */
function timeWastingOperationsRule(trace: Trace) {
    var duration = trace.duration;
    var allSpans = trace.spans;
    for (var i = 0; i < allSpans.length; i++) {
        var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 };
        resultArray = calculateContent(allSpans[i], allSpans, resultArray);
        var percent = resultArray.self / (duration / 100);
        if (percent > 80) {
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
    var allSpans = trace.spans;
    var totalSelf = 0;
    var allInfos = new Array();
    for (var i = 0; i < allSpans.length; i++) {
        var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 }
        resultArray = calculateContent(allSpans[i], allSpans, resultArray);
        allInfos.push(resultArray);
        totalSelf = totalSelf + resultArray.self;
    }
    for (var i = 0; i < allInfos.length; i++) {
        var percentageDeviation = ((allInfos[i].self - (totalSelf / allSpans.length)) / allInfos[i].self) * 100;
        if (percentageDeviation > 70) {
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
    var allSpans = trace.spans;
    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            if (allSpans[i].tags[j].key === "sql") {
                var resultArray = { name: allSpans[i].spanID, count: 0, total: 0, min: allSpans[i].duration, max: 0, self: 0, selfMin: allSpans[i].duration, selfMax: 0, selfAvg: 0, percent: 0 }
                resultArray = calculateContent(allSpans[i], allSpans, resultArray);
                if ((Math.round((resultArray.self / 1000) * 100) / 100) > 120) {
                    return true;
                }
            }
        }
    }
    return false;
}

