import React, { Component } from 'react';
import colorGenerator from '../../../utils/color-generator';
import { Span } from '../../../types/trace';


/**
 * calculate the content of the row
 * @param span 
 * @param wholeTrace whole information of the trace
 * @param j whitch row is calculated
 * @param resultArray array with all variables who are calclated
 *      0: exc
 *      1: excAvg
 *      2: excMin
 *      3: excMax
 *      4: total
 *      5: avg
 *      6: min
 *      7: max
 *      8: count
 *      9: percent
 * @param onePercent time which corresponds to 1%.
 */
export function calculateContent(span: Span[], wholeTrace: Span[], j: number, resultArray: number[], onePercent: number) {

    resultArray[8] += 1;
    resultArray[4] += span[j].duration;
    if (resultArray[6] > span[j].duration) {
        resultArray[6] = span[j].duration;
    }
    if (resultArray[7] < span[j].duration) {
        resultArray[7] = span[j].duration;
    }
    //For each span with the same operationName 
    //Do I have children?
    if (span[j].hasChildren) {
        var sumAllChildInSpan = 0;
        // if I have children then look for my children
        for (var l = 0; l < wholeTrace.length; l++) {
            //i am a child?
            if (wholeTrace[l].references.length == 1) {
                //i am a child of this span?
                if (span[j].spanID == wholeTrace[l].references[0].spanID) {
                    sumAllChildInSpan = sumAllChildInSpan + wholeTrace[l].duration
                }
            }
        }
        if (resultArray[2] > (span[j].duration - sumAllChildInSpan)) {
            resultArray[2] = span[j].duration - sumAllChildInSpan;
        }
        if (resultArray[3] < (span[j].duration - sumAllChildInSpan)) {
            resultArray[3] = span[j].duration - sumAllChildInSpan;
        }
        resultArray[0] = resultArray[0] + span[j].duration - sumAllChildInSpan;
    } else {
        if (resultArray[2] > (span[j].duration)) {
            resultArray[2] = span[j].duration;
        }
        if (resultArray[3] < span[j].duration) {
            resultArray[3] = span[j].duration;
        }
        resultArray[0] = resultArray[0] + span[j].duration;
    }
    resultArray[9] = resultArray[0] / onePercent;

    return resultArray;
}


export function getDiffServiceName(allSpans: Span[]) {

    var diffServiceNameS = new Set();
    for (var i = 0; i < allSpans.length; i++) {
        diffServiceNameS.add(allSpans[i].process.serviceName);
    }
    // set into array
    var diffServiceNameA = new Array();
    var iterator = diffServiceNameS.values();
    for (var j = 0; j < diffServiceNameS.size; j++) {
        diffServiceNameA.push(iterator.next().value)
    }
    return diffServiceNameA
}

/**
 * returns the content of the table
 * @param allSpans all spans contained in the trace
 * @param diffServiceName list of all diffrent service names
 */

export function getMainContent(allSpans: Span[], diffServiceName: string[]) {

    var allSpansTrace = new Array();
    for (var i = 0; i < diffServiceName.length; i++) {
        var exc = 0;
        var excAvg = 0;
        var excMin = allSpans[0].duration;
        var excMax = 0;
        //avg && min && max
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var count = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;
        var color;
        var resultArray = [exc, excAvg, excMin, excMax, total, avg, min, max, count, percent];

        for (var j = 0; j < allSpans.length; j++) {
            if (allSpans[j].process.serviceName === diffServiceName[i]) {
                resultArray = calculateContent(allSpans, allSpans, j, resultArray, onePecent);
                exc = resultArray[0];
                excMin = resultArray[2];
                excMax = resultArray[3];
                total = resultArray[4];
                min = resultArray[6];
                max = resultArray[7];
                count = resultArray[8];
                percent = resultArray[9];

                color = colorGenerator.getColorByKey(allSpans[j].process.serviceName)
            }
        }

        excAvg = (exc / count);
        avg = total / count;

        var tableSpan = {
            name: diffServiceName[i], count: count, total: 0,
            avg: 0, min: 0,
            max: 0, isDetail: false, key: diffServiceName[i], child: false, parentElement: "none",
            exc: 0,
            excAvg: 0, excMin: 0,
            excMax: 0, percent: 0,
            color: color, seachColor: "transparent"
        };
        allSpansTrace.push(tableSpan);
    }
    return allSpansTrace;
}

/**
 * returns the detail content of the table
 * @param selectedSpan spna who is selected
 * @param diffOperationNames list of the diffrent operation names who are in the selected span 
 * @param allSpans list off all Spans in the trace
 */

export function getDetailContent(selectedSpan: Span[], diffOperationNames: string[], allSpans: Span[]) {

    var detail = new Array();
    for (var i = 0; i < diffOperationNames.length; i++) {

        var exc = 0;
        var excAvg = 0;
        var excMin = allSpans[0].duration;
        var excMax = 0;
        //avg && min && max
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var count = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;
        var resultArray = [exc, excAvg, excMin, excMax, total, avg, min, max, count, percent];

        for (var j = 0; j < selectedSpan.length; j++) {
            if (diffOperationNames[i] === selectedSpan[j].operationName) {

                resultArray = calculateContent(selectedSpan, allSpans, j, resultArray, onePecent);
                exc = resultArray[0];
                excMin = resultArray[2];
                excMax = resultArray[3];
                total = resultArray[4];
                min = resultArray[6];
                max = resultArray[7];
                count = resultArray[8];
                percent = resultArray[9];

            }
        }
        excAvg = (exc / count);
        avg = total / count;
        var tableSpan = {
            name: diffOperationNames[i], count: count, total: (Math.round((total / 1000) * 100) / 100),
            avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
            max: (Math.round((max / 1000) * 100) / 100), isDetail: true, key: diffOperationNames[i], child: false, parentElement: selectedSpan[i].process.serviceName,
            exc: (Math.round((exc / 1000) * 100) / 100),
            excAvg: (Math.round((excAvg / 1000) * 100) / 100), excMin: (Math.round((excMin / 1000) * 100) / 100),
            excMax: (Math.round((excMax / 1000) * 100) / 100), percent: (Math.round((percent / 1) * 100) / 100),
            color: "", seachColor: "transparent"
        };

        detail.push(tableSpan);

    }

    return detail;

}
