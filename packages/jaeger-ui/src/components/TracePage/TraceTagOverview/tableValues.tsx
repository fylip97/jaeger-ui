import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { Span } from '../../../types/trace';
import { TableSpan } from './types';
import colorGenerator from '../../../utils/color-generator';

const serviceName = "Service Name";
const operationName = "Operation Name";
/**
 * Returns the values of the table shown after the selection of the first dropdown.   
 * @param selectedTagKey the key which was selected
 */
export function getColumnValues(selectedTagKey: string, trace: Trace) {

    if (selectedTagKey === serviceName || selectedTagKey === operationName) {
        return group(selectedTagKey, trace)
    } else {
        return getTraceValuesFirstDropdown(selectedTagKey, trace)
    }
}

/**
 * Returns the values of the table shown after the selection of the second dropdown. 
 * @param actualTableValues actual values of the table
 * @param selectedTagKey first key which is selected
 * @param selectedTagKeySecond second key which is selected
 * @param trace whole information about the trace
 */
export function getColumnValuesSecondDropdown(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace) {

    if (selectedTagKey === serviceName && selectedTagKeySecond === operationName) {
        return serviceNameOperationName(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, true);
    } else if (selectedTagKey === operationName && selectedTagKeySecond === serviceName) {
        return serviceNameOperationName(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, false);
    } else if (selectedTagKey === serviceName) {
        return serviceOrOpToTag(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, true);
    } else if (selectedTagKey === operationName) {
        return serviceOrOpToTag(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, false);
    } else if (selectedTagKeySecond === serviceName) {
        return tagToServiceNameOrOperationName(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, true);
    } else if (selectedTagKeySecond === operationName) {
        return tagToServiceNameOrOperationName(actualTableValues, selectedTagKey, selectedTagKeySecond, trace, false);
    }
    else {
        return getColumnValuesSecondDropdown2Tags(actualTableValues, selectedTagKey, selectedTagKeySecond, trace);
    }
}

/**
 * Builds an obeject which represents a column.
 */
function buildOneColumn(oneColumn: TableSpan) {
    oneColumn.total = Math.round((oneColumn.total / 1000) * 100) / 100;
    oneColumn.avg = Math.round((oneColumn.avg / 1000) * 100) / 100;
    oneColumn.min = Math.round((oneColumn.min / 1000) * 100) / 100;
    oneColumn.max = Math.round((oneColumn.max / 1000) * 100) / 100;
    oneColumn.self = Math.round((oneColumn.self / 1000) * 100) / 100;
    oneColumn.selfAvg = Math.round((oneColumn.selfAvg / 1000) * 100) / 100;
    oneColumn.selfMin = Math.round((oneColumn.selfMin / 1000) * 100) / 100;
    oneColumn.selfMax = Math.round((oneColumn.selfMax / 1000) * 100) / 100;
    oneColumn.percent = Math.round((oneColumn.percent / 1) * 100) / 100;
    oneColumn.colorToPercent = "rgb(248,248,248)";

    return oneColumn;
}


/**
 * Grouped by serviceName or operationName.
 * @param selectedTagKey 
 * @param trace 
 */
function group(selectedTagKey: string, trace: Trace) {
    var allSpans = trace.spans
    var diffNamesS = new Set();
    if (selectedTagKey === serviceName) {
        for (var i = 0; i < allSpans.length; i++) {
            diffNamesS.add(allSpans[i].process.serviceName);
        }
    } else if (selectedTagKey === operationName) {
        for (var i = 0; i < allSpans.length; i++) {
            diffNamesS.add(allSpans[i].operationName);
        }
    }
    // set into array
    var diffNamesA = new Array();
    var iterator = diffNamesS.values();
    for (var j = 0; j < diffNamesS.size; j++) {
        diffNamesA.push(iterator.next().value)
    }
    return getNoTagContent(allSpans, diffNamesA, selectedTagKey, trace);
}

/**
 * first: tag second: ServiceName or OperationName
 * @param allSpans 
 * @param diffServiceName 
 * @param selectedTitle 
 */
function getNoTagContent(allSpans: Span[], diffServiceName: string[], selectedTitle: string, trace: Trace) {

    var allSpansTrace = new Array();
    for (var i = 0; i < diffServiceName.length; i++) {
        var color = "";
        var resultValue = { self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };

        for (var j = 0; j < allSpans.length; j++) {
            if (selectedTitle === serviceName) {
                if (allSpans[j].process.serviceName === diffServiceName[i]) {
                    resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                    color = colorGenerator.getColorByKey(allSpans[j].process.serviceName)
                }
            } else if (selectedTitle === operationName) {
                if (allSpans[j].operationName === diffServiceName[i]) {
                    resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                }
            }
        }
        resultValue.selfAvg = resultValue.self / resultValue.count;
        resultValue.avg = resultValue.total / resultValue.count;
        var tableSpan = {
            name: diffServiceName[i],
            count: resultValue.count,
            total: resultValue.total,
            avg: resultValue.avg,
            min: resultValue.min,
            max: resultValue.max,
            isDetail: false,
            self: resultValue.self,
            selfAvg: resultValue.selfAvg,
            selfMin: resultValue.selfMin,
            selfMax: resultValue.selfMax,
            percent: resultValue.percent,
            color: color,
            searchColor: "",
            parentElement: "none",
            colorToPercent: ""
        }
        tableSpan = buildOneColumn(tableSpan);
        allSpansTrace.push(tableSpan);
    }
    return allSpansTrace;
}

/**
 * Get first dropdown.
 * @param selectedTagKey 
 * @param trace 
 */
function getTraceValuesFirstDropdown(selectedTagKey: string, trace: Trace) {

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

        var name = "" + diffrentKeyValuesA[i];
        var resultValue = { self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };

        for (var j = 0; j < allSpansWithSelectedKey.length; j++) {
            for (var l = 0; l < allSpansWithSelectedKey[j].tags.length; l++) {
                if (diffrentKeyValuesA[i] === allSpansWithSelectedKey[j].tags[l].value) {
                    resultValue = calculateContent(allSpansWithSelectedKey[j], allSpans, resultValue);
                }
            }
        }

        resultValue.selfAvg = resultValue.self / resultValue.count;
        resultValue.avg = resultValue.total / resultValue.count;
        var buildOneColumnValue = {
            name: name,
            count: resultValue.count,
            total: resultValue.total,
            avg: resultValue.avg,
            min: resultValue.min,
            max: resultValue.max,
            isDetail: false,
            self: resultValue.self,
            selfAvg: resultValue.selfAvg,
            selfMin: resultValue.selfMin,
            selfMax: resultValue.selfMax,
            percent: resultValue.percent,
            color: "",
            searchColor: "transparent",
            parentElement: "",
            colorToPercent: ""
        }
        buildOneColumnValue = buildOneColumn(buildOneColumnValue);
        allValuesColumn.push(buildOneColumnValue);
    }

    // last entry    
    var resultValue = { self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };
    for (var i = 0; i < allSpansWithoutSelectedKey.length; i++) {
        resultValue = calculateContent(allSpansWithoutSelectedKey[i], allSpans, resultValue);
    }

    resultValue.selfAvg = resultValue.self / resultValue.count;
    resultValue.avg = resultValue.total / resultValue.count;
    if (resultValue.count == 0) {
        resultValue.avg = 0;
        resultValue.selfAvg = 0;
        resultValue.min = 0;
        resultValue.selfMin = 0;
    }
    var buildOneColumnValue = {
        name: "Others",
        count: resultValue.count,
        total: resultValue.total,
        avg: resultValue.avg,
        min: resultValue.min,
        max: resultValue.max,
        isDetail: false,
        self: resultValue.self,
        selfAvg: resultValue.selfAvg,
        selfMin: resultValue.selfMin,
        selfMax: resultValue.selfMax,
        percent: resultValue.percent,
        color: "",
        searchColor: "transparent",
        parentElement: "",
        colorToPercent: ""
    };

    buildOneColumnValue = buildOneColumn(buildOneColumnValue);
    allValuesColumn.push(buildOneColumnValue);
    return allValuesColumn;
}

/**
 * First: Tag second: Tag
 * @param actualTableValues 
 * @param selectedTagKey 
 * @param selectedTagKeySecond 
 * @param trace 
 */
function getColumnValuesSecondDropdown2Tags(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace) {

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
            var tempArray = new Array();
            for (var j = 0; j < allSpansWithSelectedTagKey.length; j++) {
                var check = false;
                for (var l = 0; l < allSpansWithSelectedTagKey[j].tags.length; l++) {
                    if (actualTableValues[i].name === allSpansWithSelectedTagKey[j].tags[l].value) {
                        check = true;
                    }
                }
                if (check) {
                    tempArray.push(allSpansWithSelectedTagKey[j]);
                }
            }
            // find diffrent values in second dropdown
            var diffNamesS = new Set();
            for (var j = 0; j < tempArray.length; j++) {
                for (var l = 0; l < tempArray[j].tags.length; l++) {

                    if (tempArray[j].tags[l].key === selectedTagKeySecond) {
                        diffNamesS.add(tempArray[j].tags[l].value);
                    }
                }
            }
            // set into array
            var diffNamesA = new Array();
            var iterator = diffNamesS.values();
            for (var j = 0; j < diffNamesS.size; j++) {
                diffNamesA.push(iterator.next().value)
            }
            var allValuesColumn = Array();
            var allValuesColumn = buildDetail(diffNamesA, tempArray, allSpans, false, actualTableValues[i].name, true, trace);
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
 * First: ServiceName or OperationName second: ServiceName or OperationName
 * @param actualTableValues 
 * @param selectedTagKey 
 * @param selectedTagKeySecond 
 * @param trace 
 * @param serviceName 
 */
function serviceNameOperationName(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace, serviceName: boolean) {

    var allSpans = trace.spans;
    var allColumnValues = new Array();
    for (var i = 0; i < actualTableValues.length; i++) {
        if (!actualTableValues[i].isDetail) {
            var tempArray = Array();
            for (var j = 0; j < allSpans.length; j++) {
                if (serviceName) {
                    if (actualTableValues[i].name === allSpans[j].process.serviceName) {
                        tempArray.push(allSpans[j]);
                    }
                } else {
                    if (actualTableValues[i].name === allSpans[j].operationName) {
                        tempArray.push(allSpans[j]);
                    }
                }
            }
            var diffNamesS = new Set();
            for (var j = 0; j < tempArray.length; j++) {
                if (serviceName) {
                    diffNamesS.add(tempArray[j].operationName);
                } else {
                    diffNamesS.add(tempArray[j].process.serviceName);
                }
            }
            var diffNamesA = new Array();
            var iterator = diffNamesS.values();
            for (var j = 0; j < diffNamesS.size; j++) {
                diffNamesA.push(iterator.next().value)
            }
            var newColumnValues = new Array()
            var newColumnValues = buildDetail(diffNamesA, tempArray, allSpans, !serviceName, actualTableValues[i].name, false, trace);
            allColumnValues.push(actualTableValues[i]);
            if (newColumnValues.length > 0) {
                for (var j = 0; j < newColumnValues.length; j++) {
                    allColumnValues.push(newColumnValues[j]);
                }
            }
        }
    }
    return allColumnValues;
}

/**
 * First ServiceName or Operation Name to Tag.
 * @param actualTableValues 
 * @param selectedTagKey 
 * @param selectedTagKeySecond 
 * @param trace 
 * @param serviceName 
 */
function serviceOrOpToTag(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace, serviceName: boolean) {

    var allSpans = trace.spans;
    var allColumnValues = new Array();
    for (var i = 0; i < actualTableValues.length; i++) {
        if (!actualTableValues[i].isDetail) {
            var tempArray = new Array();
            for (var j = 0; j < allSpans.length; j++) {
                if (serviceName) {
                    if (actualTableValues[i].name === allSpans[j].process.serviceName) {
                        tempArray.push(allSpans[j]);
                    }
                } else {
                    if (actualTableValues[i].name === allSpans[j].operationName) {
                        tempArray.push(allSpans[j]);
                    }
                }
            }
            var diffValuesS = new Set();
            for (var j = 0; j < tempArray.length; j++) {

                for (var l = 0; l < tempArray[j].tags.length; l++) {
                    if (tempArray[j].tags[l].key === selectedTagKeySecond) {
                        diffValuesS.add(tempArray[j].tags[l].value);
                    }
                }
            }
            var diffNamesA = new Array();
            var iterator = diffValuesS.values();
            for (var j = 0; j < diffValuesS.size; j++) {
                diffNamesA.push(iterator.next().value)
            }
            var newColumnValues = new Array();
            var newColumnValues = buildDetail(diffNamesA, tempArray, allSpans, false, actualTableValues[i].name, true, trace)
            allColumnValues.push(actualTableValues[i]);
            if (newColumnValues.length > 0) {
                for (var j = 0; j < newColumnValues.length; j++) {
                    allColumnValues.push(newColumnValues[j]);
                }
            }

        }
    }
    return generateDetailRest(allColumnValues, selectedTagKeySecond, trace, serviceName);
}

/**
 * First: Tag second: ServiceName or OperationName
 * @param actualTableValues 
 * @param selectedTagKey 
 * @param selectedTagKeySecond 
 * @param trace 
 * @param serviceName 
 */
function tagToServiceNameOrOperationName(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace, serviceName: boolean) {

    var allSpans = trace.spans;
    var allColumnValues = new Array();
    for (var i = 0; i < actualTableValues.length; i++) {
        if (!actualTableValues[i].isDetail) {
            var tempArray = new Array();
            for (var j = 0; j < allSpans.length; j++) {
                for (var l = 0; l < allSpans[j].tags.length; l++) {
                    if (actualTableValues[i].name === allSpans[j].tags[l].value) {
                        tempArray.push(allSpans[j]);
                    }
                }
            }
            var diffNamesS = new Set();
            for (var j = 0; j < tempArray.length; j++) {
                if (serviceName) {
                    diffNamesS.add(tempArray[j].process.serviceName);
                } else {
                    diffNamesS.add(tempArray[j].operationName);
                }
            }
            //to Array
            var diffNamesA = new Array();
            var iterator = diffNamesS.values();
            for (var j = 0; j < diffNamesS.size; j++) {
                diffNamesA.push(iterator.next().value)
            }
            // ab hier test 
            var newColumnValues = buildDetail(diffNamesA, tempArray, allSpans, serviceName, actualTableValues[i].name, false, trace);
            allColumnValues.push(actualTableValues[i]);
            if (newColumnValues.length > 0) {
                for (var j = 0; j < newColumnValues.length; j++) {
                    allColumnValues.push(newColumnValues[j]);
                }
            }
        }
    }
    return allColumnValues;
}

/**
 * Creates columns for the children.
 */
function buildDetail(diffNamesA: string[], tempArray: Span[], allSpans: Span[], serviceName: boolean, parentName: string, isDetail: boolean, trace: Trace) {

    var newColumnValues = Array();
    for (var j = 0; j < diffNamesA.length; j++) {
        var color = "";
        var resultValue = { self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };
        for (var l = 0; l < tempArray.length; l++) {
            if (isDetail) {
                for (var a = 0; a < tempArray[l].tags.length; a++) {
                    if (diffNamesA[j] === tempArray[l].tags[a].value) {
                        resultValue = calculateContent(tempArray[l], allSpans, resultValue);
                    }
                }
            } else {
                if (serviceName) {
                    if (diffNamesA[j] === tempArray[l].process.serviceName) {
                        resultValue = calculateContent(tempArray[l], allSpans, resultValue);
                        color = colorGenerator.getColorByKey(tempArray[l].process.serviceName);
                    }
                } else {
                    if (diffNamesA[j] === tempArray[l].operationName) {
                        resultValue = calculateContent(tempArray[l], allSpans, resultValue);
                    }
                }
            }
        }
        resultValue.selfAvg = resultValue.self / resultValue.count;
        resultValue.avg = resultValue.total / resultValue.count;
        var buildOneColumnValue = {
            name: diffNamesA[j],
            count: resultValue.count,
            total: resultValue.total,
            avg: resultValue.avg,
            min: resultValue.min,
            max: resultValue.max,
            isDetail: true,
            self: resultValue.self,
            selfAvg: resultValue.selfAvg,
            selfMin: resultValue.selfMin,
            selfMax: resultValue.selfMax,
            percent: resultValue.percent,
            color: color,
            searchColor: "",
            parentElement: parentName,
            colorToPercent: "",

        }
        buildOneColumnValue = buildOneColumn(buildOneColumnValue);
        newColumnValues.push(buildOneColumnValue);
    }
    return newColumnValues;
}


function generateDetailRest(allColumnValues: TableSpan[], selectedTagKeySecond: string, trace: Trace, serviceName: boolean) {

    var allSpans = trace.spans;
    var newTable = new Array();
    for (var i = 0; i < allColumnValues.length; i++) {
        newTable.push(allColumnValues[i]);
        if (!allColumnValues[i].isDetail) {
            var resultValue = { self: 0, selfAvg: 0, selfMin: trace.duration, selfMax: 0, total: 0, avg: 0, min: trace.duration, max: 0, count: 0, percent: 0 };

            for (var j = 0; j < allSpans.length; j++) {
                if (allColumnValues[i].name === allSpans[j].process.serviceName || allColumnValues[i].name === allSpans[j].operationName) {
                    var rest = true;
                    for (var l = 0; l < allSpans[j].tags.length; l++) {
                        if (allSpans[j].tags[l].key === selectedTagKeySecond) {
                            rest = false;
                        }
                    }
                    if (rest) {
                        resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                    }
                }

            }
            resultValue.avg = resultValue.total / resultValue.count;
            resultValue.selfAvg = resultValue.self / resultValue.count;
            if (resultValue.count != 0) {
                var buildOneColumnValue = {
                    name: "Others",
                    count: resultValue.count,
                    total: resultValue.total,
                    avg: resultValue.avg,
                    min: resultValue.min,
                    max: resultValue.max,
                    isDetail: true,
                    self: resultValue.self,
                    selfAvg: resultValue.selfAvg,
                    selfMin: resultValue.selfMin,
                    selfMax: resultValue.selfMax,
                    percent: resultValue.percent,
                    color: "",
                    searchColor: "",
                    parentElement: allColumnValues[i].name,
                    colorToPercent: ""
                };
                buildOneColumnValue = buildOneColumn(buildOneColumnValue)
                newTable.push(buildOneColumnValue);
            }
        }
    }
    return newTable;
}
/**
 * Used to get the calculation.
 * @param span 
 * @param wholeTrace 
 * @param resultValue 
 */
function calculateContent(span: Span, wholeTrace: Span[], resultValue: any) {

    resultValue.count += 1;
    resultValue.total += span.duration;
    if (resultValue.min > span.duration) {
        resultValue.min = span.duration;
    }
    if (resultValue.max < span.duration) {
        resultValue.max = span.duration;
    }
    //For each span with the same operationName 
    //Do I have children?
    if (span.hasChildren) {
        var sumAllChildInSpan = 0;
        // if I have children then look for my children
        for (var l = 0; l < wholeTrace.length; l++) {
            //i am a child?
            if (wholeTrace[l].references.length == 1) {
                //i am a child of this span?
                if (span.spanID == wholeTrace[l].references[0].spanID) {
                    sumAllChildInSpan = sumAllChildInSpan + wholeTrace[l].duration
                }
            }
        }
        var tempSelf = span.duration - sumAllChildInSpan;
        var isNotLonger = true;
        for (var l = 0; l < wholeTrace.length; l++) {
            if (wholeTrace[l].references.length == 1) {
                if (span.spanID == wholeTrace[l].references[0].spanID && isNotLonger) {
                    if (wholeTrace[l].duration > span.duration) {
                        isNotLonger = false;
                    }
                }
            }
        }
        if (tempSelf < 0 || !isNotLonger) {
            var onlyOne = true
            for (var l = 0; l < wholeTrace.length; l++) {
                if (wholeTrace[l].references.length == 1) {
                    if (span.spanID == wholeTrace[l].references[0].spanID && onlyOne) {
                        onlyOne = false;
                        tempSelf = wholeTrace[l].relativeStartTime - span.relativeStartTime;
                    }
                }
            }
        }
        if (resultValue.selfMin > tempSelf) {
            resultValue.selfMin = tempSelf;
        }
        if (resultValue.selfMax < tempSelf) {
            resultValue.selfMax = tempSelf;
        }
        resultValue.self = resultValue.self + tempSelf;
    } else {
        if (resultValue.selfMin > (span.duration)) {
            resultValue.selfMin = span.duration;
        }
        if (resultValue.selfMax < span.duration) {
            resultValue.selfMax = span.duration;
        }
        resultValue.self = resultValue.self + span.duration;
    }
    resultValue.percent = resultValue.self / (resultValue.total / 100)
    return resultValue;
}