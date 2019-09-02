import React, { Component } from 'react';
import { TableSpan } from './types'


export function sortTable(array: TableSpan[], key: string, upDown: string) {
    var isDetailArray = new Array();
    var isNoDetail = new Array();

    for (var i = 0; i < array.length; i++) {
        if (array[i].isDetail == true) {
            isDetailArray.push(array[i]);
        } else {
            isNoDetail.push(array[i]);
        }

    }
    if (upDown === "Up") {
        isNoDetail = sortByKeyUp(isNoDetail, key);
    } else {
        isNoDetail = sortByKeyDown(isNoDetail, key);
    }

    var diffParentNames = new Array();
    for (var i = 0; i < isDetailArray.length; i++) {
        if (diffParentNames.length == 0) {
            diffParentNames.push(isDetailArray[i]);
        } else {
            var sameName = false;
            for (var j = 0; j < diffParentNames.length; j++) {
                if (diffParentNames[j].parentElement === isDetailArray[i].parentElement) {
                    sameName = true;
                }
            }
            if (!sameName) {
                diffParentNames.push(isDetailArray[i]);
            }
        }

    }

    var tempArray = new Array();
    for (var j = 0; j < diffParentNames.length; j++) {
        tempArray = groupBy(isDetailArray, diffParentNames[j].parentElement)

        if (upDown === "Up") {
            tempArray = sortByKeyUp(tempArray, key);
        } else {
            tempArray = sortByKeyDown(tempArray, key);
        }

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
 * fgfgf
 * @param tempArray gdfgf 
 * @param key gfg
 */
function groupBy(tempArray: TableSpan[], key: string) {
    var groupedArray = new Array();
    for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i].parentElement === key) {
            groupedArray.push(tempArray[i]);
        }
    }
    return groupedArray;
}

function sortByKeyUp(array: TableSpan[], key: string) {

    //sort 
    return array.sort(function (a, b) {
        var x = (a as any)[key]; var y = (b as any)[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function sortByKeyDown(array: TableSpan[], key: string) {
    return array.sort(function (a, b) {
        var x = (a as any)[key]; var y = (b as any)[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}


