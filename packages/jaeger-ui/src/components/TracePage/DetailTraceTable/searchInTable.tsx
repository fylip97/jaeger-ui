import { TableSpan } from './types'

/**
 * colors found entries in the table
 * @param uiFindVertexKeys Set of found spans
 * @param allTableSpans entries that are shown
 */
export function searchInTable(uiFindVertexKeys: Set<string>, allTableSpans: TableSpan[]) {

    for (var i = 0; i < allTableSpans.length; i++) {
        if (allTableSpans[i].parentElement === 'none') {
            allTableSpans[i].searchColor = "transparent";
        } else {
            allTableSpans[i].searchColor = "#ECECEC";
        }
    }
    if (typeof uiFindVertexKeys !== 'undefined') {
        uiFindVertexKeys!.forEach(function (value) {
            var uiFindVertexKeysSplit = value.split('');
            for (var i = 0; i < allTableSpans.length; i++) {
                if ((uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].search(allTableSpans[i].name)) != -1) {
                    if (allTableSpans[i].parentElement === "none") {
                        allTableSpans[i].searchColor = "#FFF3D7";
                    }
                    else if (uiFindVertexKeysSplit[uiFindVertexKeysSplit.length - 1].search(allTableSpans[i].parentElement) != -1) {
                        allTableSpans[i].searchColor = "#FFF3D7";

                    }
                }
            }

        });
    }

}