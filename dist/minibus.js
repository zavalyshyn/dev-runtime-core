// Runtime User Agent 

// version: 0.3.0

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.MiniBus=e()}}(function(){return function e(n,t,i){function r(o,u){if(!t[o]){if(!n[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(s)return s(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var f=t[o]={exports:{}};n[o][0].call(f.exports,function(e){var t=n[o][1][e];return r(t?t:e)},f,f.exports,e,n,t,i)}return t[o].exports}for(var s="function"==typeof require&&require,o=0;o<i.length;o++)r(i[o]);return r}({1:[function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),o=e("./Pipeline"),u=i(o),a=function(){function e(){r(this,e);var n=this;n._msgId=0,n._subscriptions={},n._responseTimeOut=3e3,n._responseCallbacks={},n._pipeline=new u["default"](function(e){console.log("PIPELINE-ERROR: ",JSON.stringify(e))}),n._registerExternalListener()}return s(e,[{key:"addListener",value:function(e,n){var t=this,i=new l(t._subscriptions,e,n),r=t._subscriptions[e];return r||(r=[],t._subscriptions[e]=r),r.push(i),i}},{key:"addResponseListener",value:function(e,n,t){this._responseCallbacks[e+n]=t}},{key:"removeResponseListener",value:function(e,n){delete this._responseCallbacks[e+n]}},{key:"removeAllListenersOf",value:function(e){delete this._subscriptions[e]}},{key:"postMessage",value:function(e,n){var t=this;return e.id&&0!==e.id||(t._msgId++,e.id=t._msgId),t._pipeline.process(e,function(e){if(n&&!function(){var i=e.from+e.id;t._responseCallbacks[i]=n,setTimeout(function(){var n=t._responseCallbacks[i];if(delete t._responseCallbacks[i],n){var r={id:e.id,type:"response",body:{code:"error",desc:"Response timeout!"}};n(r)}},t._responseTimeOut)}(),!t._onResponse(e)){var i=t._subscriptions[e.to];i?t._publishOn(i,e):t._onPostMessage(e)}}),e.id}},{key:"bind",value:function(e,n,t){var i=this,r=this,s=r.addListener(e,function(e){t.postMessage(e)}),o=t.addListener(n,function(e){r.postMessage(e)});return{thisListener:s,targetListener:o,unbind:function(){i.thisListener.remove(),i.targetListener.remove()}}}},{key:"_publishOn",value:function(e,n){e.forEach(function(e){e._callback(n)})}},{key:"_onResponse",value:function(e){var n=this;if("response"===e.type){var t=e.to+e.id,i=n._responseCallbacks[t];if(delete n._responseCallbacks[t],i)return i(e),!0}return!1}},{key:"_onMessage",value:function(e){var n=this;if(!n._onResponse(e)){var t=n._subscriptions[e.to];t?n._publishOn(t,e):(t=n._subscriptions["*"],t&&n._publishOn(t,e))}}},{key:"_onPostMessage",value:function(e){}},{key:"_registerExternalListener",value:function(){}},{key:"pipeline",get:function(){return this._pipeline}}]),e}(),l=function(){function e(n,t,i){r(this,e);var s=this;s._subscriptions=n,s._url=t,s._callback=i}return s(e,[{key:"remove",value:function(){var e=this,n=e._subscriptions[e._url];if(n){var t=n.indexOf(e);n.splice(t,1),0===n.length&&delete e._subscriptions[e._url]}}},{key:"url",get:function(){return this._url}}]),e}();t["default"]=a,n.exports=t["default"]},{"./Pipeline":2}],2:[function(e,n,t){"use strict";function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),s=function(){function e(n){i(this,e);var t=this;t.handlers=[],t.onFail=n}return r(e,[{key:"process",value:function(e,n){var t=this;if(t.handlers.length>0){var i=new u(t.handlers);i.next(new o(t,i,e,n))}else n(e)}}]),e}(),o=function(){function e(n,t,r,s){i(this,e);var o=this;o._inStop=!1,o._pipeline=n,o._iter=t,o._msg=r,o._onDeliver=s}return r(e,[{key:"next",value:function(){var e=this;e._inStop||(e._iter.hasNext?e._iter.next(e):e._onDeliver(e._msg))}},{key:"deliver",value:function(){var e=this;e._inStop||(e._inStop=!0,e._onDeliver(e._msg))}},{key:"fail",value:function(e){var n=this;n._inStop||(n._inStop=!0,n._pipeline.onFail&&n._pipeline.onFail(e))}},{key:"pipeline",get:function(){return this._pipeline}},{key:"msg",get:function(){return this._msg},set:function(e){this._msg=e}}]),e}(),u=function(){function e(n){i(this,e),this._index=-1,this._array=n}return r(e,[{key:"hasNext",get:function(){return this._index<this._array.length-1}},{key:"next",get:function(){return this._index++,this._array[this._index]}}]),e}();t["default"]=s,n.exports=t["default"]},{}],3:[function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=e("./bus/MiniBus"),s=i(r);t["default"]=s["default"],n.exports=t["default"]},{"./bus/MiniBus":1}]},{},[3])(3)});