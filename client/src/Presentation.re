let s = ReasonReact.string;

let component = ReasonReact.statelessComponent(__MODULE__);

module Style = {
  open Emotion;

  let presentation = [%css
    [
      position(`fixed),
      textAlign(`center),
      top(`pct(50.0)),
      transform(`translateY(`pct(-50.0))),
      width(`pct(100.0)),
    ]
  ];

  let transcription = [%css
    [
      color(`hsl((210, 99, 12))),
      fontSize(`px(100)),
      select(":not(:last-child)", [marginBottom(`px(60))]),
      select(
        ":nth-child(2)",
        [fontSize(`px(60)), color(`hsl((210, 20, 40)))],
      ),
      select(
        ":nth-child(3)",
        [fontSize(`px(40)), color(`hsl((210, 20, 60)))],
      ),
    ]
  ];

  let translations = [%css
    [
      display(`grid),
      margin3(`px(20), `auto, `zero),
      maxWidth(`vw(60.0)),
      gridTemplateColumns(`list([`repeat((`n(7), [`fr(1.0)]))])),
      gridRowGap(`px(10)),
    ]
  ];

  let translation = [%css
    [
      alignItems(`center),
      display(`flex),
      flexDirection(`column),
      fontSize(`px(16)),
      justifyContent(`center),
      select(":not(:last-child)", [marginRight(`px(20))]),
    ]
  ];

  let flag = [%css [marginRight(`px(10))]];
};

let make = (~translations: array(WebSocket.t), _children) => {
  ...component,
  render: _self => {
    <ul className=Style.presentation>
      {translations
       ->Belt.Array.keepMap(t => t.origin === Me ? Some(t) : None)
       ->Belt.Array.slice(~offset=0, ~len=3)
       ->Belt.Array.map(t =>
           <div
             className=Style.transcription key={t.timestamp->string_of_float}>
             {s(t.transcription)}
             <div className=Style.translations>
               {t.translations
                ->Belt.Array.map(trans =>
                    <div className=Style.translation key={trans.rawLanguage}>
                      <div className=Style.flag>
                        {s(Flag.flag(trans.language))}
                      </div>
                      {s(trans.text)}
                    </div>
                  )
                ->ReasonReact.array}
             </div>
           </div>
         )
       ->ReasonReact.array}
    </ul>;
  },
};
