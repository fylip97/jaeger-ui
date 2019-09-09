import React, { Component } from 'react';
import { TableSpan } from './types'
import { Trace } from '../../../types/trace';

export function getValue(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {

    var allSpans = trace.spans
    var list = new Set();
    var availableTags = new Array();

    //add all Spans with this tag key
    for (var i = 0; i < tableValue.length; i++) {
        if (tableValue[i].name !== 'rest') {
            for (var j = 0; j < allSpans.length; j++) {
                for (var l = 0; l < allSpans[j].tags.length; l++) {
                    if (tagDropdownTitle === allSpans[j].tags[l].key) {

                        list.add(allSpans[j]);
                    }
                }
            }
        }
    }

    var iterator = list.values();
    for (var i = 0; i < list.size; i++) {
        availableTags.push(iterator.next().value)
    }
    list = new Set();
    for (var i = 0; i < availableTags.length; i++) {
        for (var j = 0; j < availableTags[i].tags.length; j++) {
            if (tagDropdownTitle !== availableTags[i].tags[j].key) {
                list.add(availableTags[i].tags[j].key);
            }
        }
    }

    var availableTags = new Array();
    var iterator = list.values();
    for (var i = 0; i < list.size; i++) {
        availableTags.push(iterator.next().value)
    }
    console.log(availableTags);
    return availableTags;


}