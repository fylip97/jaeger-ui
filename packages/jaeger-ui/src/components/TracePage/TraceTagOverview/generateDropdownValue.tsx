import { Trace } from '../../../types/trace';
import { TableSpan } from './types'
import _ from 'lodash';

const serviceName = "Service Name";
const operationName = "Operation Name";

export function generateDropdownValue(trace: Trace) {

    const allSpans = trace.spans;
    const tags = _(allSpans).map("tags").flatten().value();
    const tagKeys = _(tags).map("key").uniq().value();
    const values = _.concat(serviceName, operationName, tagKeys);
    return values;
}

export function generateSecondDropdownValue(tableValue: TableSpan[], trace: Trace, dropdownTestTitle1: string, ) {

    if (dropdownTestTitle1 !== serviceName && dropdownTestTitle1 != operationName) {
        return getValueTagIsPicked(tableValue, trace, dropdownTestTitle1);
    } else {
        return getValueNoTagIsPicked(tableValue, trace, dropdownTestTitle1);
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
        if (tableValue[i].name !== 'Others') {
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
    availableTags.push(serviceName);
    availableTags.push(operationName);
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
    if (tagDropdownTitle === serviceName) {
        availableTagsA.push(operationName);
    } else {
        availableTagsA.push(serviceName);
    }
    for (var i = 0; i < availableTagsS.size; i++) {
        availableTagsA.push(iterator.next().value)
    }
    return availableTagsA;
}