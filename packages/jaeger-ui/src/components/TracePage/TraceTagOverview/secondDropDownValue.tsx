import React, { Component } from 'react';
import { TableSpan } from './types'
import { Trace } from '../../../types/trace';


/**
 * Return the value of the second dropdown
 * @param tableValue Actual table values
 * @param trace Whole information about the trace
 * @param tagDropdownTitle The title of the first dropdown. It is needed to find out what is being searched for
 */
export function getValue(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {
    if (tagDropdownTitle !== "Service Name" && tagDropdownTitle != "Operation Name") {
        return getValueTagIsPicked(tableValue, trace, tagDropdownTitle);
    } else {
        return getValueNoTagIsPicked(tableValue, trace, tagDropdownTitle);
    }
}


/**
 * Used to get the values if no tag is picked from the first dropdown.
 * @param tableValue 
 * @param trace 
 * @param tagDropdownTitle 
 */
function getValueTagIsPicked(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {

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
    availableTags.push("Service Name");
    availableTags.push("Operation Name");
    var iterator = list.values();
    for (var i = 0; i < list.size; i++) {
        availableTags.push(iterator.next().value)
    }
    return availableTags;
}

/**
 * Used to get the values if no tag is picked from the first dropdown.
 * @param tableValue 
 * @param trace 
 * @param tagDropdownTitle 
 */
function getValueNoTagIsPicked(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {

    var availableTagsS = new Set();
    var allSpans = trace.spans;
    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            availableTagsS.add(allSpans[i].tags[j].key);
        }
    }
    // set into array
    var availableTagsA = new Array();
    var iterator = availableTagsS.values();
    if (tagDropdownTitle === "Service Name") {
        availableTagsA.push("Operation Name");
    } else {
        availableTagsA.push("Service Name");
    }
    for (var i = 0; i < availableTagsS.size; i++) {
        availableTagsA.push(iterator.next().value)
    }
    return availableTagsA;
}

