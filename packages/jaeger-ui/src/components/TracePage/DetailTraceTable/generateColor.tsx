import React from 'react';
import { TableSpan } from './types';



export function generateColor(allSpans: TableSpan[], colorToPercent: boolean) {

    for (var i = 0; i < allSpans.length; i++) {
        if (colorToPercent) {
            if (allSpans[i].isDetail) {
                var color = 204 - 204 * (allSpans[i].percent / 100);
                var colorString = "rgb(204," + color + "," + color + ")";
                allSpans[i].colorToPercent = colorString;
            }
        } else {
            allSpans[i].colorToPercent = "rgb(204,204,204)"
        }
    }
    return allSpans;

}
