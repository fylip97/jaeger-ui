import React, { Component } from 'react';
import colorGenerator from '../../../utils/color-generator';
import { Span, Trace } from '../../../types/trace';


export function getDetailTableContent(span1: Span[], span2: Span[], wholeTrace: Span[], selectedName: string) {
    var addItemArray = new Array();

    for (var i = 0; i < span1.length; i++) {

        var exc = 0;
        var excAvg = 0;
        var excMin = span2[0].duration;
        var excMax = 0;
        var total = 0;
        var count = 0;
        var avg = 0;
        var min = span2[0].duration;
        var max = 0;
        var color;

        var resultArray = new Array();

        resultArray.push(exc);
        resultArray.push(excAvg);
        resultArray.push(excMin);
        resultArray.push(excMax);
        resultArray.push(total);
        resultArray.push(avg);
        resultArray.push(min);
        resultArray.push(max);
        resultArray.push(count);

        for (var j = 0; j < span2.length; j++) {
            if (span1[i].process.serviceName === span2[j].process.serviceName) {

                resultArray = calculateContent(span2, wholeTrace, j, resultArray);
                exc = resultArray[0];
                excMin = resultArray[2];
                excMax = resultArray[3];
                total = resultArray[4];
                min = resultArray[6];
                max = resultArray[7];
                count = resultArray[8];
            }

        }
        avg = total / count;
        excAvg = exc / count;

        color = colorGenerator.getColorByKey(span1[i].process.serviceName)

        var safeItem = {
            name: span1[i].process.serviceName, count: count,
            total: (Math.round((total / 1000) * 100) / 100).toFixed(2), avg: (Math.round((avg / 1000) * 100) / 100).toFixed(2),
            min: (Math.round((min / 1000) * 100) / 100).toFixed(2),
            max: (Math.round((max / 1000) * 100) / 100).toFixed(2), isDetail: true, key: span1[i].operationName + i,
            child: false, parentElement: selectedName, exc: (Math.round((exc / 1000) * 100) / 100).toFixed(2),
            excAvg: (Math.round((excAvg / 1000) * 100) / 100).toFixed(2), excMin: (Math.round((excMin / 1000) * 100) / 100).toFixed(2),
            excMax: (Math.round((excMax / 1000) * 100) / 100).toFixed(2),
            color: color, seachColor: "red"
        };

        addItemArray.push(safeItem);
    }

    return addItemArray;
}


export function fullTableContent(span1: string[], span2: Span[]) {

    var allSpansTrace = new Array();

    for (var i = 0; i < span1.length; i++) {

        var exc = 0;
        var excAvg = 0;
        var excMin = span2[0].duration;
        var excMax = 0;
        //avg && min && max
        var total = 0;
        var avg = 0;
        var min = span2[0].duration;
        var max = 0;
        var count = 0;

        var resultArray = new Array();

        resultArray.push(exc);
        resultArray.push(excAvg);
        resultArray.push(excMin);
        resultArray.push(excMax);
        resultArray.push(total);
        resultArray.push(avg);
        resultArray.push(min);
        resultArray.push(max);
        resultArray.push(count);


        for (var j = 0; j < span2.length; j++) {
            if (span1[i] === span2[j].operationName) {
                resultArray = calculateContent(span2, span2, j, resultArray);
                exc = resultArray[0];
                excMin = resultArray[2];
                excMax = resultArray[3];
                total = resultArray[4];
                min = resultArray[6];
                max = resultArray[7];
                count = resultArray[8];
            }

        }

        excAvg = (exc / count);
        avg = total / count;

        var tableSpan = {
            name: span1[i], count: count, total: (Math.round((total / 1000) * 100) / 100),
            avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
            max: (Math.round((max / 1000) * 100) / 100), isDetail: false, key: span1[i], child: false, parentElement: "none",
            exc: (Math.round((exc / 1000) * 100) / 100),
            excAvg: (Math.round((excAvg / 1000) * 100) / 100), excMin: (Math.round((excMin / 1000) * 100) / 100),
            excMax: (Math.round((excMax / 1000) * 100) / 100),
            color: "", seachColor: "transparent"
        };

        allSpansTrace.push(tableSpan);
    }
    return allSpansTrace;
}


function calculateContent(span: Span[], wholeTrace: Span[], j: number, resultArray: number[]) {

    resultArray[8] += 1;
    resultArray[4] += span[j].duration;
    if (resultArray[6] > span[j].duration) {
        resultArray[6] = span[j].duration;
    }
    if (resultArray[7] < span[j].duration) {
        resultArray[7] = span[j].duration;
    }

    //For each Span with the same operationName 
    //Do I have children?
    if (span[j].hasChildren) {
        var sumAllChildInSpan = 0;
        // if I have children then look for my children
        for (var l = 0; l < wholeTrace.length; l++) {
            //i am a child?
            if (wholeTrace[l].references.length == 1) {
                //ia am a child of this span?
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

    return resultArray;

}
