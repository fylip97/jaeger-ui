import { Trace } from '../../../types/trace';
import {calculateContent} from '../TraceTagOverview/tableValues';

export function generateAnalyseData(trace: Trace) {

    findProblem(trace);
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

}


function getMethodInformation(trace: Trace){

    var allSpans = trace.spans;
    var resultArray = { name: "",self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };
    var allInformations = new Array();
    for(var i=0; i<allSpans.length;i++){
        resultArray.name = allSpans[i].spanID;
        allInformations.push(calculateContent(allSpans[i],allSpans, resultArray));
    } 


}


function findProblem(trace: Trace){

    getDatabaseInformation(trace);
    getMethodInformation(trace);


}



function buildString(){

    
}