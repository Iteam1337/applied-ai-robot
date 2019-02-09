// Generated by BUCKLESCRIPT VERSION 4.0.18, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";
import * as ReasonReact from "reason-react/lib/es6/src/ReasonReact.js";

var component = ReasonReact.statelessComponent("Dropdown-ReactTemplate");

function make(onChange, options, value, _children) {
  return /* record */[
          /* debugName */component[/* debugName */0],
          /* reactClassInternal */component[/* reactClassInternal */1],
          /* handedOffState */component[/* handedOffState */2],
          /* willReceiveProps */component[/* willReceiveProps */3],
          /* didMount */component[/* didMount */4],
          /* didUpdate */component[/* didUpdate */5],
          /* willUnmount */component[/* willUnmount */6],
          /* willUpdate */component[/* willUpdate */7],
          /* shouldUpdate */component[/* shouldUpdate */8],
          /* render */(function (_self) {
              return React.createElement("select", {
                          value: value,
                          onChange: (function (e) {
                              return Curry._1(onChange, e.target.value);
                            })
                        }, React.createElement("option", {
                              value: ""
                            }, "Select a language"), Belt_Array.map(options, (function (value) {
                                return React.createElement("option", {
                                            key: value,
                                            value: value
                                          }, value);
                              })));
            }),
          /* initialState */component[/* initialState */10],
          /* retainedProps */component[/* retainedProps */11],
          /* reducer */component[/* reducer */12],
          /* jsElementWrapped */component[/* jsElementWrapped */13]
        ];
}

export {
  component ,
  make ,
  
}
/* component Not a pure module */
