import { Trace } from '../../../types/trace';
import prefixUrl from '../../../utils/prefix-url';


export function getJSON(trace:Trace){
    var traceID = trace.traceID;
    var traceJSON = "aaaa";

fetch(prefixUrl(`/api/traces/${traceID}?raw=true&prettyPrint=true`))
      .then(res => res.json())
      .then(
        (result) => {
            traceJSON= JSON.stringify(result);
            return traceJSON
        },
        (error) => {
          traceJSON= "Error";
          return traceJSON;
        }
      )
   
}