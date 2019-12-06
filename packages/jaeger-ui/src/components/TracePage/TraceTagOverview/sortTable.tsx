import { TableSpan } from './types'
import * as _ from 'lodash';

/**
 * Sorts the table according to the key that is passed.
 * @param array Input which is sorted
 * @param key Which attribute is used for sorting
 * @param upDown How should the data be sorted? Up or down
 */
export function sortTable(array: any[], key: string, sortAsc: boolean) {

    var isDetailArray = [];
    var isNoDetail = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].isDetail) {
            isDetailArray.push(array[i]);
        } else {
            isNoDetail.push(array[i]);
        }
    }
    sortByKey(isNoDetail, key, sortAsc)
    var diffParentNames = new Array();
    for (var i = 0; i < isDetailArray.length; i++) {
        if (diffParentNames.length == 0) {
            diffParentNames.push(isDetailArray[i]);
        } else {
            var lookup = { "parentElement": isDetailArray[i].parentElement };
            var hasSameName = _.some(diffParentNames, lookup);
            if (!hasSameName) {
                diffParentNames.push(isDetailArray[i]);
            }
        }
    }
    for (var j = 0; j < diffParentNames.length; j++) {
        var tempArray = _.chain(isDetailArray).filter(filter_by => filter_by.parentElement == diffParentNames[j].parentElement).
            groupBy(x => x.parentElement).map((value, key) => ({ parentElement: key, groupedArry: value })).value()[0].groupedArry

        sortByKey(tempArray, key, sortAsc);
        if (tempArray.length > 0) {

            // build whole array
            var rememberIndex = 0;
            for (var i = 0; i < isNoDetail.length; i++) {
                if (isNoDetail[i].name === tempArray[0].parentElement) {
                    rememberIndex = i;
                }
            }
            for (var i = 0; i < tempArray.length; i++) {
                isNoDetail.splice(rememberIndex + 1, 0, tempArray[i]);
                rememberIndex += 1;
            }
        }
    }
    return isNoDetail;
}

/**
 * Sort 
 * @param array input whitch is sorted 
 * @param key attribut which is used for sorting
 * @param sortAsc Specifies the direction in which the sort is to take place. 
 */
export function sortByKey(array: TableSpan[], key: string, sortAsc: boolean) {
    return array.sort(function (a, b) {
        var x = (a as any)[key]; var y = (b as any)[key];
        if (sortAsc) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else {
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        }
    });
}
