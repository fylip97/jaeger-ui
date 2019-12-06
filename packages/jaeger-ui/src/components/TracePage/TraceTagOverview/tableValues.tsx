import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { Span } from '../../../types/trace';
import { TableSpan } from './types';
import colorGenerator from '../../../utils/color-generator';
import * as _ from 'lodash';

const serviceName = "Service Name";
const operationName = "Operation Name";
const others = "Others";

/**
 * Returns the values of the table shown after the selection of the first dropdown.   
 * @param selectedTagKey the key which was selected
 */
export function getColumnValues(selectedTagKey: string, trace: Trace) {
    return valueFirstDropdown(selectedTagKey, trace);
}

/**
 * Returns the values of the table shown after the selection of the second dropdown. 
 * @param actualTableValues actual values of the table
 * @param selectedTagKey first key which is selected
 * @param selectedTagKeySecond second key which is selected
 * @param trace whole information about the trace
 */
export function getColumnValuesSecondDropdown(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace) {
    return valueSecondDropdown(actualTableValues, selectedTagKey, selectedTagKeySecond, trace);
}

/**
 * Is used if only one dropdown is selected.
 */
function valueFirstDropdown(selectedTagKey: string, trace: Trace) {
    let allDiffColumnValues = new Array();
    var allSpans = trace.spans;
    // all possibilities that can be displayed
    if (selectedTagKey === serviceName) {
        var temp = _.chain(allSpans).groupBy(x => x.process.serviceName).map((value, key) => ({ key: key })).uniq().value();
        for (var i = 0; i < temp.length; i++) {
            allDiffColumnValues.push(temp[i].key);
        }
    } else if (selectedTagKey === operationName) {
        var temp = _.chain(allSpans).groupBy(x => x.operationName).map((value, key) => ({ key: key })).uniq().value();
        for (var i = 0; i < temp.length; i++) {
            allDiffColumnValues.push(temp[i].key);
        }
    } else {
        for (var i = 0; i < allSpans.length; i++) {
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                if (allSpans[i].tags[j].key === selectedTagKey) {
                    allDiffColumnValues.push(allSpans[i].tags[j].value);
                }
            }
        }
        allDiffColumnValues = [...new Set(allDiffColumnValues)];
    }
    //used to build the table
    var allTableValues = new Array();
    var spanWithNoSelectedTag = new Array(); // is only needed when there are Others
    for (var i = 0; i < allDiffColumnValues.length; i++) {
        var color = "";
        var resultValue = {
            self: 0,
            selfMin: trace.duration,
            selfMax: 0,
            selfAvg: 0,
            total: 0,
            avg: 0,
            min: trace.duration,
            max: 0,
            count: 0,
            percent: 0
        }
        for (var j = 0; j < allSpans.length; j++) {
            if (selectedTagKey === serviceName) {
                if (allSpans[j].process.serviceName === allDiffColumnValues[i]) {
                    resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                    color = colorGenerator.getColorByKey(allSpans[j].process.serviceName);
                }
            } else if (selectedTagKey === operationName) {
                if (allSpans[j].operationName === allDiffColumnValues[i]) {
                    resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                }
            } else {
                // used when a tag is selected
                for (var l = 0; l < allSpans[j].tags.length; l++) {
                    if (allSpans[j].tags[l].value === allDiffColumnValues[i]) {
                        resultValue = calculateContent(allSpans[j], allSpans, resultValue);
                    }
                }
            }
        }
        resultValue.selfAvg = resultValue.self / resultValue.count;
        resultValue.avg = resultValue.total / resultValue.count;
        var tableSpan = {
            name: allDiffColumnValues[i],
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
        allTableValues.push(tableSpan);
    }
    // checks if there is OTHERS
    if (selectedTagKey !== serviceName && selectedTagKey !== operationName) {
        for (var i = 0; i < allSpans.length; i++) {
            var isIn = false;
            for (var j = 0; j < allSpans[i].tags.length; j++) {
                for (var l = 0; l < allDiffColumnValues.length; l++) {
                    if (allSpans[i].tags[j].value === allDiffColumnValues[l]) {
                        isIn = true;
                    }
                }
            }
            if (!isIn) {
                spanWithNoSelectedTag.push(allSpans[i]);
            }
        }
        // Others is calculated
        var resultValue = {
            self: 0,
            selfAvg: 0,
            selfMin: trace.duration,
            selfMax: 0,
            total: 0,
            avg: 0,
            min: trace.duration,
            max: 0,
            count: 0,
            percent: 0
        };
        for (var i = 0; i < spanWithNoSelectedTag.length; i++) {
            resultValue = calculateContent(spanWithNoSelectedTag[i], allSpans, resultValue);
        }
        if (resultValue.count != 0) {
            //Others is build
            resultValue.selfAvg = resultValue.self / resultValue.count;
            resultValue.avg = resultValue.total / resultValue.count;
            var tableSpanOTHERS = {
                name: others,
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
            tableSpanOTHERS = buildOneColumn(tableSpanOTHERS);
            allTableValues.push(tableSpanOTHERS);
        }
    }
    return allTableValues;
}

/**
 * Used to get values if the second dropdown is selected.
 */
function valueSecondDropdown(actualTableValues: TableSpan[], selectedTagKey: string, selectedTagKeySecond: string, trace: Trace) {

    var allSpans = trace.spans;
    var allTableValues = new Array();

    for (var i = 0; i < actualTableValues.length; i++) {
        // if the table is already in the detail view, then these entries are not considered
        if (!actualTableValues[i].isDetail) {
            var tempArray = new Array();
            var diffNamesA = new Array();
            // all Spans withe the same value (first dropdown)
            for (var j = 0; j < allSpans.length; j++) {
                if (selectedTagKey === serviceName) {
                    if (actualTableValues[i].name === allSpans[j].process.serviceName) {
                        tempArray.push(allSpans[j]);
                        diffNamesA.push(allSpans[j].operationName)
                    }
                } else if (selectedTagKey === operationName) {
                    if (actualTableValues[i].name === allSpans[j].operationName) {
                        tempArray.push(allSpans[j]);
                        diffNamesA.push(allSpans[j].process.serviceName)
                    }
                    // if first dropdown is a tag
                } else {
                    for (var j = 0; j < allSpans.length; j++) {
                        for (var l = 0; l < allSpans[j].tags.length; l++) {
                            if (actualTableValues[i].name === allSpans[j].tags[l].value) {
                                tempArray.push(allSpans[j]);
                                if (selectedTagKeySecond === operationName) {
                                    diffNamesA.push(allSpans[j].operationName);
                                } else if (selectedTagKeySecond === serviceName) {
                                    diffNamesA.push(allSpans[j].process.serviceName);
                                }
                            }
                        }
                    }
                }
            }
            var newColumnValues = [];
            // if second dropdown is no tag
            if (selectedTagKeySecond === serviceName || selectedTagKeySecond === operationName) {
                diffNamesA = [...new Set(diffNamesA)];
                newColumnValues = buildDetail(diffNamesA, tempArray, allSpans, selectedTagKeySecond, actualTableValues[i].name, false, trace);
            } else {
                // second dropdown is a tag
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
                var newColumnValues = buildDetail(diffNamesA, tempArray, allSpans, selectedTagKeySecond, actualTableValues[i].name, true, trace);
            }
            allTableValues.push(actualTableValues[i]);
            if (newColumnValues.length > 0) {
                for (var j = 0; j < newColumnValues.length; j++) {
                    allTableValues.push(newColumnValues[j]);
                }
            }
        }
    }
    // if second dropdown is a tag a rest must be created
    if (selectedTagKeySecond !== serviceName && selectedTagKeySecond !== operationName) {
        return generateDetailRest(allTableValues, selectedTagKeySecond, trace);
        // if no tag is selected the values can be returned
    } else {
        return allTableValues;
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
 * Creates columns for the children.
 */
function buildDetail(diffNamesA: string[], tempArray: Span[], allSpans: Span[], selectedTagKeySecond: string, parentName: string, isDetail: boolean, trace: Trace) {

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
                if (selectedTagKeySecond === serviceName) {
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

/**
 * Used to generate detail rest.
 */
function generateDetailRest(allColumnValues: TableSpan[], selectedTagKeySecond: string, trace: Trace) {

    var allSpans = trace.spans;
    var newTable = new Array();
    for (var i = 0; i < allColumnValues.length; i++) {
        newTable.push(allColumnValues[i]);
        if (!allColumnValues[i].isDetail) {
            var resultValue = {
                self: 0,
                selfAvg: 0,
                selfMin: trace.duration,
                selfMax: 0,
                total: 0,
                avg: 0,
                min: trace.duration,
                max: 0,
                count: 0,
                percent: 0
            };
            for (var j = 0; j < allSpans.length; j++) {
                if (allColumnValues[i].name === allSpans[j].process.serviceName || allColumnValues[i].name === allSpans[j].operationName) {
                    var rest = true;
                    for (var l = 0; l < allSpans[j].tags.length; l++) {
                        if (allSpans[j].tags[l].key === selectedTagKeySecond) {
                            rest = false;
                            break;
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
                    name: others,
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
 * Used to calculated the content.
 */
export function calculateContent(span: Span, allSpans: Span[], resultValue: any) {

    //rechnung für nicht selfTime
    resultValue.count += 1;
    resultValue.total += span.duration;
    if (resultValue.min > span.duration) {
        resultValue.min = span.duration;
    }
    if (resultValue.max < span.duration) {
        resultValue.max = span.duration;
    }
    // selfTime
    var tempSelf = 0;
    var longerAsParent = false;
    var kinderSchneiden = false;
    var allOverlay = new Array();
    var longerAsParentSpan = new Array();
    if (span.hasChildren) {
        var allChildren = new Array();
        for (var i = 0; i < allSpans.length; i++) {
            //i am a child?
            if (allSpans[i].references.length == 1) {
                if (span.spanID == allSpans[i].references[0].spanID) {
                    allChildren.push(allSpans[i]);
                }
            }
        }
        // i only have one child
        if (allChildren.length == 1) {
            if (span.relativeStartTime + span.duration >= (allChildren[0].relativeStartTime + allChildren[0].duration)) {
                tempSelf = span.duration - allChildren[0].duration;
            } else {
                tempSelf = allChildren[0].relativeStartTime - span.relativeStartTime;
            }
        } else {
            // is the child longer as parent
            for (var i = 0; i < allChildren.length; i++) {
                if (span.duration + span.relativeStartTime < allChildren[i].duration + allChildren[i].relativeStartTime) {
                    longerAsParent = true;
                    longerAsParentSpan.push(allChildren[i]);
                }
            }
            // Do the children overlap?
            for (var i = 0; i < allChildren.length; i++) {
                for (var j = 0; j < allChildren.length; j++) {
                    //aren't they the same kids?
                    if (allChildren[i].spanID !== allChildren[j].spanID) {
                        //if yes the children cut themselves or lie into each other
                        if ((allChildren[i].relativeStartTime <= allChildren[j].relativeStartTime) &&
                            (allChildren[i].relativeStartTime + allChildren[i].duration) >= (allChildren[j].relativeStartTime)) {
                            kinderSchneiden = true;
                            allOverlay.push(allChildren[i]);
                            allOverlay.push(allChildren[j]);
                        }
                    }
                }
            }
            allOverlay = [...new Set(allOverlay)];
            // diff options
            if (!longerAsParent && !kinderSchneiden) {
                tempSelf = span.duration;
                for (var i = 0; i < allChildren.length; i++) {
                    tempSelf = tempSelf - allChildren[i].duration;
                }
            } else if (longerAsParent && kinderSchneiden) {
                // cut only longerAsParent
                if (_.isEmpty(_.xor(allOverlay, longerAsParentSpan))) {
                    //find ealiesr longerasParent
                    var earliestLongerAsParent = _.minBy(longerAsParentSpan, function (a) {
                        return a.relativeStartTime;
                    });
                    // remove all children wo are longer as Parent
                    var allChildrenWithout = _.difference(allChildren, longerAsParentSpan);
                    tempSelf = earliestLongerAsParent.relativeStartTime - span.relativeStartTime;
                    for (var i = 0; i < allChildrenWithout.length; i++) {
                        tempSelf = tempSelf - allChildrenWithout[i].duration;
                    }
                } else {
                    var overlayOnly = _.difference(allOverlay, longerAsParentSpan);
                    var allChildrenWithout = _.difference(allChildren, longerAsParentSpan);
                    var earliestLongerAsParent = _.minBy(longerAsParentSpan, function (a) {
                        return a.relativeStartTime;
                    });

                    // overlay between longerAsParent and overlayOnly
                    var overlayWithout = new Array();
                    for (var i = 0; i < overlayOnly.length; i++) {
                        if (!earliestLongerAsParent.relativeStartTime <= overlayOnly[i].relativeStartTime) {
                            overlayWithout.push(overlayOnly[i]);
                        }
                    }
                    for (var i = 0; i < overlayWithout.length; i++) {
                        if (overlayWithout[i].relativeStartTime + overlayWithout[i].duration > earliestLongerAsParent.relativeStartTime) {
                            overlayWithout[i].duration = overlayWithout[i].duration - (overlayWithout[i].relativeStartTime + overlayWithout[i].duration - earliestLongerAsParent.relativeStartTime);
                        }
                    }

                    tempSelf = onlyOverlay(overlayWithout, allChildrenWithout, tempSelf, span);
                    var diff = span.relativeStartTime + span.duration - earliestLongerAsParent.relativeStartTime;
                    tempSelf = tempSelf - diff;
                }

            } else if (longerAsParent) {
                // span is longer as Parent
                tempSelf = longerAsParentSpan[0].relativeStartTime - span.relativeStartTime;
                for (var i = 0; i < allChildren.length; i++) {
                    if (allChildren[i].spanID !== longerAsParentSpan[0].spanID) {
                        tempSelf = tempSelf - allChildren[i].duration;
                    }
                }

            } else {
                // Overlay
                tempSelf = onlyOverlay(allOverlay, allChildren, tempSelf, span);
            }
        }
        // no children
    } else {
        tempSelf = tempSelf + span.duration;
    }
    if (resultValue.selfMin > tempSelf) {
        resultValue.selfMin = tempSelf;
    }
    if (resultValue.selfMax < tempSelf) {
        resultValue.selfMax = tempSelf;
    }
    resultValue.self = resultValue.self + tempSelf;
    resultValue.percent = resultValue.self / (resultValue.total / 100);

    return resultValue;
}

/**
 * Determines whether the cut spans belong together and then calculates the duration.
 */
function getDuration(lowestStartTime: number, duration: number, allOverlay: Span[]) {

    var didDelete = false;
    for (var i = 0; i < allOverlay.length; i++) {
        if (lowestStartTime + duration >= allOverlay[i].relativeStartTime) {
            if (lowestStartTime + duration < (allOverlay[i].relativeStartTime + allOverlay[i].duration)) {
                var tempDuration = (allOverlay[i].relativeStartTime + allOverlay[i].duration) - lowestStartTime + duration;
                duration = tempDuration;
            }
            allOverlay.splice(i, 1);
            didDelete = true;
            break;
        }
    }
    var result = { allOverlay: allOverlay, duration: duration, didDelete: didDelete };
    return result;
}

/**
 * Return the lowest startTime.
 */
function getLowestStartTime(allOverlay: Span[]) {

    var temp = _.minBy(allOverlay, function (a) {
        return a.relativeStartTime;
    });
    var result = { duration: temp!.duration, lowestStartTime: temp!.relativeStartTime };
    return result;
}

/**
 * Return the selfTime of overlay spans.
 */
function onlyOverlay(allOverlay: Span[], allChildren: Span[], tempSelf: number, span: Span) {

    var noOverlay = _.difference(allChildren, allOverlay);
    var lowestStartTime = 0;
    var duration = 0;
    var totalDuration = 0;
    var result = getLowestStartTime(allOverlay);
    lowestStartTime = result.lowestStartTime;
    duration = result.duration;
    var resultGetDuration = { allOverlay: allOverlay, duration: duration, didDelete: false };
    do {
        resultGetDuration = getDuration(lowestStartTime, duration, resultGetDuration.allOverlay);
        if (!resultGetDuration.didDelete && resultGetDuration.allOverlay.length > 0) {
            totalDuration = resultGetDuration.duration;
            var temp = getLowestStartTime(resultGetDuration.allOverlay);
            lowestStartTime = temp.lowestStartTime;
            duration = temp.duration;
        }
    } while (resultGetDuration.allOverlay.length > 1);
    duration = resultGetDuration.duration + totalDuration;
    // no cut is observed
    for (var i = 0; i < noOverlay.length; i++) {
        duration = duration + noOverlay[i].duration;
    }
    tempSelf = tempSelf + (span.duration - duration);

    return tempSelf;
}