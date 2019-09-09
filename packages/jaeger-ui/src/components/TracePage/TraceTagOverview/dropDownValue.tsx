import React, { Component } from 'react';
import { Trace } from '../../../types/trace';


export function getValue(trace: Trace) {

    var allTagKeys = new Set();


    var allSpans = trace.spans;

    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            allTagKeys.add(allSpans[i].tags[j].key);
        }
    }

    var allTagKeysA = new Array();
    var iterator = allTagKeys.values();
    for (var i = 0; i < allTagKeys.size; i++) {
        allTagKeysA.push(iterator.next().value)
    }
    return allTagKeysA;
}


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

    //console.log(diffrentKeyValuesA);
    //find values for column

    var allValuesColumn = Array();
    for (var i = 0; i < diffrentKeyValuesA.length; i++) {

        var name = diffrentKeyValuesA[i];
        var count = 0;
        var total = 0;
        var avg = 0;
        var min = allSpans[0].duration;
        var max = 0;

        for (var j = 0; j < allSpansWithSelectedKey.length; j++) {
            for (var l = 0; l < allSpansWithSelectedKey[j].tags.length; l++) {
                if (diffrentKeyValuesA[i] === allSpansWithSelectedKey[j].tags[l].value) {

                    count += 1;
                    total += allSpansWithSelectedKey[j].duration;

                    if (min > allSpansWithSelectedKey[j].duration) {
                        min = allSpansWithSelectedKey[j].duration;
                    }

                    if (max < allSpansWithSelectedKey[j].duration) {
                        max = allSpansWithSelectedKey[j].duration;
                    }
                }
            }
        }

        avg = total / count;

        var oneColumn = {
            name: name, count: count, total: Math.round((total / 1000) * 100) / 100,
            avg: Math.round((avg / 1000) * 100) / 100, min: Math.round((min / 1000) * 100) / 100, max: Math.round((max / 1000) * 100) / 100
        }

        allValuesColumn.push(oneColumn)

    }
    console.log(allValuesColumn);
    
    return allValuesColumn;


}