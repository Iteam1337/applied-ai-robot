// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE

import * as Json_decode from "@glennsl/bs-json/lib/es6/src/Json_decode.bs.js";

function translation(json) {
  return /* record */[
          /* timestamp */Json_decode.field("timestamp", Json_decode.$$int, json),
          /* translation */Json_decode.field("translation", Json_decode.string, json),
          /* transcription */Json_decode.field("transcription", Json_decode.string, json)
        ];
}

function message(json) {
  return JSON.parse(Json_decode.field("data", Json_decode.string, json));
}

var Decode = /* module */[
  /* translation */translation,
  /* message */message
];

export {
  Decode ,
  
}
/* No side effect */
