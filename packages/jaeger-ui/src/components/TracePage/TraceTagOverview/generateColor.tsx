import { TableSpan } from './types';

/**
 * Generates the background color according to the percentage.
 * @param allSpans 
 * @param colorToPercent 
 */
export function generateColor(allSpans: TableSpan[], colorToPercent: boolean) {
    for (var i = 0; i < allSpans.length; i++) {
        if (colorToPercent) {
            if (allSpans[i].isDetail) {
                var color;
                if (allSpans[i].percent < 40) {
                    color = 236 - 80 * (allSpans[i].percent / 100);
                } else {
                    color = 236 - 166 * (allSpans[i].percent / 100);
                }
                var colorString = "rgb(248," + color + "," + color + ")";
                allSpans[i].colorToPercent = colorString;
            }
        } else {
            allSpans[i].colorToPercent = "rgb(248,248,248)"
        }
    }
    //return allSpans;
}
