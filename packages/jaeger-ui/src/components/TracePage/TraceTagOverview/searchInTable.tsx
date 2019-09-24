import { TableSpan } from './types'
import { all } from 'q';

/**
 * colors found entries in the table
 * @param uiFindVertexKeys Set of found spans
 * @param allTableSpans entries that are shown
 */
export function searchInTable(uiFindVertexKeys: Set<string>, allTableSpans: TableSpan[], uiFind: string | null | undefined) {

    for (var i = 0; i < allTableSpans.length; i++) {
        if ((!allTableSpans[i].isDetail) && allTableSpans[i].name !== "rest") {
            allTableSpans[i].searchColor = "transparent";
        } else if (allTableSpans[i].name !== "rest") {
            allTableSpans[i].searchColor = "#ECECEC";
        } else {
            allTableSpans[i].searchColor = "rgb(197,217,213)"
        }
    }
    if (typeof uiFindVertexKeys !== 'undefined') {
        uiFindVertexKeys!.forEach(function (value) {
            var uiFindVertexKeysSplit = value.split('');

            for (var i = 0; i < allTableSpans.length; i++) {
                    if ((uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(allTableSpans[i].name)) != -1) {
                        if (allTableSpans[i].parentElement === "none") {
                            allTableSpans[i].searchColor = "#FFF3D7";
                        }
                        else if (uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].indexOf(allTableSpans[i].parentElement) != -1) {
                            allTableSpans[i].searchColor = "#FFF3D7";

                        }
                    }    
            }
        });
    }
    if (uiFind != undefined || uiFind != null) {
        for (var i = 0; i < allTableSpans.length; i++) {
            if (allTableSpans[i].name.indexOf(uiFind!) != -1) {
                allTableSpans[i].searchColor = "#FFF3D7";

                for (var j = 0; j < allTableSpans.length; j++) {
                    if (allTableSpans[j].parentElement === allTableSpans[i].name) {
                        allTableSpans[j].searchColor = "#FFF3D7"
                    }
                }
                if (allTableSpans[i].isDetail) {
                    for (var j = 0; j < allTableSpans.length; j++) {
                        if (allTableSpans[i].parentElement === allTableSpans[j].name) {
                            allTableSpans[j].searchColor = "#FFF3D7"
                        }
                    }
                }


            }
        }
    }
    return allTableSpans;

}