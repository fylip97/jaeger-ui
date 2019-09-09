import React, { Component } from 'react';
import { Trace } from '../../../types/trace';
import { calculateContent } from '../DetailTraceTable/exclusivtime';



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

        var exc = 0;
        var excAvg = 0;
        var excMin = allSpans[0].duration;
        var excMax = 0;
        var name = ""+diffrentKeyValuesA[i];
        var count = 0;
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;

        var resultArray = [exc, excAvg, excMin, excMax, total, avg, min, max, count, percent];

        for (var j = 0; j < allSpansWithSelectedKey.length; j++) {
            for (var l = 0; l < allSpansWithSelectedKey[j].tags.length; l++) {
                if (diffrentKeyValuesA[i] === allSpansWithSelectedKey[j].tags[l].value) {

                    resultArray = calculateContent(allSpansWithSelectedKey, allSpans, j, resultArray, onePecent);
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
        }

        excAvg = (exc / count);
        avg = total / count;

        var oneColumn = {
            name: name, count: count, total: (Math.round((total / 1000) * 100) / 100),
            avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
            max: (Math.round((max / 1000) * 100) / 100), isDetail: false, key: name,
            exc: (Math.round((exc / 1000) * 100) / 100),
            excAvg: (Math.round((excAvg / 1000) * 100) / 100), excMin: (Math.round((excMin / 1000) * 100) / 100),
            excMax: (Math.round((excMax / 1000) * 100) / 100), percent: (Math.round((percent / 1) * 100) / 100),
            color: "", seachColor: "transparent"
        }

        allValuesColumn.push(oneColumn);

    }

    // last entry
    console.log(allSpansWithoutSelectedKey.length);

        var exc = 0;
        var excAvg = 0;
        var excMin = allSpans[0].duration;
        var excMax = 0;
        var count = 0;
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;
        var percent = 0;
        var allPercent = allSpans[0].duration;
        var onePecent = allPercent / 100;
        var resultArray = [exc, excAvg, excMin, excMax, total, avg, min, max, count, percent];
    for(var i =0; i<allSpansWithoutSelectedKey.length;i++){

        resultArray = calculateContent(allSpansWithoutSelectedKey, allSpans, i, resultArray, onePecent);
                    exc = resultArray[0];
                    excMin = resultArray[2];
                    excMax = resultArray[3];
                    total = resultArray[4];
                    min = resultArray[6];
                    max = resultArray[7];
                    count = resultArray[8];
                    percent = resultArray[9];

    }
    var oneColumn = {
        name: "rest", count: count, total: (Math.round((total / 1000) * 100) / 100),
        avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
        max: (Math.round((max / 1000) * 100) / 100), isDetail: false, key: "rest",
        exc: (Math.round((exc / 1000) * 100) / 100),
        excAvg: (Math.round((excAvg / 1000) * 100) / 100), excMin: (Math.round((excMin / 1000) * 100) / 100),
        excMax: (Math.round((excMax / 1000) * 100) / 100), percent: (Math.round((percent / 1) * 100) / 100),
        color: "", seachColor: "transparent"
    }

    allValuesColumn.push(oneColumn);


    return allValuesColumn;
}
