(this["webpackJsonpmemory-frontend"]=this["webpackJsonpmemory-frontend"]||[]).push([[0],[,,,,,,,,,,,,,function(t,e,s){},,,function(t,e,s){},function(t,e,s){},,function(t,e,s){},function(t,e,s){},function(t,e,s){},function(t,e,s){},function(t,e,s){},function(t,e,s){"use strict";s.r(e);var a=s(1),n=s.n(a),i=s(7),c=s.n(i),r=(s(13),s(2)),u=s(3),o=s(5),h=s(4),l=s(8),f=(s(16),s(17),s(0)),d=function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){return Object(r.a)(this,s),e.call(this,t)}return Object(u.a)(s,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"table",children:this.props.children})}}]),s}(n.a.Component),j=(s(19),function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){var a;return Object(r.a)(this,s),(a=e.call(this,t)).state={status:"open",checked:"",time:!0},a}return Object(u.a)(s,[{key:"check",value:function(){"checked"!==this.state.checked&&(this.setState(this.state={checked:"checked"}),"truth"===this.props.answer?this.props.changeParentFlag(1):"wrong"===this.props.answer&&this.props.changeParentFlag(-1))}},{key:"makeResult",value:function(){this.setState(this.state={status:"open",time:!1,checked:"checked"})}},{key:"render",value:function(){return console.log(this.state.time),Object(f.jsx)("div",{className:"card "+this.props.level,children:Object(f.jsxs)("div",{className:"item "+this.props.answer+" "+this.state.checked,children:[Object(f.jsx)("div",{className:"index "+this.state.status,children:this.props.index}),Object(f.jsx)("img",{className:"picture "+this.state.status,src:this.props.src,alt:""})]})})}},{key:"componentDidMount",value:function(){var t=this;!0===this.state.time&&setTimeout((function(){t.setState(t.state={status:"close"})}),7e3)}}]),s}(n.a.Component)),v=(s(20),function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){var a;return Object(r.a)(this,s),(a=e.call(this,t)).state={time:6,status:"invisible"},a}return Object(u.a)(s,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"wrap "+this.state.status,children:Object(f.jsx)("div",{className:"timer "+this.state.status,children:this.state.time})})}},{key:"componentDidMount",value:function(){var t=this,e=6,s=setInterval((function(){t.setState(t.state={time:e}),2===--e?t.setState(t.state={status:"visible"}):-1===e&&(t.setState(t.state={status:"invisible"}),clearInterval(s))}),1e3)}}]),s}(n.a.Component)),m=(s(21),function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){var a;return Object(r.a)(this,s),(a=e.call(this,t)).state={flag:0,num:0,visibility:"invisible"},a}return Object(u.a)(s,[{key:"makeResult",value:function(t,e){this.setState(this.state={flag:t,num:e,visibility:"visible"})}},{key:"render",value:function(){return Object(f.jsx)("div",{className:"result "+this.state.visibility,children:Object(f.jsxs)("div",{className:"result_container",children:[Object(f.jsx)("div",{className:"text",children:"\u0412\u0430\u0448 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442:"}),Object(f.jsx)("div",{className:"data",children:this.state.flag+" \u0438\u0437 "+this.state.num})]})})}}]),s}(n.a.Component)),b=(s(22),function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){return Object(r.a)(this,s),e.call(this,t)}return Object(u.a)(s,[{key:"render",value:function(){return Object(f.jsx)("button",{className:"level",children:Object(f.jsx)("div",{children:this.props.name})})}}]),s}(n.a.Component)),O=(s(23),function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){return Object(r.a)(this,s),e.call(this,t)}return Object(u.a)(s,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"container",children:this.props.children})}}]),s}(n.a.Component)),p=function(t){Object(o.a)(s,t);var e=Object(h.a)(s);function s(t){var a,i;return Object(r.a)(this,s),(a=e.call(this,t)).resultRef=n.a.createRef(),a.assistant=(i=function(){return a.getStateForAssistant()},Object(l.createAssistant)({getState:i})),a.assistant.on("data",(function(t){console.log("assistant.on(data)",t);var e=t.action;a.dispatchAssistantAction(e)})),a.assistant.on("start",(function(t){console.log("assistant.on(start)",t)})),a.state={cards:[],flag:0,status:"start",level:0,changeFlag:function(t){this.setState(this.state={flag:this.state.flag+t})},startGame:function(t){function e(t,e){return Math.floor(Math.random()*(e-t))+t}function s(t){this.setState(this.state={flag:this.state.flag+t})}var a=e(4,7),i=e(0,25);console.log(i),console.log(a);for(var c=new Set,r=new Set([i]),u=[],o=0;o<a;o++)for(;;){var h=e(0,t);if(!c.has(h)){c.add(h);break}}this.setState(this.state={status:"current",flag:t-a,level:t,changeFlag:s});for(var l=0;l<t;l++){var d="wrong",v=0;if(0!==a&&c.has(l))a--,d="truth",v=i;else for(;;)if(v=e(0,25),!r.has(v)){r.add(v);break}this["c"+l]=n.a.createRef(),u.push(Object(f.jsx)(j,{src:"https://pictures-for-memory-game.s3.eu-north-1.amazonaws.com/"+(v+1)+".jpg",index:l+1,status:"open",answer:d,level:"level_"+t,changeParentFlag:s.bind(this),time:!0,ref:this["c"+l]},l))}this.setState(this.state={cards:u})},finishGame:function(){for(var t=0;t<this.state.level;t++)this["c"+t].current.makeResult();this.resultRef.current.makeResult(this.state.flag,this.state.level),this.setState(this.state={status:"finish"})},restartGame:function(){this.setState(this.state={status:"start"})}},a}return Object(u.a)(s,[{key:"getStateForAssistant",value:function(){console.log("getStateForAssistant: this.state:",this.state);return{}}},{key:"dispatchAssistantAction",value:function(t){if(console.log("dispatchAssistantAction",t),t)switch(t.type){case"easy_level":return void("start"===this.state.status&&this.state.startGame.call(this,9));case"middle_level":return void("start"===this.state.status&&this.state.startGame.call(this,16));case"hard_level":return void("start"===this.state.status&&this.state.startGame.call(this,25));case"return_back":return void("finish"===this.state.status&&this.state.restartGame.call(this));case"check_answers":"current"===this.state.status&&this.state.finishGame.call(this);case"choose_num":return void("current"===this.state.status&&this["c"+(t.num-1)].current.check())}}},{key:"render",value:function(){return"start"===this.state.status?Object(f.jsx)("div",{className:"start_page",children:Object(f.jsxs)(O,{children:[Object(f.jsx)(b,{num:1,name:"\u043b\u0435\u0433\u043a\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c"}),Object(f.jsx)(b,{num:2,name:"\u0441\u0440\u0435\u0434\u043d\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c"}),Object(f.jsx)(b,{num:3,name:"\u0441\u043b\u043e\u0436\u043d\u044b\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c"})]})}):"current"===this.state.status||"finish"===this.state.status?Object(f.jsxs)(a.Fragment,{children:[Object(f.jsx)(v,{}),Object(f.jsx)(d,{children:this.state.cards}),Object(f.jsx)(m,{ref:this.resultRef})]}):void 0}}]),s}(n.a.Component),g=function(t){t&&t instanceof Function&&s.e(3).then(s.bind(null,25)).then((function(e){var s=e.getCLS,a=e.getFID,n=e.getFCP,i=e.getLCP,c=e.getTTFB;s(t),a(t),n(t),i(t),c(t)}))};c.a.render(Object(f.jsx)(n.a.StrictMode,{children:Object(f.jsx)(p,{})}),document.getElementById("root")),g()}],[[24,1,2]]]);
//# sourceMappingURL=main.f981876c.chunk.js.map