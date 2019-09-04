import React, { Component } from 'react';
import colorGenerator from '../../../utils/color-generator';
import { Span} from '../../../types/trace';
import { TableSpan } from './types'


/**
 * preprocessing the data if a column was clicked
 * @param allSpans content that already exists
 * @param rememberIndex position of the column in the table
 * @param wholeTraceSpans whole trace information
 * @param selectedSpan whole information of the clicked column
 * @param sameOperationName all spans with the same operation name
 * @param diffServiceName all spans with diffrent operation name 
 */

export function isNotClicked(allSpans: TableSpan[], rememberIndex: number, wholeTraceSpans: Span[],selectedSpan: TableSpan, sameOperationName: Span[], diffServiceName: Span[]){

    allSpans[rememberIndex].child = true;
    for (var i = 0; i < wholeTraceSpans.length; i++) {
      if (wholeTraceSpans[i].operationName === selectedSpan.name) {
        sameOperationName.push(wholeTraceSpans[i]);
      }
    }

    for (var i = 0; i < sameOperationName.length; i++) {
      if (diffServiceName.length == 0) {
        diffServiceName.push(sameOperationName[i]);
      } else {
        var remember = false;
        for (var j = 0; j < diffServiceName.length; j++) {
          if (diffServiceName[j].process.serviceName === sameOperationName[i].process.serviceName) {
            remember = true;
          }
        } if (!remember) {
          diffServiceName.push(sameOperationName[i]);
        }
      }
    }
    var returnArray = new Array();
    returnArray.push(diffServiceName);
    returnArray.push(sameOperationName);
    
    return returnArray;
  }

/**
 * get the clicked detail table content
 * @param span1 all Spans with diffrent operation name
 * @param span2 all Spans with same operation name
 * @param wholeTrace whole information about the trace
 * @param selectedName information of the clicked column
 */

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
        var percent = -1;
        var allPercent = wholeTrace[0].duration;
        var onePecent = allPercent / 100;
        var color;
        var resultArray = [exc,excAvg,excMin,excMax,total,avg,min,max,count,percent];

        for (var j = 0; j < span2.length; j++) {
            if (span1[i].process.serviceName === span2[j].process.serviceName) {

                resultArray = calculateContent(span2, wholeTrace, j, resultArray, onePecent);
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
            excMax: (Math.round((excMax / 1000) * 100) / 100).toFixed(2), percent: (Math.round((percent/1)*100)/100),
            color: color, seachColor: "#ECECEC"
        };
        addItemArray.push(safeItem);
    }

    return addItemArray;
}

/**
 * create the table content if no further column is called (is called by the constructor)
 * @param span1 all Spans with diffrent operation name
 * @param span2 all Spans 
 */

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
        var percent = 0;
        var allPercent = span2[0].duration;
        var onePecent = allPercent / 100;  
        var resultArray=[exc, excAvg,excMin,excMax,total,avg,min,max,count,percent];

        for (var j = 0; j < span2.length; j++) {
            if (span1[i] === span2[j].operationName) {
                resultArray = calculateContent(span2, span2, j, resultArray, onePecent);
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
            name: span1[i], count: count, total: (Math.round((total / 1000) * 100) / 100),
            avg: (Math.round((avg / 1000) * 100) / 100), min: Math.round((min / 1000) * 100) / 100,
            max: (Math.round((max / 1000) * 100) / 100), isDetail: false, key: span1[i], child: false, parentElement: "none",
            exc: (Math.round((exc / 1000) * 100) / 100),
            excAvg: (Math.round((excAvg / 1000) * 100) / 100), excMin: (Math.round((excMin / 1000) * 100) / 100),
            excMax: (Math.round((excMax / 1000) * 100) / 100), percent: (Math.round((percent/1)*100)/100),
            color: "", seachColor: "transparent"
        };
        allSpansTrace.push(tableSpan);
    }
    return allSpansTrace;
}

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

function calculateContent(span: Span[], wholeTrace: Span[], j: number, resultArray: number[], onePercent: number) {

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
