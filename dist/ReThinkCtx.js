/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Distribution file for ReThinkCtx.js 
// version: 0.7.1
// Last build: Tue Dec 06 2016 16:09:56 GMT+0000 (WET)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.ReThinkCtx=e()}}(function(){return function e(t,n,r){function o(u,c){if(!n[u]){if(!t[u]){var s="function"==typeof require&&require;if(!c&&s)return s(u,!0);if(i)return i(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var a=n[u]={exports:{}};t[u][0].call(a.exports,function(e){var n=t[u][1][e];return o(n?n:e)},a,a.exports,e,t,n,r)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(e,t,n){t.exports={default:e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":6}],2:[function(e,t,n){t.exports={default:e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":7}],3:[function(e,t,n){t.exports={default:e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":8}],4:[function(e,t,n){"use strict";n.__esModule=!0,n.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],5:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}n.__esModule=!0;var o=e("../core-js/object/define-property"),i=r(o);n.default=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,i.default)(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()},{"../core-js/object/define-property":2}],6:[function(e,t,n){var r=e("../../modules/_core"),o=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(e){return o.stringify.apply(o,arguments)}},{"../../modules/_core":13}],7:[function(e,t,n){e("../../modules/es6.object.define-property");var r=e("../../modules/_core").Object;t.exports=function(e,t,n){return r.defineProperty(e,t,n)}},{"../../modules/_core":13,"../../modules/es6.object.define-property":41}],8:[function(e,t,n){e("../../modules/es6.object.keys"),t.exports=e("../../modules/_core").Object.keys},{"../../modules/_core":13,"../../modules/es6.object.keys":42}],9:[function(e,t,n){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],10:[function(e,t,n){var r=e("./_is-object");t.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},{"./_is-object":26}],11:[function(e,t,n){var r=e("./_to-iobject"),o=e("./_to-length"),i=e("./_to-index");t.exports=function(e){return function(t,n,u){var c,s=r(t),f=o(s.length),a=i(u,f);if(e&&n!=n){for(;f>a;)if(c=s[a++],c!=c)return!0}else for(;f>a;a++)if((e||a in s)&&s[a]===n)return e||a||0;return!e&&-1}}},{"./_to-index":34,"./_to-iobject":36,"./_to-length":37}],12:[function(e,t,n){var r={}.toString;t.exports=function(e){return r.call(e).slice(8,-1)}},{}],13:[function(e,t,n){var r=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},{}],14:[function(e,t,n){var r=e("./_a-function");t.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},{"./_a-function":9}],15:[function(e,t,n){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],16:[function(e,t,n){t.exports=!e("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":20}],17:[function(e,t,n){var r=e("./_is-object"),o=e("./_global").document,i=r(o)&&r(o.createElement);t.exports=function(e){return i?o.createElement(e):{}}},{"./_global":21,"./_is-object":26}],18:[function(e,t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],19:[function(e,t,n){var r=e("./_global"),o=e("./_core"),i=e("./_ctx"),u=e("./_hide"),c="prototype",s=function(e,t,n){var f,a,l,d=e&s.F,p=e&s.G,_=e&s.S,y=e&s.P,b=e&s.B,h=e&s.W,v=p?o:o[t]||(o[t]={}),g=v[c],m=p?r:_?r[t]:(r[t]||{})[c];p&&(n=t);for(f in n)a=!d&&m&&void 0!==m[f],a&&f in v||(l=a?m[f]:n[f],v[f]=p&&"function"!=typeof m[f]?n[f]:b&&a?i(l,r):h&&m[f]==l?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t[c]=e[c],t}(l):y&&"function"==typeof l?i(Function.call,l):l,y&&((v.virtual||(v.virtual={}))[f]=l,e&s.R&&g&&!g[f]&&u(g,f,l)))};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},{"./_core":13,"./_ctx":14,"./_global":21,"./_hide":23}],20:[function(e,t,n){t.exports=function(e){try{return!!e()}catch(e){return!0}}},{}],21:[function(e,t,n){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},{}],22:[function(e,t,n){var r={}.hasOwnProperty;t.exports=function(e,t){return r.call(e,t)}},{}],23:[function(e,t,n){var r=e("./_object-dp"),o=e("./_property-desc");t.exports=e("./_descriptors")?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},{"./_descriptors":16,"./_object-dp":27,"./_property-desc":31}],24:[function(e,t,n){t.exports=!e("./_descriptors")&&!e("./_fails")(function(){return 7!=Object.defineProperty(e("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":16,"./_dom-create":17,"./_fails":20}],25:[function(e,t,n){var r=e("./_cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},{"./_cof":12}],26:[function(e,t,n){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],27:[function(e,t,n){var r=e("./_an-object"),o=e("./_ie8-dom-define"),i=e("./_to-primitive"),u=Object.defineProperty;n.f=e("./_descriptors")?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return u(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},{"./_an-object":10,"./_descriptors":16,"./_ie8-dom-define":24,"./_to-primitive":39}],28:[function(e,t,n){var r=e("./_has"),o=e("./_to-iobject"),i=e("./_array-includes")(!1),u=e("./_shared-key")("IE_PROTO");t.exports=function(e,t){var n,c=o(e),s=0,f=[];for(n in c)n!=u&&r(c,n)&&f.push(n);for(;t.length>s;)r(c,n=t[s++])&&(~i(f,n)||f.push(n));return f}},{"./_array-includes":11,"./_has":22,"./_shared-key":32,"./_to-iobject":36}],29:[function(e,t,n){var r=e("./_object-keys-internal"),o=e("./_enum-bug-keys");t.exports=Object.keys||function(e){return r(e,o)}},{"./_enum-bug-keys":18,"./_object-keys-internal":28}],30:[function(e,t,n){var r=e("./_export"),o=e("./_core"),i=e("./_fails");t.exports=function(e,t){var n=(o.Object||{})[e]||Object[e],u={};u[e]=t(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},{"./_core":13,"./_export":19,"./_fails":20}],31:[function(e,t,n){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],32:[function(e,t,n){var r=e("./_shared")("keys"),o=e("./_uid");t.exports=function(e){return r[e]||(r[e]=o(e))}},{"./_shared":33,"./_uid":40}],33:[function(e,t,n){var r=e("./_global"),o="__core-js_shared__",i=r[o]||(r[o]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./_global":21}],34:[function(e,t,n){var r=e("./_to-integer"),o=Math.max,i=Math.min;t.exports=function(e,t){return e=r(e),e<0?o(e+t,0):i(e,t)}},{"./_to-integer":35}],35:[function(e,t,n){var r=Math.ceil,o=Math.floor;t.exports=function(e){return isNaN(e=+e)?0:(e>0?o:r)(e)}},{}],36:[function(e,t,n){var r=e("./_iobject"),o=e("./_defined");t.exports=function(e){return r(o(e))}},{"./_defined":15,"./_iobject":25}],37:[function(e,t,n){var r=e("./_to-integer"),o=Math.min;t.exports=function(e){return e>0?o(r(e),9007199254740991):0}},{"./_to-integer":35}],38:[function(e,t,n){var r=e("./_defined");t.exports=function(e){return Object(r(e))}},{"./_defined":15}],39:[function(e,t,n){var r=e("./_is-object");t.exports=function(e,t){if(!r(e))return e;var n,o;if(t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;if("function"==typeof(n=e.valueOf)&&!r(o=n.call(e)))return o;if(!t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":26}],40:[function(e,t,n){var r=0,o=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++r+o).toString(36))}},{}],41:[function(e,t,n){var r=e("./_export");r(r.S+r.F*!e("./_descriptors"),"Object",{defineProperty:e("./_object-dp").f})},{"./_descriptors":16,"./_export":19,"./_object-dp":27}],42:[function(e,t,n){var r=e("./_to-object"),o=e("./_object-keys");e("./_object-sap")("keys",function(){return function(e){return o(r(e))}})},{"./_object-keys":29,"./_object-sap":30,"./_to-object":38}],43:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var o=e("babel-runtime/helpers/classCallCheck"),i=r(o),u=e("babel-runtime/helpers/createClass"),c=r(u),s=e("../utils/utils"),f=function(){function e(){(0,i.default)(this,e),this.defaultBehaviour=!0,this.groups={}}return(0,c.default)(e,[{key:"scheme",get:function(){return this._scheme},set:function(e){var t=e.message.from;(0,s.isDataObjectURL)(t)?this._scheme=(0,s.divideURL)(t).type:this._scheme=void 0}},{key:"date",get:function(){return this._date},set:function(e){var t=new Date,n=String(t.getDate());1===n.length&&(n="0"+n);var r=String(t.getMonth()+1);1===r.length&&(r="0"+r),this._date=n+"/"+r+"/"+t.getFullYear()}},{key:"domain",get:function(){return this._domain},set:function(e){void 0!==e.message.body.identity&&(this._domain=(0,s.divideEmail)(e.message.body.identity.userProfile.username).domain)}},{key:"type",get:function(){return this._type},set:function(e){var t=e.message;void 0!==t.body.value&&(this._type=t.body.value.resourceType)}},{key:"source",get:function(){return this._source},set:function(e){void 0!==e.message.body.identity&&(this._source=e.message.body.identity.userProfile.username)}},{key:"time",get:function(){return this._time},set:function(e){e=new Date;var t=String(e.getMinutes());1===t.length&&(t="0"+t),this._time=parseInt(String(e.getHours())+t)}},{key:"weekday",get:function(){return this._weekday},set:function(e){this._weekday=String((new Date).getDay())}}]),e}();n.default=f,t.exports=n.default},{"../utils/utils":44,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],44:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,n="$1,$2,$3",r=e.replace(t,n).split(",");r[0]===e&&(r[0]="https",r[1]=e);var o={type:r[0],domain:r[1],identity:r[2]};return o}function i(e){var t=e.indexOf("@"),n={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return n}function u(e){return!((0,x.default)(e).length>0)}function c(e){if(e)return JSON.parse((0,m.default)(e))}function s(e){var t=e.split("/");return t[0]+"//"+t[2]+"/"+t[3]}function f(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function a(e){var t=o(e);return t.identity.replace("/","")+"@"+t.domain}function l(e){if("user://"===e.substring(0,7)){var t=o(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return f(e)}function d(e){var t=["domain-idp","runtime","domain","hyperty"],n=e.split("://"),r=n[0];return t.indexOf(r)===-1}function p(e){return e.split("/").length>=3}function _(e){return"user"===o(e).type}function y(e){return"hyperty"===o(e).type}function b(e,t,n){var r=e[t],o=r[n];return o}function h(e,t,n,r){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],i=e[t],u=void 0;if(!i.hasOwnProperty(n))throw Error("The configuration "+(0,m.default)(i,"",2)+" don't have the "+n+" resource you are looking for");var c=i[n];return r?(u=c.prefix+e.domain+c.suffix+r,c.hasOwnProperty("fallback")&&o&&(u=c.fallback.indexOf("%domain%")?c.fallback.replace(/(%domain%)/g,e.domain)+r:c.fallback+r)):u=c.prefix+e.domain+c.suffix,u}function v(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}Object.defineProperty(n,"__esModule",{value:!0});var g=e("babel-runtime/core-js/json/stringify"),m=r(g),j=e("babel-runtime/core-js/object/keys"),x=r(j);n.divideURL=o,n.divideEmail=i,n.emptyObject=u,n.deepClone=c,n.removePathFromURL=s,n.getUserURLFromEmail=f,n.getUserEmailFromURL=a,n.convertToUserURL=l,n.isDataObjectURL=d,n.isURL=p,n.isUserURL=_,n.isHypertyURL=y,n.getConfigurationResources=b,n.buildURL=h,n.generateGUID=v},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":3}]},{},[43])(43)});
//# sourceMappingURL=ReThinkCtx.js.map
