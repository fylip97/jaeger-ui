import React from 'react';
import { TableSpan } from './types';

export function generateColor(allSpans: TableSpan[], colorToPercent: boolean) {

    for (var i = 0; i < allSpans.length; i++) {
        if (colorToPercent) {
            if (allSpans[i].isDetail) {
                
                //linear
                //var color = 236 - 166 * (allSpans[i].percent / 100);
                // 2 lineare funktionen:
                 var color;
                 if(allSpans[i].percent <40){
                     color = 236 - 80*(allSpans[i].percent /100);
                }else{
                    color = 236 -166*(allSpans[i].percent /100);
                }             
                var colorString = "rgb(236," + color + "," + color + ")";
                allSpans[i].colorToPercent = colorString;
            }
        } else {
            allSpans[i].colorToPercent = "rgb(236,236,236)"
        }
    }
    return allSpans;

}
