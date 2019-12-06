import { Trace } from '../../../types/trace';
import { TableSpan } from './types'
import _ from 'lodash';

const serviceName = "Service Name";
const operationName = "Operation Name";
const others = "Others";

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
 */
function getValueTagIsPicked(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {

    var allSpans = trace.spans
    var availableTags = new Array();

    //add all Spans with this tag key
    for (var i = 0; i < tableValue.length; i++) {
        if (tableValue[i].name !== others) {
            for (var j = 0; j < allSpans.length; j++) {
                for (var l = 0; l < allSpans[j].tags.length; l++) {
                    if (tagDropdownTitle === allSpans[j].tags[l].key) {
                        availableTags.push(allSpans[j]);
                    }
                }
            }
        }
    }
    availableTags = [...new Set(availableTags)];

    var tags  = _(availableTags).map("tags").flatten().value();
    var tagKeys = _(tags).map("key").uniq().value();
    tagKeys = _.filter(tagKeys, function(o) { 
        return o != tagDropdownTitle; 
     });
    var availableTags = new Array();
    availableTags.push(serviceName);
    availableTags.push(operationName);
    availableTags = availableTags.concat(tagKeys);
   
    return availableTags;
}

/**
 * Used to get the values if no tag is picked from the first dropdown. 
 */
function getValueNoTagIsPicked(tableValue: TableSpan[], trace: Trace, tagDropdownTitle: string) {

    var availableTags = new Array();
    var allSpans = trace.spans;
    if (tagDropdownTitle === serviceName) {
        availableTags.push(operationName);
    } else {
        availableTags.push(serviceName);
    }
    for (var i = 0; i < allSpans.length; i++) {
        for (var j = 0; j < allSpans[i].tags.length; j++) {
            availableTags.push(allSpans[i].tags[j].key);
        }
    }
    availableTags = [... new Set(availableTags)];

    return availableTags;
}