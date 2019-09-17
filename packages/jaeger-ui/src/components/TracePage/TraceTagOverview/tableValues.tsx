import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { calculateContent } from '../DetailTraceTable/tableContent';
import { TableSpan } from './types';


/**
 * returns the values of the table shown after the selection of the first dropdown   
 * @param selectedTagKey the key which was selected
 * @param trace 
 */
export function getColumnValues(selectedTagKey: string, trace: Trace) {

    var allSpansWithSelectedKey = new Array();
    var allSpansWithoutSelectedKey = new Array();
    var allSpans = trace.spans;
    var diffrentKeyValues = new Set();

    // all with the selected key and get all diff values
    for (var i = 0; i < allSpans.length; i++) {

        var isIn = false;
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            if (allSpans[i].tags[j].key === selectedTagKey) {
                isIn = true;
                diffrentKeyValues.add(allSpans[i].tags[j].value);
            }
        }
        if (isIn) {
            allSpansWithSelectedKey.push(allSpans[i]);
        } else {
            allSpansWithoutSelectedKey.push(allSpans[i]);
        }
    }

    // set into array
    var diffrentKeyValuesA = new Array();
    var iterator = diffrentKeyValues.values();
    for (var i = 0; i < diffrentKeyValues.size; i++) {
        diffrentKeyValuesA.push(iterator.next().value)
    }

    var allValuesColumn = Array();
    for (var i = 0; i < diffrentKeyValuesA.length; i++) {

        var self = 0;
        var selfAvg = 0;
        var selfMin = allSpans[0].duration;
        var selfMax = 0;
        var name = "" + diffrentKeyValuesA[i];
        var count = 0;
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;

        var resultArray = { self, selfAvg, selfMin, selfMax, total, avg, min, max, count, percent };

        for (var j = 0; j < allSpansWithSelectedKey.length; j++) {
            for (var l = 0; l < allSpansWithSelectedKey[j].tags.length; l++) {
                if (diffrentKeyValuesA[i] === allSpansWithSelectedKey[j].tags[l].value) {
                    resultArray = calculateContent(allSpansWithSelectedKey, allSpans, j, resultArray, onePecent);
                }
            }
        }

        resultArray.selfAvg = resultArray.self / resultArray.count;
        resultArray.avg = resultArray.total / resultArray.count;
        allValuesColumn.push(buildOneColumn(name, resultArray.count, resultArray.total, resultArray.avg, resultArray.min, resultArray.max, false, resultArray.self, resultArray.selfAvg, resultArray.selfMin, resultArray.selfMax, resultArray.percent, "", "transparent", ""));
    }

    // last entry
    var self = 0;
    var selfAvg = 0;
    var selfMin = allSpans[0].duration;
    var selfMax = 0;
    var count = 0;
    var total = 0;
    var avg = 0;
    var min = allSpans[0].duration;
    var max = 0;
    var percent = 0;
    var allPercent = allSpans[0].duration;
    var onePecent = allPercent / 100;
    var resultArray = { self, selfAvg, selfMin, selfMax, total, avg, min, max, count, percent };
    for (var i = 0; i < allSpansWithoutSelectedKey.length; i++) {
        resultArray = calculateContent(allSpansWithoutSelectedKey, allSpans, i, resultArray, onePecent);
    }

    resultArray.selfAvg = resultArray.self / resultArray.count;
    resultArray.avg = resultArray.total / resultArray.count;
    if (resultArray.count == 0) {
        resultArray.avg = 0;
        resultArray.selfAvg = 0;
        resultArray.min = 0;
        resultArray.selfMin = 0;
    }
    allValuesColumn.push(buildOneColumn("rest", resultArray.count, resultArray.total, resultArray.avg, resultArray.min, resultArray.max, false, resultArray.self, resultArray.selfAvg, resultArray.selfMin, resultArray.selfMax, resultArray.percent, "", "transparent", ""));
    return allValuesColumn;
}

/**
 * returns the values of the table shown after the selection of the second dropdown 
 * @param actualTableValues actual values of the table
 * @param selectedTagKey first key which is selected
 * @param selectedTagKeySecond second key which is selected
 * @param trace whole information about the trace
 */
export function getColumnValuesSecondDropdown(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace) {

    var allSpans = trace.spans;
    var allSpansWithMoreKeys = new Array();
    var newTableValues = new Array();
    // save all Spans with more than one tag key
    for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].tags.length > 1) {
            allSpansWithMoreKeys.push(allSpans[i]);
        }
    }
    // allSpans with selectedTagKey
    var allSpansWithSelectedTagKey = new Array();

    for (var i = 0; i < allSpansWithMoreKeys.length; i++) {
        var check = false;
        var check2 = false;
        for (var j = 0; j < allSpansWithMoreKeys[i].tags.length; j++) {
            if (allSpansWithMoreKeys[i].tags[j].key === selectedTagKey) {
                check = true;
            }
            if (allSpansWithMoreKeys[i].tags[j].key === selectedTagKeySecond) {
                check2 = true;
            }
        }
        if (check && check2) {
            allSpansWithSelectedTagKey.push(allSpansWithMoreKeys[i]);
        }
    }
    for (var i = 0; i < actualTableValues.length; i++) {
        if (!actualTableValues[i].isDetail) {
            // same Value firstDropdown
            var sameValue = new Array();
            for (var j = 0; j < allSpansWithSelectedTagKey.length; j++) {
                var check = false;
                for (var l = 0; l < allSpansWithSelectedTagKey[j].tags.length; l++) {
                    if (actualTableValues[i].name === allSpansWithSelectedTagKey[j].tags[l].value) {
                        check = true;
                    }
                }
                if (check) {
                    sameValue.push(allSpansWithSelectedTagKey[j]);
                }
            }
            // find diffrent values in second dropdown
            var diffSecondValues = new Set();
            for (var j = 0; j < sameValue.length; j++) {
                for (var l = 0; l < sameValue[j].tags.length; l++) {

                    if (sameValue[j].tags[l].key === selectedTagKeySecond) {
                        diffSecondValues.add(sameValue[j].tags[l].value);
                    }
                }
            }
            // set into array
            var diffSecondValuesA = new Array();
            var iterator = diffSecondValues.values();
            for (var j = 0; j < diffSecondValues.size; j++) {
                diffSecondValuesA.push(iterator.next().value)
            }
            var allValuesColumn = Array();
            for (var j = 0; j < diffSecondValuesA.length; j++) {

                var self = 0;
                var selfAvg = 0;
                var selfMin = allSpans[0].duration;
                var selfMax = 0;
                var name = String(diffSecondValuesA[j]);
                var count = 0;
                var total = 0;
                var avg = 0;
                var min = allSpans[0].duration;
                var max = 0;
                var percent = 0;
                var allPercent = allSpans[0].duration;
                var onePecent = allPercent / 100;
                var resultArray = { self, selfAvg, selfMin, selfMax, total, avg, min, max, count, percent };

                for (var l = 0; l < sameValue.length; l++) {

                    for (var a = 0; a < sameValue[l].tags.length; a++) {
                        if (diffSecondValuesA[j] === sameValue[l].tags[a].value) {

                            resultArray = calculateContent(sameValue, allSpans, l, resultArray, onePecent);
                        }
                    }
                }
                resultArray.selfAvg = resultArray.self / resultArray.count;
                resultArray.avg = resultArray.total / resultArray.count;
                allValuesColumn.push(buildOneColumn(name, resultArray.count, resultArray.total, resultArray.avg, resultArray.min, resultArray.max, true, resultArray.self, resultArray.selfAvg, resultArray.selfMin, resultArray.selfMax, resultArray.percent, "", "transparent", actualTableValues[i].name));
            }
            newTableValues.push(actualTableValues[i]);
            if (allValuesColumn.length != 0) {
                for (var j = 0; j < allValuesColumn.length; j++) {
                    newTableValues.push(allValuesColumn[j]);
                }
            }
        }
    }
    return newTableValues;
}

/**
 * builds an obeject which represents a column
 * @param name 
 * @param count 
 * @param total 
 * @param avg 
 * @param min 
 * @param max 
 * @param isDetail 
 * @param self 
 * @param selfAvg 
 * @param selfMin 
 * @param selfMax 
 * @param percent 
 * @param color 
 * @param seachColor 
 * @param parentElement 
 */
function buildOneColumn(name: string, count: number, total: number, avg: number,
    min: number, max: number, isDetail: boolean, self: number, selfAvg: number,
    selfMin: number, selfMax: number, percent: number, color: string, seachColor: string,
    parentElement: string) {

    var oneColumn = {
        name: name, count: count, total: (Math.round((total / 1000) * 100) / 100),
        avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
        max: (Math.round((max / 1000) * 100) / 100), isDetail: isDetail,
        self: (Math.round((self / 1000) * 100) / 100),
        selfAvg: (Math.round((selfAvg / 1000) * 100) / 100), selfMin: (Math.round((selfMin / 1000) * 100) / 100),
        selfMax: (Math.round((selfMax / 1000) * 100) / 100), percent: (Math.round((percent / 1) * 100) / 100),
        color: color, seachColor: seachColor, parentElement: parentElement,
    }
    return oneColumn;
}