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


