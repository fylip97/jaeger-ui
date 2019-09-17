import React, { Component } from 'react';
import colorGenerator from '../../../utils/color-generator';
import { Span } from '../../../types/trace';


/**
 * calculate the content of the row
 * @param span 
 * @param wholeTrace whole information of the trace
 * @param j whitch row is calculated
 * @param resultArray array with all variables who are calclated
 *      0: self
 *      1: selfAvg
 *      2: selfMin
 *      3: selfMax
 *      4: total
 *      5: avg
 *      6: min
 *      7: max
 *      8: count
 *      9: percent
 * @param onePercent time which corresponds to 1%.
 */
export function calculateContent(span: Span[], wholeTrace: Span[], j: number, resultArray: any, onePercent: number) {

    resultArray.count += 1;
    resultArray.total += span[j].duration;
    if (resultArray.min > span[j].duration) {
        resultArray.min = span[j].duration;
    }
    if (resultArray.max < span[j].duration) {
        resultArray.max = span[j].duration;
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
        if (resultArray.selfMin > (span[j].duration - sumAllChildInSpan)) {
            resultArray.selfMin = span[j].duration - sumAllChildInSpan;
        }
        if (resultArray.selfMax < (span[j].duration - sumAllChildInSpan)) {
            resultArray.selfMax = span[j].duration - sumAllChildInSpan;
        }
        resultArray.self = resultArray.self + span[j].duration - sumAllChildInSpan;
    } else {
        if (resultArray.selfMin > (span[j].duration)) {
            resultArray.selfMin = span[j].duration;
        }
        if (resultArray.selfMax < span[j].duration) {
            resultArray.selfMax = span[j].duration;
        }
        resultArray.self = resultArray.self + span[j].duration;
    }
    resultArray.percent = resultArray.self / onePercent;

    return resultArray;
}

/**
 * return all diffrent service name 
 * @param allSpans the span which is to be searched
 */
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
        var self = 0;
        var selfAvg = 0;
        var selfMin = allSpans[0].duration;
        var selfMax = 0;
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
        var resultArray = {self, selfAvg, selfMin, selfMax, total, avg, min, max, count, percent};

        for (var j = 0; j < allSpans.length; j++) {
            if (allSpans[j].process.serviceName === diffServiceName[i]) {
                resultArray = calculateContent(allSpans, allSpans, j, resultArray, onePecent);
                color = colorGenerator.getColorByKey(allSpans[j].process.serviceName)
            }
        }

        selfAvg = (self / count);
        avg = total / count;

        var tableSpan = {
            name: diffServiceName[i], count: resultArray.count, total: 0,
            avg: 0, min: 0,
            max: 0, isDetail: false, key: diffServiceName[i], child: false, parentElement: "none",
            self: 0,
            selfAvg: 0, selfMin: 0,
            selfMax: 0, percent: 0,
            color: color, seachColor: "transparent",
            
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

        var self = 0;
        var selfAvg = 0;
        var selfMin = allSpans[0].duration;
        var selfMax = 0;
        //avg && min && max
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var count = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;
        var resultArray = {self, selfAvg, selfMin, selfMax, total, avg, min, max, count, percent};

        for (var j = 0; j < selectedSpan.length; j++) {
            if (diffOperationNames[i] === selectedSpan[j].operationName) {

                resultArray = calculateContent(selectedSpan, allSpans, j, resultArray, onePecent);
            }
        }
        resultArray.selfAvg = resultArray.self / resultArray.count;
        resultArray.avg = resultArray.total / resultArray.count;
        var tableSpan = {
            name: diffOperationNames[i], count: resultArray.count, total: (Math.round((resultArray.total / 1000) * 100) / 100),
            avg: (Math.round((resultArray.avg / 1000) * 100) / 100), min: Math.round((resultArray.min / 1000) * 100) / 100,
            max: (Math.round((resultArray.max / 1000) * 100) / 100), isDetail: true, key: diffOperationNames[i], child: false, parentElement: selectedSpan[i].process.serviceName,
            self: (Math.round((resultArray.self / 1000) * 100) / 100),
            selfAvg: (Math.round((resultArray.selfAvg / 1000) * 100) / 100), selfMin: (Math.round((resultArray.selfMin / 1000) * 100) / 100),
            selfMax: (Math.round((resultArray.selfMax / 1000) * 100) / 100), percent: (Math.round((resultArray.percent / 1) * 100) / 100),
            color: "", seachColor: "transparent", colorToPercent: "rgb(204,204,204)"
        };
        detail.push(tableSpan);
    }
    return detail;
}
