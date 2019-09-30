import { Trace } from '../../../types/trace';
import { Span } from '../../../types/trace';
import { calculateContent } from '../TraceTagOverview/tableValues';


/**
 * returns the string to be displayed
 * @param trace
 * @param input Min Span Duration in ms 
 */
export function generateAnalyseData(trace: Trace, input: number) {
    if (input != 0) {
        return (getSpansWithInput(trace, input) + "\n" + getWarnings(trace));
    } else {
        return (findProblem(trace) + "\n" + getWarnings(trace));
    }
}

/**
 * return span id if span duration is longer than input
 * @param trace 
 * @param input 
 */
function getSpansWithInput(trace: Trace, input: number) {

    var allSpans = trace.spans;
    var selectedSpans = new Array();
    for (var i = 0; i < allSpans.length; i++) {
        if ((allSpans[i].duration / 1000) > input) {
            selectedSpans.push(allSpans[i])
        }
    }
    var string = "Span IDs: ";
    for (var i = 0; i < selectedSpans.length; i++) {
        string = string + selectedSpans[i].spanID + ",  ";
    }
    return string;
}

/**
 * return count of databasecalls, total duration and duration avg
 * @param trace 
 */
function findProblem(trace: Trace) {

    var string = "";
    var databaseInformation = getDatabaseInformation(trace);
    string = "Databasecalls: " + databaseInformation.databasecalls + ", total Duration: " + databaseInformation.totalDuration + "ms, Duration Avg: " + Math.round((databaseInformation.totalDurationAvg / 1) * 100) / 100 + "ms,";
    var percentageDeviation1 = new Array();
    percentageDeviation1 = percentageDeviation(getSpanInformation(trace));
    if (percentageDeviation1.length > 0) {
        string += "\n";
        for (var i = 0; i < percentageDeviation1.length; i++) {
            string += "\nPercentage Deviation over 45 %: " + percentageDeviation1[i].spanID;
            string += ": " + (Math.round((percentageDeviation1[i].percentageDeviation / 1) * 100) / 100) + "%";
        }
    }
    var spanWithLongestSelfTime = getSpanWithLongestSelfTime(getSpanInformation(trace));
    string += "\nSpan with longest self time. Span ID: "+spanWithLongestSelfTime.selfMaxName+" self time: "+spanWithLongestSelfTime.selfMax;
    return string;
}

function getDatabaseInformation(trace: Trace) {

    var allSpans = trace.spans;
    var allSpansDatabase = new Array();
    var totalDuration = 0;
    var totalDurationAvg = 0;
    var databasecalls = 0;
    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            if (allSpans[i].tags[j].key === "database") {
                allSpansDatabase.push(allSpans[i]);
            }
        }
    }
    databasecalls = allSpansDatabase.length;
    allSpansDatabase.forEach(function (oneSpan) {
        totalDuration += oneSpan.duration;
    })
    totalDurationAvg = totalDuration / databasecalls;
    var databaseInformation = { totalDuration: totalDuration / 1000, totalDurationAvg: totalDurationAvg / 1000, databasecalls: databasecalls };
    return databaseInformation;
}

function getSpanInformation(trace: Trace) {

    var allSpans = trace.spans;
    var resultArray = { name: "", self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };
    var allInformations = new Array();
    for (var i = 0; i < allSpans.length; i++) {
        resultArray = { name: "", self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };
        resultArray.name = allSpans[i].spanID;
        allInformations.push(calculateContent(allSpans[i], allSpans, resultArray));
    }
    return allInformations;
}

/**
 * if the percentage deviation is more than 45, the span id will be returned
 * @param allInformations 
 */
function percentageDeviation(allInformations: any[]) {

    var problemSpam = new Array();
    var totalSelf = 0;
    for (var i = 0; i < allInformations.length; i++) {
        totalSelf += allInformations[i].self;
    }
    var avgSelf = totalSelf / allInformations.length;
    for (var i = 0; i < allInformations.length; i++) {
        var percentageDeviation = (((allInformations[i].self - avgSelf) / allInformations[i].self) * 100);
        if (percentageDeviation > 45) {
            problemSpam.push({ spanID: allInformations[i].name, percentageDeviation });
        }
    }
    return problemSpam;
}

/**
 * returns warnings with span id 
 * @param trace 
 */
function getWarnings(trace: Trace) {
    var allSpans = trace.spans;
    var string = "warnings: "
    var warnings = false;
    for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].warnings.length != 0) {
            warnings = true;
            string += "Spand ID: " + allSpans[i].spanID;
            for (var j = 0; j < allSpans[i].warnings.length; j++) {
                string += " " + allSpans[i].warnings[j] + ","
            }
        }
    }
    if (warnings) {
        return string;
    } else {
        return "";
    }
}


function getSpanWithLongestSelfTime(allInformations: any[]) {
    var selfMax =0;
    var selfMaxName ="";
    for (var i = 0; i < allInformations.length; i++) {
       if(selfMax<allInformations[i].self){
           selfMax= allInformations[i].self;
           selfMaxName= allInformations[i].name;
       }
    }
    var result = {selfMax, selfMaxName};
    return result;
}








