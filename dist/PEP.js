// version: 0.12.0
// date: Tue Jul 17 2018 11:33:03 GMT+0100 (Western European Summer Time)
// licence: 
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


// version: 0.12.0
// date: Tue Jul 17 2018 11:33:03 GMT+0100 (Western European Summer Time)
// licence: 
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("PEP",[],t):"object"==typeof exports?exports.PEP=t():e.PEP=t()}("undefined"!=typeof self?self:this,function(){/******/
return function(e){/******/
/******/
// The require function
/******/
function __webpack_require__(r){/******/
/******/
// Check if module is in cache
/******/
if(t[r])/******/
return t[r].exports;/******/
// Create a new module (and put it into the cache)
/******/
var n=t[r]={/******/
i:r,/******/
l:!1,/******/
exports:{}};/******/
/******/
// Return the exports of the module
/******/
/******/
/******/
// Execute the module function
/******/
/******/
/******/
// Flag the module as loaded
/******/
return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}// webpackBootstrap
/******/
// The module cache
/******/
var t={};/******/
/******/
// Load entry module and return exports
/******/
/******/
/******/
/******/
// expose the modules object (__webpack_modules__)
/******/
/******/
/******/
// expose the module cache
/******/
/******/
/******/
// define getter function for harmony exports
/******/
/******/
/******/
// getDefaultExport function for compatibility with non-harmony modules
/******/
/******/
/******/
// Object.prototype.hasOwnProperty.call
/******/
/******/
/******/
// __webpack_public_path__
/******/
return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){/******/
__webpack_require__.o(e,t)||/******/
Object.defineProperty(e,t,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:r})},__webpack_require__.n=function(e){/******/
var t=e&&e.__esModule?/******/
function(){return e.default}:/******/
function(){return e};/******/
/******/
return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=118)}([/* 0 */
/***/
function(e,t){var r=e.exports={version:"2.5.5"};"number"==typeof __e&&(__e=r)},/* 1 */
/***/
function(e,t){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var r=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},/* 2 */
/***/
function(e,t,r){var n=r(28)("wks"),o=r(19),i=r(1).Symbol,u="function"==typeof i;(e.exports=function(e){return n[e]||(n[e]=u&&i[e]||(u?i:o)("Symbol."+e))}).store=n},/* 3 */
/***/
function(e,t,r){var n=r(1),o=r(0),i=r(14),u=r(9),a=r(8),s=function(e,t,r){var c,f,l,p=e&s.F,d=e&s.G,v=e&s.S,y=e&s.P,h=e&s.B,_=e&s.W,g=d?o:o[t]||(o[t]={}),m=g.prototype,b=d?n:v?n[t]:(n[t]||{}).prototype;d&&(r=t);for(c in r)
// contains in native
(f=!p&&b&&void 0!==b[c])&&a(g,c)||(
// export native or passed
l=f?b[c]:r[c],
// prevent global pollution for namespaces
g[c]=d&&"function"!=typeof b[c]?r[c]:h&&f?i(l,n):_&&b[c]==l?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(l):y&&"function"==typeof l?i(Function.call,l):l,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
y&&((g.virtual||(g.virtual={}))[c]=l,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
e&s.R&&m&&!m[c]&&u(m,c,l)))};
// type bitmap
s.F=1,// forced
s.G=2,// global
s.S=4,// static
s.P=8,// proto
s.B=16,// bind
s.W=32,// wrap
s.U=64,// safe
s.R=128,// real proto method for `library`
e.exports=s},/* 4 */
/***/
function(e,t,r){var n=r(6);e.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},/* 5 */
/***/
function(e,t,r){
// Thank's IE8 for his funny defineProperty
e.exports=!r(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 6 */
/***/
function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},/* 7 */
/***/
function(e,t,r){var n=r(4),o=r(36),i=r(26),u=Object.defineProperty;t.f=r(5)?Object.defineProperty:function(e,t,r){if(n(e),t=i(t,!0),n(r),o)try{return u(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},/* 8 */
/***/
function(e,t){var r={}.hasOwnProperty;e.exports=function(e,t){return r.call(e,t)}},/* 9 */
/***/
function(e,t,r){var n=r(7),o=r(18);e.exports=r(5)?function(e,t,r){return n.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},/* 10 */
/***/
function(e,t,r){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var n=r(57),o=r(22);e.exports=function(e){return n(o(e))}},/* 11 */
/***/
function(e,t,r){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(e,t,r){"use strict";t.__esModule=!0;var n=r(60),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,o.default)(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}()},/* 13 */
/***/
function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},/* 14 */
/***/
function(e,t,r){
// optional / simple context binding
var n=r(17);e.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}}},/* 15 */
/***/
function(e,t){var r={}.toString;e.exports=function(e){return r.call(e).slice(8,-1)}},/* 16 */
/***/
function(e,t){e.exports={}},/* 17 */
/***/
function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},/* 18 */
/***/
function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},/* 19 */
/***/
function(e,t){var r=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++r+n).toString(36))}},/* 20 */
/***/
function(e,t,r){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var n=r(37),o=r(29);e.exports=Object.keys||function(e){return n(e,o)}},/* 21 */
/***/
function(e,t){
// 7.1.4 ToInteger
var r=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:r)(e)}},/* 22 */
/***/
function(e,t){
// 7.2.1 RequireObjectCoercible(argument)
e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},/* 23 */
/***/
function(e,t){e.exports=!0},/* 24 */
/***/
function(e,t,r){var n=r(7).f,o=r(8),i=r(2)("toStringTag");e.exports=function(e,t,r){e&&!o(e=r?e:e.prototype,i)&&n(e,i,{configurable:!0,value:t})}},/* 25 */
/***/
function(e,t,r){var n=r(6),o=r(1).document,i=n(o)&&n(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},/* 26 */
/***/
function(e,t,r){
// 7.1.1 ToPrimitive(input [, PreferredType])
var n=r(6);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
e.exports=function(e,t){if(!n(e))return e;var r,o;if(t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;if("function"==typeof(r=e.valueOf)&&!n(o=r.call(e)))return o;if(!t&&"function"==typeof(r=e.toString)&&!n(o=r.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(e,t,r){var n=r(28)("keys"),o=r(19);e.exports=function(e){return n[e]||(n[e]=o(e))}},/* 28 */
/***/
function(e,t,r){var n=r(1),o=n["__core-js_shared__"]||(n["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},/* 29 */
/***/
function(e,t){
// IE 8- don't enum bug keys
e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(e,t,r){
// 7.1.13 ToObject(argument)
var n=r(22);e.exports=function(e){return Object(n(e))}},/* 31 */
/***/
function(e,t,r){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var n=r(4),o=r(69),i=r(29),u=r(27)("IE_PROTO"),a=function(){},s=function(){
// Thrash, waste and sodomy: IE GC bug
var e,t=r(25)("iframe"),n=i.length;for(t.style.display="none",r(46).appendChild(t),t.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),s=e.F;n--;)delete s.prototype[i[n]];return s()};e.exports=Object.create||function(e,t){var r;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==e?(a.prototype=n(e),r=new a,a.prototype=null,r[u]=e):r=s(),void 0===t?r:o(r,t)}},/* 32 */
/***/
function(e,t,r){"use strict";function PromiseCapability(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n}),this.resolve=n(t),this.reject=n(r)}
// 25.4.1.5 NewPromiseCapability(C)
var n=r(17);e.exports.f=function(e){return new PromiseCapability(e)}},/* 33 */
/***/
function(e,t,r){t.f=r(2)},/* 34 */
/***/
function(e,t,r){var n=r(1),o=r(0),i=r(23),u=r(33),a=r(7).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||a(t,e,{value:u.f(e)})}},/* 35 */
/***/
function(e,t){t.f={}.propertyIsEnumerable},/* 36 */
/***/
function(e,t,r){e.exports=!r(5)&&!r(13)(function(){return 7!=Object.defineProperty(r(25)("div"),"a",{get:function(){return 7}}).a})},/* 37 */
/***/
function(e,t,r){var n=r(8),o=r(10),i=r(58)(!1),u=r(27)("IE_PROTO");e.exports=function(e,t){var r,a=o(e),s=0,c=[];for(r in a)r!=u&&n(a,r)&&c.push(r);
// Don't enum bug & hidden keys
for(;t.length>s;)n(a,r=t[s++])&&(~i(c,r)||c.push(r));return c}},/* 38 */
/***/
function(e,t,r){
// 7.1.15 ToLength
var n=r(21),o=Math.min;e.exports=function(e){return e>0?o(n(e),9007199254740991):0}},/* 39 */
/***/
function(e,t,r){
// most Object methods by ES6 should accept primitives
var n=r(3),o=r(0),i=r(13);e.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],u={};u[e]=t(r),n(n.S+n.F*i(function(){r(1)}),"Object",u)}},/* 40 */
/***/
function(e,t,r){var n=r(35),o=r(18),i=r(10),u=r(26),a=r(8),s=r(36),c=Object.getOwnPropertyDescriptor;t.f=r(5)?c:function(e,t){if(e=i(e),t=u(t,!0),s)try{return c(e,t)}catch(e){}if(a(e,t))return o(!n.f.call(e,t),e[t])}},/* 41 */
/***/
function(e,t,r){e.exports={default:r(66),__esModule:!0}},/* 42 */
/***/
function(e,t){},/* 43 */
/***/
function(e,t,r){"use strict";var n=r(67)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
r(44)(String,"String",function(e){this._t=String(e),// target
this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},/* 44 */
/***/
function(e,t,r){"use strict";var n=r(23),o=r(3),i=r(45),u=r(9),a=r(16),s=r(68),c=r(24),f=r(47),l=r(2)("iterator"),p=!([].keys&&"next"in[].keys()),d=function(){return this};e.exports=function(e,t,r,v,y,h,_){s(r,t,v);var g,m,b,w=function(e){if(!p&&e in O)return O[e];switch(e){case"keys":case"values":return function(){return new r(this,e)}}return function(){return new r(this,e)}},x=t+" Iterator",R="values"==y,P=!1,O=e.prototype,S=O[l]||O["@@iterator"]||y&&O[y],L=S||w(y),k=y?R?w("entries"):L:void 0,A="Array"==t?O.entries||S:S;if(
// Fix native
A&&(b=f(A.call(new e)))!==Object.prototype&&b.next&&(
// Set @@toStringTag to native iterators
c(b,x,!0),
// fix for some old engines
n||"function"==typeof b[l]||u(b,l,d)),
// fix Array#{values, @@iterator}.name in V8 / FF
R&&S&&"values"!==S.name&&(P=!0,L=function(){return S.call(this)}),
// Define iterator
n&&!_||!p&&!P&&O[l]||u(O,l,L),
// Plug for library
a[t]=L,a[x]=d,y)if(g={values:R?L:w("values"),keys:h?L:w("keys"),entries:k},_)for(m in g)m in O||i(O,m,g[m]);else o(o.P+o.F*(p||P),t,g);return g}},/* 45 */
/***/
function(e,t,r){e.exports=r(9)},/* 46 */
/***/
function(e,t,r){var n=r(1).document;e.exports=n&&n.documentElement},/* 47 */
/***/
function(e,t,r){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var n=r(8),o=r(30),i=r(27)("IE_PROTO"),u=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),n(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?u:null}},/* 48 */
/***/
function(e,t,r){r(70);for(var n=r(1),o=r(9),i=r(16),u=r(2)("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),s=0;s<a.length;s++){var c=a[s],f=n[c],l=f&&f.prototype;l&&!l[u]&&o(l,u,c),i[c]=i.Array}},/* 49 */
/***/
function(e,t,r){
// getting tag from 19.1.3.6 Object.prototype.toString()
var n=r(15),o=r(2)("toStringTag"),i="Arguments"==n(function(){return arguments}()),u=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,r,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=u(t=Object(e),o))?r:i?n(t):"Object"==(a=n(t))&&"function"==typeof t.callee?"Arguments":a}},/* 50 */
/***/
function(e,t,r){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var n=r(4),o=r(17),i=r(2)("species");e.exports=function(e,t){var r,u=n(e).constructor;return void 0===u||void 0==(r=n(u)[i])?t:o(r)}},/* 51 */
/***/
function(e,t,r){var n,o,i,u=r(14),a=r(79),s=r(46),c=r(25),f=r(1),l=f.process,p=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,y=f.Dispatch,h=0,_={},g=function(){var e=+this;
// eslint-disable-next-line no-prototype-builtins
if(_.hasOwnProperty(e)){var t=_[e];delete _[e],t()}},m=function(e){g.call(e.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&d||(p=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return _[++h]=function(){
// eslint-disable-next-line no-new-func
a("function"==typeof e?e:Function(e),t)},n(h),h},d=function(e){delete _[e]},
// Node.js 0.8-
"process"==r(15)(l)?n=function(e){l.nextTick(u(g,e,1))}:y&&y.now?n=function(e){y.now(u(g,e,1))}:v?(o=new v,i=o.port2,o.port1.onmessage=m,n=u(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",m,!1)):n="onreadystatechange"in c("script")?function(e){s.appendChild(c("script")).onreadystatechange=function(){s.removeChild(this),g.call(e)}}:function(e){setTimeout(u(g,e,1),0)}),e.exports={set:p,clear:d}},/* 52 */
/***/
function(e,t){e.exports=function(e){try{return{e:!1,v:e()}}catch(e){return{e:!0,v:e}}}},/* 53 */
/***/
function(e,t,r){var n=r(4),o=r(6),i=r(32);e.exports=function(e,t){if(n(e),o(t)&&t.constructor===e)return t;var r=i.f(e);return(0,r.resolve)(t),r.promise}},/* 54 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(89),o=_interopRequireDefault(n),i=r(91),u=_interopRequireDefault(i),a="function"==typeof u.default&&"symbol"==typeof o.default?function(e){return typeof e}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":typeof e};t.default="function"==typeof u.default&&"symbol"===a(o.default)?function(e){return void 0===e?"undefined":a(e)}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":void 0===e?"undefined":a(e)}},/* 55 */
/***/
function(e,t){t.f=Object.getOwnPropertySymbols},/* 56 */
/***/
function(e,t,r){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var n=r(37),o=r(29).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,o)}},/* 57 */
/***/
function(e,t,r){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var n=r(15);
// eslint-disable-next-line no-prototype-builtins
e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},/* 58 */
/***/
function(e,t,r){
// false -> Array#indexOf
// true  -> Array#includes
var n=r(10),o=r(38),i=r(59);e.exports=function(e){return function(t,r,u){var a,s=n(t),c=o(s.length),f=i(u,c);
// Array#includes uses SameValueZero equality algorithm
// eslint-disable-next-line no-self-compare
if(e&&r!=r){for(;c>f;)
// eslint-disable-next-line no-self-compare
if((a=s[f++])!=a)return!0}else for(;c>f;f++)if((e||f in s)&&s[f]===r)return e||f||0;return!e&&-1}}},/* 59 */
/***/
function(e,t,r){var n=r(21),o=Math.max,i=Math.min;e.exports=function(e,t){return e=n(e),e<0?o(e+t,0):i(e,t)}},/* 60 */
/***/
function(e,t,r){e.exports={default:r(61),__esModule:!0}},/* 61 */
/***/
function(e,t,r){r(62);var n=r(0).Object;e.exports=function(e,t,r){return n.defineProperty(e,t,r)}},/* 62 */
/***/
function(e,t,r){var n=r(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
n(n.S+n.F*!r(5),"Object",{defineProperty:r(7).f})},/* 63 */
/***/
function(e,t,r){e.exports={default:r(87),__esModule:!0}},/* 64 */
/***/
function(e,t,r){"use strict";t.__esModule=!0;var n=r(54),o=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}},/* 65 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(100),o=_interopRequireDefault(n),i=r(104),u=_interopRequireDefault(i),a=r(54),s=_interopRequireDefault(a);t.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,s.default)(t)));e.prototype=(0,u.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(o.default?(0,o.default)(e,t):e.__proto__=t)}},/* 66 */
/***/
function(e,t,r){r(42),r(43),r(48),r(73),r(84),r(85),e.exports=r(0).Promise},/* 67 */
/***/
function(e,t,r){var n=r(21),o=r(22);
// true  -> String#at
// false -> String#codePointAt
e.exports=function(e){return function(t,r){var i,u,a=String(o(t)),s=n(r),c=a.length;return s<0||s>=c?e?"":void 0:(i=a.charCodeAt(s),i<55296||i>56319||s+1===c||(u=a.charCodeAt(s+1))<56320||u>57343?e?a.charAt(s):i:e?a.slice(s,s+2):u-56320+(i-55296<<10)+65536)}}},/* 68 */
/***/
function(e,t,r){"use strict";var n=r(31),o=r(18),i=r(24),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
r(9)(u,r(2)("iterator"),function(){return this}),e.exports=function(e,t,r){e.prototype=n(u,{next:o(1,r)}),i(e,t+" Iterator")}},/* 69 */
/***/
function(e,t,r){var n=r(7),o=r(4),i=r(20);e.exports=r(5)?Object.defineProperties:function(e,t){o(e);for(var r,u=i(t),a=u.length,s=0;a>s;)n.f(e,r=u[s++],t[r]);return e}},/* 70 */
/***/
function(e,t,r){"use strict";var n=r(71),o=r(72),i=r(16),u=r(10);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
e.exports=r(44)(Array,"Array",function(e,t){this._t=u(e),// target
this._i=0,// next index
this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,r):"values"==t?o(0,e[r]):o(0,[r,e[r]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
i.Arguments=i.Array,n("keys"),n("values"),n("entries")},/* 71 */
/***/
function(e,t){e.exports=function(){}},/* 72 */
/***/
function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},/* 73 */
/***/
function(e,t,r){"use strict";var n,o,i,u,a=r(23),s=r(1),c=r(14),f=r(49),l=r(3),p=r(6),d=r(17),v=r(74),y=r(75),h=r(50),_=r(51).set,g=r(80)(),m=r(32),b=r(52),w=r(53),x=s.TypeError,R=s.process,P=s.Promise,O="process"==f(R),S=function(){},L=o=m.f,k=!!function(){try{
// correct subclassing with @@species support
var e=P.resolve(1),t=(e.constructor={})[r(2)("species")]=function(e){e(S,S)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(O||"function"==typeof PromiseRejectionEvent)&&e.then(S)instanceof t}catch(e){}}(),A=function(e){var t;return!(!p(e)||"function"!=typeof(t=e.then))&&t},E=function(e,t){if(!e._n){e._n=!0;var r=e._c;g(function(){for(var n=e._v,o=1==e._s,i=0;r.length>i;)!function(t){var r,i,u,a=o?t.ok:t.fail,s=t.resolve,c=t.reject,f=t.domain;try{a?(o||(2==e._h&&M(e),e._h=1),!0===a?r=n:(f&&f.enter(),r=a(n),// may throw
f&&(f.exit(),u=!0)),r===t.promise?c(x("Promise-chain cycle")):(i=A(r))?i.call(r,s,c):s(r)):c(n)}catch(e){f&&!u&&f.exit(),c(e)}}(r[i++]);// variable length - can't use forEach
e._c=[],e._n=!1,t&&!e._h&&U(e)})}},U=function(e){_.call(s,function(){var t,r,n,o=e._v,i=D(e);if(i&&(t=b(function(){O?R.emit("unhandledRejection",o,e):(r=s.onunhandledrejection)?r({promise:e,reason:o}):(n=s.console)&&n.error&&n.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
e._h=O||D(e)?2:1),e._a=void 0,i&&t.e)throw t.v})},D=function(e){return 1!==e._h&&0===(e._a||e._c).length},M=function(e){_.call(s,function(){var t;O?R.emit("rejectionHandled",e):(t=s.onrejectionhandled)&&t({promise:e,reason:e._v})})},j=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,// unwrap
t._v=e,t._s=2,t._a||(t._a=t._c.slice()),E(t,!0))},q=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;// unwrap
try{if(r===e)throw x("Promise can't be resolved itself");(t=A(e))?g(function(){var n={_w:r,_d:!1};// wrap
try{t.call(e,c(q,n,1),c(j,n,1))}catch(e){j.call(n,e)}}):(r._v=e,r._s=1,E(r,!1))}catch(e){j.call({_w:r,_d:!1},e)}}};
// constructor polyfill
k||(
// 25.4.3.1 Promise(executor)
P=function(e){v(this,P,"Promise","_h"),d(e),n.call(this);try{e(c(q,this,1),c(j,this,1))}catch(e){j.call(this,e)}},
// eslint-disable-next-line no-unused-vars
n=function(e){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},n.prototype=r(81)(P.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(e,t){var r=L(h(this,P));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=O?R.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&E(this,!1),r.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(e){return this.then(void 0,e)}}),i=function(){var e=new n;this.promise=e,this.resolve=c(q,e,1),this.reject=c(j,e,1)},m.f=L=function(e){return e===P||e===u?new i(e):o(e)}),l(l.G+l.W+l.F*!k,{Promise:P}),r(24)(P,"Promise"),r(82)("Promise"),u=r(0).Promise,
// statics
l(l.S+l.F*!k,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(e){var t=L(this);return(0,t.reject)(e),t.promise}}),l(l.S+l.F*(a||!k),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(e){return w(a&&this===u?P:this,e)}}),l(l.S+l.F*!(k&&r(83)(function(e){P.all(e).catch(S)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(e){var t=this,r=L(t),n=r.resolve,o=r.reject,i=b(function(){var r=[],i=0,u=1;y(e,!1,function(e){var a=i++,s=!1;r.push(void 0),u++,t.resolve(e).then(function(e){s||(s=!0,r[a]=e,--u||n(r))},o)}),--u||n(r)});return i.e&&o(i.v),r.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(e){var t=this,r=L(t),n=r.reject,o=b(function(){y(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return o.e&&n(o.v),r.promise}})},/* 74 */
/***/
function(e,t){e.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},/* 75 */
/***/
function(e,t,r){var n=r(14),o=r(76),i=r(77),u=r(4),a=r(38),s=r(78),c={},f={},t=e.exports=function(e,t,r,l,p){var d,v,y,h,_=p?function(){return e}:s(e),g=n(r,l,t?2:1),m=0;if("function"!=typeof _)throw TypeError(e+" is not iterable!");
// fast case for arrays with default iterator
if(i(_)){for(d=a(e.length);d>m;m++)if((h=t?g(u(v=e[m])[0],v[1]):g(e[m]))===c||h===f)return h}else for(y=_.call(e);!(v=y.next()).done;)if((h=o(y,g,v.value,t))===c||h===f)return h};t.BREAK=c,t.RETURN=f},/* 76 */
/***/
function(e,t,r){
// call something on iterator step with safe closing on error
var n=r(4);e.exports=function(e,t,r,o){try{return o?t(n(r)[0],r[1]):t(r)}catch(t){var i=e.return;throw void 0!==i&&n(i.call(e)),t}}},/* 77 */
/***/
function(e,t,r){
// check on default Array iterator
var n=r(16),o=r(2)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(n.Array===e||i[o]===e)}},/* 78 */
/***/
function(e,t,r){var n=r(49),o=r(2)("iterator"),i=r(16);e.exports=r(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[n(e)]}},/* 79 */
/***/
function(e,t){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
e.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},/* 80 */
/***/
function(e,t,r){var n=r(1),o=r(51).set,i=n.MutationObserver||n.WebKitMutationObserver,u=n.process,a=n.Promise,s="process"==r(15)(u);e.exports=function(){var e,t,r,c=function(){var n,o;for(s&&(n=u.domain)&&n.exit();e;){o=e.fn,e=e.next;try{o()}catch(n){throw e?r():t=void 0,n}}t=void 0,n&&n.enter()};
// Node.js
if(s)r=function(){u.nextTick(c)};else if(!i||n.navigator&&n.navigator.standalone)if(a&&a.resolve){var f=a.resolve();r=function(){f.then(c)}}else r=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(n,c)};else{var l=!0,p=document.createTextNode("");new i(c).observe(p,{characterData:!0}),// eslint-disable-line no-new
r=function(){p.data=l=!l}}return function(n){var o={fn:n,next:void 0};t&&(t.next=o),e||(e=o,r()),t=o}}},/* 81 */
/***/
function(e,t,r){var n=r(9);e.exports=function(e,t,r){for(var o in t)r&&e[o]?e[o]=t[o]:n(e,o,t[o]);return e}},/* 82 */
/***/
function(e,t,r){"use strict";var n=r(1),o=r(0),i=r(7),u=r(5),a=r(2)("species");e.exports=function(e){var t="function"==typeof o[e]?o[e]:n[e];u&&t&&!t[a]&&i.f(t,a,{configurable:!0,get:function(){return this}})}},/* 83 */
/***/
function(e,t,r){var n=r(2)("iterator"),o=!1;try{var i=[7][n]();i.return=function(){o=!0},
// eslint-disable-next-line no-throw-literal
Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var r=!1;try{var i=[7],u=i[n]();u.next=function(){return{done:r=!0}},i[n]=function(){return u},e(i)}catch(e){}return r}},/* 84 */
/***/
function(e,t,r){"use strict";
// https://github.com/tc39/proposal-promise-finally
var n=r(3),o=r(0),i=r(1),u=r(50),a=r(53);n(n.P+n.R,"Promise",{finally:function(e){var t=u(this,o.Promise||i.Promise),r="function"==typeof e;return this.then(r?function(r){return a(t,e()).then(function(){return r})}:e,r?function(r){return a(t,e()).then(function(){throw r})}:e)}})},/* 85 */
/***/
function(e,t,r){"use strict";
// https://github.com/tc39/proposal-promise-try
var n=r(3),o=r(32),i=r(52);n(n.S,"Promise",{try:function(e){var t=o.f(this),r=i(e);return(r.e?t.reject:t.resolve)(r.v),t.promise}})},/* 86 */
/***/
function(e,t,r){var n,o;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
!function(i,u){"use strict";n=u,void 0!==(o="function"==typeof n?n.call(t,r,t,e):n)&&(e.exports=o)}(0,function(){"use strict";
// Cross-browser bind equivalent that works at least back to IE6
function bindMethod(e,t){var r=e[t];if("function"==typeof r.bind)return r.bind(e);try{return Function.prototype.bind.call(r,e)}catch(t){
// Missing bind shim or IE8 + Modernizr, fallback to wrapping
return function(){return Function.prototype.apply.apply(r,[e,arguments])}}}
// Build the best logging method possible for this env
// Wherever possible we want to bind, not wrap, to preserve stack traces
function realMethod(r){return"debug"===r&&(r="log"),typeof console!==t&&(void 0!==console[r]?bindMethod(console,r):void 0!==console.log?bindMethod(console,"log"):e)}
// These private functions always need `this` to be set properly
function replaceLoggingMethods(t,n){/*jshint validthis:true */
for(var o=0;o<r.length;o++){var i=r[o];this[i]=o<t?e:this.methodFactory(i,t,n)}
// Define log.log as an alias for log.debug
this.log=this.debug}
// In old IE versions, the console isn't present until you first open it.
// We build realMethod() replacements here that regenerate logging methods
function enableLoggingWhenConsoleArrives(e,r,n){return function(){typeof console!==t&&(replaceLoggingMethods.call(this,r,n),this[e].apply(this,arguments))}}
// By default, we use closely bound real methods wherever possible, and
// otherwise we wait for a console to appear, and then try again.
function defaultMethodFactory(e,t,r){/*jshint validthis:true */
return realMethod(e)||enableLoggingWhenConsoleArrives.apply(this,arguments)}function Logger(e,n,o){function persistLevelIfPossible(e){var n=(r[e]||"silent").toUpperCase();if(typeof window!==t){
// Use localStorage if available
try{return void(window.localStorage[a]=n)}catch(e){}
// Use session cookie as fallback
try{window.document.cookie=encodeURIComponent(a)+"="+n+";"}catch(e){}}}function getPersistedLevel(){var e;if(typeof window!==t){try{e=window.localStorage[a]}catch(e){}
// Fallback to cookies if local storage gives us nothing
if(typeof e===t)try{var r=window.document.cookie,n=r.indexOf(encodeURIComponent(a)+"=");-1!==n&&(e=/^([^;]+)/.exec(r.slice(n))[1])}catch(e){}
// If the stored level is not valid, treat it as if nothing was stored.
return void 0===u.levels[e]&&(e=void 0),e}}var i,u=this,a="loglevel";e&&(a+=":"+e),/*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */
u.name=e,u.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},u.methodFactory=o||defaultMethodFactory,u.getLevel=function(){return i},u.setLevel=function(r,n){if("string"==typeof r&&void 0!==u.levels[r.toUpperCase()]&&(r=u.levels[r.toUpperCase()]),!("number"==typeof r&&r>=0&&r<=u.levels.SILENT))throw"log.setLevel() called with invalid level: "+r;if(i=r,!1!==n&&// defaults to true
persistLevelIfPossible(r),replaceLoggingMethods.call(u,r,e),typeof console===t&&r<u.levels.SILENT)return"No console available for logging"},u.setDefaultLevel=function(e){getPersistedLevel()||u.setLevel(e,!1)},u.enableAll=function(e){u.setLevel(u.levels.TRACE,e)},u.disableAll=function(e){u.setLevel(u.levels.SILENT,e)};
// Initialize with the right level
var s=getPersistedLevel();null==s&&(s=null==n?"WARN":n),u.setLevel(s,!1)}
// Slightly dubious tricks to cut down minimized file size
var e=function(){},t="undefined",r=["trace","debug","info","warn","error"],n=new Logger,o={};n.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=o[e];return t||(t=o[e]=new Logger(e,n.getLevel(),n.methodFactory)),t};
// Grab the current global log variable in case of overwrite
var i=typeof window!==t?window.log:void 0;return n.noConflict=function(){return typeof window!==t&&window.log===n&&(window.log=i),n},n.getLoggers=function(){return o},n})},/* 87 */
/***/
function(e,t,r){r(88),e.exports=r(0).Object.getPrototypeOf},/* 88 */
/***/
function(e,t,r){
// 19.1.2.9 Object.getPrototypeOf(O)
var n=r(30),o=r(47);r(39)("getPrototypeOf",function(){return function(e){return o(n(e))}})},/* 89 */
/***/
function(e,t,r){e.exports={default:r(90),__esModule:!0}},/* 90 */
/***/
function(e,t,r){r(43),r(48),e.exports=r(33).f("iterator")},/* 91 */
/***/
function(e,t,r){e.exports={default:r(92),__esModule:!0}},/* 92 */
/***/
function(e,t,r){r(93),r(42),r(98),r(99),e.exports=r(0).Symbol},/* 93 */
/***/
function(e,t,r){"use strict";
// ECMAScript 6 symbols shim
var n=r(1),o=r(8),i=r(5),u=r(3),a=r(45),s=r(94).KEY,c=r(13),f=r(28),l=r(24),p=r(19),d=r(2),v=r(33),y=r(34),h=r(95),_=r(96),g=r(4),m=r(6),b=r(10),w=r(26),x=r(18),R=r(31),P=r(97),O=r(40),S=r(7),L=r(20),k=O.f,A=S.f,E=P.f,U=n.Symbol,D=n.JSON,M=D&&D.stringify,j=d("_hidden"),q=d("toPrimitive"),T={}.propertyIsEnumerable,C=f("symbol-registry"),F=f("symbols"),N=f("op-symbols"),I=Object.prototype,G="function"==typeof U,B=n.QObject,H=!B||!B.prototype||!B.prototype.findChild,z=i&&c(function(){return 7!=R(A({},"a",{get:function(){return A(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=k(I,t);n&&delete I[t],A(e,t,r),n&&e!==I&&A(I,t,n)}:A,V=function(e){var t=F[e]=R(U.prototype);return t._k=e,t},Z=G&&"symbol"==typeof U.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof U},W=function(e,t,r){return e===I&&W(N,t,r),g(e),t=w(t,!0),g(r),o(F,t)?(r.enumerable?(o(e,j)&&e[j][t]&&(e[j][t]=!1),r=R(r,{enumerable:x(0,!1)})):(o(e,j)||A(e,j,x(1,{})),e[j][t]=!0),z(e,t,r)):A(e,t,r)},J=function(e,t){g(e);for(var r,n=h(t=b(t)),o=0,i=n.length;i>o;)W(e,r=n[o++],t[r]);return e},K=function(e,t){return void 0===t?R(e):J(R(e),t)},Y=function(e){var t=T.call(this,e=w(e,!0));return!(this===I&&o(F,e)&&!o(N,e))&&(!(t||!o(this,e)||!o(F,e)||o(this,j)&&this[j][e])||t)},$=function(e,t){if(e=b(e),t=w(t,!0),e!==I||!o(F,t)||o(N,t)){var r=k(e,t);return!r||!o(F,t)||o(e,j)&&e[j][t]||(r.enumerable=!0),r}},Q=function(e){for(var t,r=E(b(e)),n=[],i=0;r.length>i;)o(F,t=r[i++])||t==j||t==s||n.push(t);return n},X=function(e){for(var t,r=e===I,n=E(r?N:b(e)),i=[],u=0;n.length>u;)!o(F,t=n[u++])||r&&!o(I,t)||i.push(F[t]);return i};
// 19.4.1.1 Symbol([description])
G||(U=function(){if(this instanceof U)throw TypeError("Symbol is not a constructor!");var e=p(arguments.length>0?arguments[0]:void 0),t=function(r){this===I&&t.call(N,r),o(this,j)&&o(this[j],e)&&(this[j][e]=!1),z(this,e,x(1,r))};return i&&H&&z(I,e,{configurable:!0,set:t}),V(e)},a(U.prototype,"toString",function(){return this._k}),O.f=$,S.f=W,r(56).f=P.f=Q,r(35).f=Y,r(55).f=X,i&&!r(23)&&a(I,"propertyIsEnumerable",Y,!0),v.f=function(e){return V(d(e))}),u(u.G+u.W+u.F*!G,{Symbol:U});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)d(ee[te++]);for(var re=L(d.store),ne=0;re.length>ne;)y(re[ne++]);u(u.S+u.F*!G,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(e){return o(C,e+="")?C[e]:C[e]=U(e)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(e){if(!Z(e))throw TypeError(e+" is not a symbol!");for(var t in C)if(C[t]===e)return t},useSetter:function(){H=!0},useSimple:function(){H=!1}}),u(u.S+u.F*!G,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:K,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:W,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:J,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:$,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:Q,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:X}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
D&&u(u.S+u.F*(!G||c(function(){var e=U();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=M([e])||"{}"!=M({a:e})||"{}"!=M(Object(e))})),"JSON",{stringify:function(e){for(var t,r,n=[e],o=1;arguments.length>o;)n.push(arguments[o++]);if(r=t=n[1],(m(t)||void 0!==e)&&!Z(e))// IE8 returns string on undefined
return _(t)||(t=function(e,t){if("function"==typeof r&&(t=r.call(this,e,t)),!Z(t))return t}),n[1]=t,M.apply(D,n)}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
U.prototype[q]||r(9)(U.prototype,q,U.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(U,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(n.JSON,"JSON",!0)},/* 94 */
/***/
function(e,t,r){var n=r(19)("meta"),o=r(6),i=r(8),u=r(7).f,a=0,s=Object.isExtensible||function(){return!0},c=!r(13)(function(){return s(Object.preventExtensions({}))}),f=function(e){u(e,n,{value:{i:"O"+ ++a,// object ID
w:{}}})},l=function(e,t){
// return primitive with prefix
if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,n)){
// can't set metadata to uncaught frozen object
if(!s(e))return"F";
// not necessary to add metadata
if(!t)return"E";
// add missing metadata
f(e)}return e[n].i},p=function(e,t){if(!i(e,n)){
// can't set metadata to uncaught frozen object
if(!s(e))return!0;
// not necessary to add metadata
if(!t)return!1;
// add missing metadata
f(e)}return e[n].w},d=function(e){return c&&v.NEED&&s(e)&&!i(e,n)&&f(e),e},v=e.exports={KEY:n,NEED:!1,fastKey:l,getWeak:p,onFreeze:d}},/* 95 */
/***/
function(e,t,r){
// all enumerable object keys, includes symbols
var n=r(20),o=r(55),i=r(35);e.exports=function(e){var t=n(e),r=o.f;if(r)for(var u,a=r(e),s=i.f,c=0;a.length>c;)s.call(e,u=a[c++])&&t.push(u);return t}},/* 96 */
/***/
function(e,t,r){
// 7.2.2 IsArray(argument)
var n=r(15);e.exports=Array.isArray||function(e){return"Array"==n(e)}},/* 97 */
/***/
function(e,t,r){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var n=r(10),o=r(56).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return o(e)}catch(e){return u.slice()}};e.exports.f=function(e){return u&&"[object Window]"==i.call(e)?a(e):o(n(e))}},/* 98 */
/***/
function(e,t,r){r(34)("asyncIterator")},/* 99 */
/***/
function(e,t,r){r(34)("observable")},/* 100 */
/***/
function(e,t,r){e.exports={default:r(101),__esModule:!0}},/* 101 */
/***/
function(e,t,r){r(102),e.exports=r(0).Object.setPrototypeOf},/* 102 */
/***/
function(e,t,r){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var n=r(3);n(n.S,"Object",{setPrototypeOf:r(103).set})},/* 103 */
/***/
function(e,t,r){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var n=r(6),o=r(4),i=function(e,t){if(o(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(e,t,n){try{n=r(14)(Function.call,r(40).f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,r){return i(e,r),t?e.__proto__=r:n(e,r),e}}({},!1):void 0),check:i}},/* 104 */
/***/
function(e,t,r){e.exports={default:r(105),__esModule:!0}},/* 105 */
/***/
function(e,t,r){r(106);var n=r(0).Object;e.exports=function(e,t){return n.create(e,t)}},/* 106 */
/***/
function(e,t,r){var n=r(3);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
n(n.S,"Object",{create:r(31)})},/* 107 */
/***/
function(e,t,r){e.exports={default:r(108),__esModule:!0}},/* 108 */
/***/
function(e,t,r){r(109),e.exports=r(0).Object.keys},/* 109 */
/***/
function(e,t,r){
// 19.1.2.14 Object.keys(O)
var n=r(30),o=r(20);r(39)("keys",function(){return function(e){return o(n(e))}})},/* 110 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}/**
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
/**
 * Support module with some functions will be useful
 * @module utils
 */
/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */
/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
function divideURL(e){function recurse(e){var t=/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._+~#=]{2,256})([-a-zA-Z0-9@:%._+~#=\/]*)/gi;return e.replace(t,"$1,$3,$4").split(",")}var t=recurse(e);
// If the url has no scheme
if(t[0]===e&&!t[0].includes("@")){return{type:"",domain:e,identity:""}}
// check if the url has the scheme and includes an @
if(t[0]===e&&t[0].includes("@")){t=recurse((t[0]===e?"smtp":t[0])+"://"+t[0])}
// if the domain includes an @, divide it to domain and identity respectively
return t[1].includes("@")&&(t[2]=t[0]+"://"+t[1],t[1]=t[1].substr(t[1].indexOf("@")+1)),{type:t[0],domain:t[1],identity:t[2]}}/**
 * Check if an Object is empty
 * @param  {Object} object Object to be checked
 * @return {Boolean}       status of Object, empty or not (true|false);
 */
function emptyObject(e){return!((0,u.default)(e).length>0)}function secondsSinceEpoch(){return Math.floor(Date.now()/1e3)}/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
function deepClone(e){
//TODO: simple but inefficient JSON deep clone...
if(e)return JSON.parse((0,o.default)(e))}function removePathFromURL(e){var t=e.split("/");return t[0]+"//"+t[2]+"/"+t[3]}/**
 * Obtains the user URL that corresponds to a given email
 * @param  {string} userEmail The user email
 * @return {URL.URL} userURL The user URL
 */
function getUserURLFromEmail(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}/**
 * Obtains the user email that corresponds to a given URL
 * @param  {URL.URL} userURL The user URL
 * @return {string} userEmail The user email
 */
function getUserEmailFromURL(e){var t=divideURL(e);return t.identity.replace("/","")+"@"+t.domain}/**
 * Check if the user identifier is already in the URL format, if not, convert to URL format
 * @param  {string}   identifier  user identifier
 * @return {string}   userURL    the user URL
 */
function convertToUserURL(e){
// check if the identifier is already in the url format
if("user://"===e.substring(0,7)){var t=divideURL(e);
//check if the url is well formated
if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return getUserURLFromEmail(e)}function isDataObjectURL(e){var t=["domain-idp","runtime","domain","hyperty"],r=e.split("://"),n=r[0];return-1===t.indexOf(n)}function isLegacy(e){return e.split("@").length>1}function isURL(e){return e.split("/").length>=3}function isUserURL(e){return"user"===divideURL(e).type}function isHypertyURL(e){return"hyperty"===divideURL(e).type}/**
 * get information relative each component configured on runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @return {object}               return an object with all configurations;
 */
function getConfigurationResources(e,t,r){return e[t][r]}/**
 * Build a full url with the runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @param  {string} type          resource to get, like a hyperty name or protocolstub name;
 * @param  {boolean} useFallback  if true the function will check if have a fallback url;
 * @return {string}               partial url to contact the resource;
 */
function buildURL(e,t,r,n){var i=arguments.length>4&&void 0!==arguments[4]&&arguments[4],u=e[t],a=void 0;if(!u.hasOwnProperty(r))throw Error("The configuration "+(0,o.default)(u,"",2)+" don't have the "+r+" resource you are looking for");var s=u[r];
// console.log(url);
return n?(a=s.prefix+e.domain+s.suffix+n,s.hasOwnProperty("fallback")&&i&&(a=s.fallback.indexOf("%domain%")?s.fallback.replace(/(%domain%)/g,e.domain)+n:s.fallback+n)):a=s.prefix+e.domain+s.suffix,a}/**
 * Generate a Global Unique ID
 *
 * @returns String;
 */
function generateGUID(){function s4(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()}function getUserIdentityDomain(e){var t=divideURL(e),r=t.domain.split("."),n=r.length;return 1==n?r[n-1]:r[n-2]+"."+r[n-1]}/**
 * Check if URL is from a backend service
 * @param  {string} url     URL to be processed
 * @return {boolean}
 */
function isBackendServiceURL(e){var t=divideURL(e),r=t.domain.split("."),n=["domain","global","domain-idp"],o=["registry","msg-node"],i=void 0;return r.length>1&&(i=r.filter(function(e){return-1!==o.indexOf(e)})[0]),!(!i||-1===o.indexOf(i))||!!t.type&&-1!==n.indexOf(t.type)}function divideEmail(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function assign(e,t,r){e||(e={}),"string"==typeof t&&(t=parseAttributes(t));for(var n=t.length-1,o=0;o<n;++o){var i=t[o];i in e||(e[i]={}),e=e[i]}e[t[n]]=r}function splitObjectURL(e){var t=e.split("/"),r=t[0]+"//"+t[2]+"/"+t[3],n=t[5],o={url:r,resource:n};return o}function checkAttribute(e){var t=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9.]+@[a-zA-Z0-9]+(-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,r=[],n=[];if(null==e.match(t))n=e.split(".");else{for(var o=void 0;null!==(o=t.exec(e));)
// This is necessary to avoid infinite loops with zero-width matches
o.index===t.lastIndex&&t.lastIndex++,
// The result can be accessed through the `m`-variable.
o.forEach(function(e,t){0===t&&r.push(e)});var i=void 0;r.forEach(function(t){i=e.replace(t,"*-*"),n=i.split(".").map(function(e){return"*-*"===e?t:e})})}return n}function parseAttributes(e){var t=/([0-9a-zA-Z][-\w]*):\/\//g;if(e.includes("://")){var r=e.split(t)[0],n=r.split("."),o=e.replace(r,"");if(e.includes("identity")){var i=o.split("identity.");o=i[0].slice(".",-1),i=i[1].split("."),n.push(o,"identity"),n=n.concat(i)}else n.push(o);return n.filter(Boolean)}return e.split(".")}function isEmpty(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return(0,o.default)(e)===(0,o.default)({})}function chatkeysToStringCloner(e){var t={},r=(0,u.default)(e);if(r)try{for(var n=0;n<r.length;n++){var o=r[n];t[o]={},t[o].sessionKey=e[o].sessionKey.toString(),t[o].isToEncrypt=e[o].isToEncrypt}}catch(e){}return t}function chatkeysToArrayCloner(e){var t={},r=(0,u.default)(e);if(r)try{for(var n=0;n<r.length;n++){var o=r[n];t[o]={};var i=JSON.parse("["+e[o].sessionKey+"]");t[o].sessionKey=new Uint8Array(i),t[o].isToEncrypt=e[o].isToEncrypt}}catch(e){}return t}function parseMessageURL(e){var t=e.split("/");return t.length<=6?t[0]+"//"+t[2]+"/"+t[3]:t[0]+"//"+t[2]+"/"+t[3]+"/"+t[4]}function availableSpace(e,t){var r=(e/t).toFixed(2);return{quota:t,usage:e,percent:Number(r)}}/**
* Encodes a JS object to base 64 encode
* @param   {Object}    value    byteArray value
* @return  {string}   encoded value
*/
function encode(e){try{var t=stringify(e);return btoa(t)}catch(e){throw e}}/**
  * Decode a base64 string to object
  * @param   {string_b64}    value    value encoded in base 64
  * @return  {Object} decodedValue
  */
function decode(e){try{return JSON.parse(atob(e))}catch(e){throw e}}/**
* Decode a base64 string to Uint8Array
* @param   {string_b64}    value    byteArray value
* @return  {Uint8Array}   encoded value
*/
function decodeToUint8Array(e){try{return new Uint8Array(decode(e))}catch(e){throw e}}/**
* Converts a JS object to string
* NOTE: Special conversion for Uint8Arrays
* @param   {Object}    value    byteArray value
* @return  {Uint8Array}   encoded value
*/
function stringify(e){try{return e.constructor===Uint8Array?"["+e.toString()+"]":(0,o.default)(e)}catch(e){throw e}}/**
* Converts a stringified object to object
* @param   {String}    value    byteArray value
* @return  {Object}   encoded value
*/
function parse(e){try{return JSON.parse(e)}catch(e){throw e}}/**
* Converts a stringified object to object
* @param   {String}    value    byteArray value
* @return  {Uint8Array}   encoded value
*/
function parseToUint8Array(e){try{return new Uint8Array(parse(e))}catch(e){throw e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(113),o=_interopRequireDefault(n),i=r(107),u=_interopRequireDefault(i);t.divideURL=divideURL,t.emptyObject=emptyObject,t.secondsSinceEpoch=secondsSinceEpoch,t.deepClone=deepClone,t.removePathFromURL=removePathFromURL,t.getUserURLFromEmail=getUserURLFromEmail,t.getUserEmailFromURL=getUserEmailFromURL,t.convertToUserURL=convertToUserURL,t.isDataObjectURL=isDataObjectURL,t.isLegacy=isLegacy,t.isURL=isURL,t.isUserURL=isUserURL,t.isHypertyURL=isHypertyURL,t.getConfigurationResources=getConfigurationResources,t.buildURL=buildURL,t.generateGUID=generateGUID,t.getUserIdentityDomain=getUserIdentityDomain,t.isBackendServiceURL=isBackendServiceURL,t.divideEmail=divideEmail,t.assign=assign,t.splitObjectURL=splitObjectURL,t.checkAttribute=checkAttribute,t.parseAttributes=parseAttributes,t.isEmpty=isEmpty,t.chatkeysToStringCloner=chatkeysToStringCloner,t.chatkeysToArrayCloner=chatkeysToArrayCloner,t.parseMessageURL=parseMessageURL,t.availableSpace=availableSpace,t.encode=encode,t.decode=decode,t.decodeToUint8Array=decodeToUint8Array,t.stringify=stringify,t.parse=parse,t.parseToUint8Array=parseToUint8Array},/* 111 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=function(){function Operators(){(0,o.default)(this,Operators)}return(0,u.default)(Operators,[{key:"and",value:function(e){return e[0]&&e[1]}},{key:"between",value:function(e){var t=parseInt(e[0][0]),r=parseInt(e[0][1]),n=e[1];return r<t&&(n=n<t?n+=2400:n,r+=2400),n>t&&n<r}},{key:"equals",value:function(e){return"*"===String(e[0])||String(e[0])===String(e[1])}},{key:"greaterThan",value:function(e){return e[1]>e[0]}},{key:"in",value:function(e){return e[0].indexOf(e[1])>-1}},{key:"lessThan",value:function(e){return e[1]<e[0]}},{key:"not",value:function(e){return!e[0]}},{key:"or",value:function(e){return e[0]||e[1]}}]),Operators}();t.default=a,e.exports=t.default},/* 112 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=r(111),s=_interopRequireDefault(a),c=function(){/**
  * Creates a new Condition.
  * @class
  * @param  {string}  attribute
  * @param  {string}  operator
  * @param  {*}       params
  */
function Condition(e,t,r){(0,o.default)(this,Condition),this.attribute=e,this.operator=t,this.params=r,this.operators=new s.default}/**
  * Verifies if the condition is applicable to the message. First, the system value that corresponds to the attribute is retrieved; then, that value is compared with the parameter specified in the condition by executing the operator implementation. If the operator is 'in' and the name of a group is given, then the array holding the members of the group is retrieved before the comparison.
  * @param  {Object}    context   environment where the Policy Engine is being used
  * @param  {Object}    message
  */
return(0,u.default)(Condition,[{key:"isApplicable",value:function(e,t){e[this.attribute]={message:t};var r=e[this.attribute],n=void 0;return"in"!==this.operator||Array.isArray(this.params)?this.operators[this.operator]([this.params,r]):(n=e.getGroup(this.params,t.to),this.operators[this.operator]([n,r]))}}]),Condition}();/**
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
t.default=c,e.exports=t.default},/* 113 */
/***/
function(e,t,r){e.exports={default:r(114),__esModule:!0}},/* 114 */
/***/
function(e,t,r){var n=r(0),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){// eslint-disable-line no-unused-vars
return o.stringify.apply(o,arguments)}},/* 115 */
,/* 116 */
,/* 117 */
,/* 118 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(41),o=_interopRequireDefault(n),i=r(11),u=_interopRequireDefault(i),a=r(12),s=_interopRequireDefault(a),c=r(86),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}(c),l=r(119),p=_interopRequireDefault(l),d=r(120),v=_interopRequireDefault(d),y=r(121),h=_interopRequireDefault(y),_=(r(110),f.getLogger("PEP"),function(){/**
  * Creates a Policy Enforcement Point (PEP) instance
  * @param    {Object}    context
  */
function PEP(e){(0,u.default)(this,PEP);var t=this;t.pdp=new v.default(e),t.actionsService=new p.default(e),t.context=e,e.pep=t,
//TODO should be added a trigger to verify when the loadConfigurations is successfully completed
e.loadConfigurations()}/**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
return(0,s.default)(PEP,[{key:"addGUIListeners",value:function(){var e=this;e.context.messageBus.addListener(e.context.pepURL,function(t){var r=t.body.method,n=void 0;if("addToGroup"===r){var o=t.body.params.groupName,i=t.body.params.userEmail;n=e.context.addToGroup(o,i)}else if("createGroup"===r){var u=t.body.params.groupName;n=e.context.createGroup(u)}else if("addPolicy"===r){var a=t.body.params.source,s=t.body.params.key,c=t.body.params.policy,f=t.body.params.combiningAlgorithm;n=e.addPolicy(a,s,c,f)}else if("deleteGroup"===r){var l=t.body.params.groupName;n=e.context.deleteGroup(l)}else if("removePolicy"===r){var p=t.body.params.source,d=t.body.params.key;n=e.removePolicy(p,d)}else if("savePolicies"===r){var v=t.body.params.source;n=e.context.savePolicies(v)}else if("userPolicies"===r)n=e.context.userPolicies;else if("activeUserPolicy"===r){var y=t.body.params.userPolicy;y&&(e.context.activeUserPolicy=y),n=e.context.activeUserPolicy}else if("userPolicy"===r){var h=t.body.params.key;n=e.context.userPolicies[h]}else"saveActivePolicy"===r?n=e.context.saveActivePolicy():"getMyEmails"===r?n=e.context.getMyEmails():"getMyHyperties"===r?n=e.context.getMyHyperties():"groups"===r?n=e.context.groups:"getGroupsNames"===r&&(n=e.context.getGroupsNames());if("removeFromGroup"===r){var _=t.body.params.groupName,g=t.body.params.userEmail;n=e.context.removeFromGroup(_,g)}var m={type:"execute",value:n,code:200},b={id:t.id,type:"response",to:t.from,from:t.to,body:m};e.context.messageBus.postMessage(b)})}},{key:"addPolicy",value:function(e,t,r,n){if(!e)throw new Error("source is not defined");if(!t)throw new Error("key is not defined");switch(void 0===r?r=new h.default(t,[],[],n):r instanceof h.default||(r=new h.default(r.key,r.rules,r.actions,r.combiningAlgorithm)),e){case"SERVICE_PROVIDER":this.context.savePolicies(e,r,t);break;case"USER":this.context.userPolicies[t]=r,this.context.savePolicies(e);break;default:throw Error("Unknown policy source: "+e)}}},{key:"authorise",value:function(e,t){var r=this;
// log.log('[Policy.PEP Authorise] ', message);
// log.log(message);
if(!e)throw new Error("message is not defined");if(!e.from)throw new Error("message.from is not defined");if(!e.to)throw new Error("message.to is not defined");if(!e.type)throw new Error("message.type is not defined");return e.body=e.body||{},new o.default(function(n,o){e.body=e.body||{};var i=r,u=i.pdp.evaluatePolicies(e,t);"Not Applicable"===u&&(u=i.context.defaultBehaviour,e.body.auth=!1),i.actionsService.enforcePolicies(e,t).then(function(t){for(var r in t)if(e=t[r],u)e.body.auth=void 0===e.body.auth||e.body.auth,n(e);else{var i={body:{code:403,description:"Blocked by policy"},from:e.to,to:e.from,type:"response"};o(i)}},function(e){o(e)})})}},{key:"authoriseSync",value:function(e){var t=void 0;return e.body=e.body||{},t=this.pdp.evaluatePolicies(e,!0),"Not Applicable"===t&&(t=this.context.defaultBehaviour),t}},{key:"removePolicy",value:function(e,t){if(!e)throw new Error("source is not defined");if("*"!==e&&!t)throw new Error("key is not defined");switch(e){case"*":this.context.serviceProviderPolicy={},this.context.userPolicies={},this.context.activeUserPolicy=void 0,this.context.savePolicies("USER"),this.context.savePolicies("SERVICE_PROVIDER"),this.context.saveActivePolicy();break;case"SERVICE_PROVIDER":delete this.context.serviceProviderPolicy[t],this.context.savePolicies();break;case"USER":delete this.context.userPolicies[t],t===this.context.activeUserPolicy&&(this.context.activeUserPolicy=void 0,this.context.saveActivePolicy()),this.context.savePolicies("USER");break;default:throw Error("Unknown policy source: "+e)}}},{key:"messageBus",get:function(){return this.context.messageBus},set:function(e){var t=this;t.context.messageBus=e,t.addGUIListeners()}}]),PEP}());t.default=_,e.exports=t.default},/* 119 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(41),o=_interopRequireDefault(n),i=r(11),u=_interopRequireDefault(i),a=r(12),s=_interopRequireDefault(a),c=function(){function ActionsService(e){(0,u.default)(this,ActionsService),this.context=e}return(0,s.default)(ActionsService,[{key:"enforcePolicies",value:function(e,t){var r=this;return new o.default(function(n,o){var i=r.context.getPolicies(e,t);void 0!==i?void 0!==i.serviceProviderPolicy?i.serviceProviderPolicy.enforceActions(r.context,e).then(function(e){n(e)},function(e){o(e)}):void 0!==i.userPolicy?i.userPolicy.enforceActions(r.context,e).then(function(e){n(e)},function(e){o(e)}):n([e]):n([e])})}},{key:"forwardToID",value:function(e,t){var r=this;if(!r.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new o.default(function(n,o){if(r.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to){"runtime"!==e.to.split("://")[0]?r.context.runtimeRegistry.discoverHypertyPerUser(t).then(function(t){e.to=t.hypertyURL,e.body.via=void 0,n(e),r.context.runtimeRegistry._messageBus.postMessage(e)},function(e){o(e)}):n(e)}else n(e)})}},{key:"forwardToHyperty",value:function(e,t){var r=this;if(!r.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new o.default(function(n){if(r.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to){"runtime"!==e.to.split("://")[0]?(e.to=t,e.body.via=void 0,n(e),r.context.runtimeRegistry._messageBus.postMessage(e)):n(e)}else n(e)})}},{key:"sendAutomaticMessage",value:function(e,t){var r=this;return new o.default(function(n){var o={from:e.to,to:e.from,body:{value:t},type:e.type};n(e),r.context.runtimeRegistry._messageBus.postMessage(o)})}}]),ActionsService}();t.default=c,e.exports=t.default},/* 120 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=r(111),s=_interopRequireDefault(a),c=function(){function PDP(e){(0,o.default)(this,PDP),this.context=e,this.operators=new s.default}return(0,u.default)(PDP,[{key:"evaluatePolicies",value:function(e,t){var r=this.context.getPolicies(e,t),n="Not Applicable";if(void 0!==r&&((n=this.evaluatePolicy(e,r.serviceProviderPolicy,t))||"Not Applicable"===n)){var o=this.evaluatePolicy(e,r.userPolicy,t);"Not Applicable"!==o&&(n=o)}return n}},{key:"evaluatePolicy",value:function(e,t,r){var n="Not Applicable";return t&&(n=t.evaluateRules(this.context,e,r)),n}}]),PDP}();t.default=c,e.exports=t.default},/* 121 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(41),o=_interopRequireDefault(n),i=r(11),u=_interopRequireDefault(i),a=r(12),s=_interopRequireDefault(a),c=r(122),f=_interopRequireDefault(c),l=r(123),p=_interopRequireDefault(l),d=r(124),v=_interopRequireDefault(d),y=r(125),h=_interopRequireDefault(y),_=function(){function Policy(e,t,r,n){if((0,u.default)(this,Policy),!e)throw new Error("key is not defined");if(!r)throw new Error("actions are not defined");this.actions=r,this.key=e,this._setRules(t),this._setCombiningAlgorithm(n)}return(0,s.default)(Policy,[{key:"addAction",value:function(e,t){this.actions.push({method:e,param:t})}},{key:"createRule",value:function(e,t,r,n,o){void 0===o&&(o=this.getLastPriority()+1);var i=new h.default(e,t,r,n,o);this.rules.push(i)}},{key:"deleteRule",value:function(e){var t=this.rules.indexOf(e);this.rules.splice(t,1)}},{key:"enforceActions",value:function(e,t){var r=this;return new o.default(function(n,i){var u=[];if(0!==r.actions.length){for(var a in r.actions){var s=e.pep.actionsService[r.actions[a].method](t,r.actions[a].param);u.push(s)}o.default.all(u).then(function(e){n(e)},function(e){i(e)})}else n([t])})}},{key:"evaluateRules",value:function(e,t,r){var n=[];for(var o in this.rules)n.push(this.rules[o].evaluate(e,t,r));return this.combiningAlgorithm.combine(n)}},{key:"getLastPriority",value:function(){var e=[];if(0!==this.rules.length){for(var t in this.rules)e.push(this.rules[t].priority);return Math.max.apply(Math,e)}return-1}},{key:"getRuleByPriority",value:function(e){for(var t in this.rules)if(String(this.rules[t].priority)===String(e))return this.rules[t];throw Error("Rule with priority "+e+" does not exist!")}},{key:"_setCombiningAlgorithm",value:function(e){switch(e||(e="blockOverrides"),e){case"blockOverrides":this.combiningAlgorithm=new p.default;break;case"allowOverrides":this.combiningAlgorithm=new f.default;break;case"firstApplicable":this.combiningAlgorithm=new v.default;break;default:throw Error("Unknown algorithm: "+e)}}},{key:"_setRules",value:function(e){this.rules=[];for(var t in e){var r=e[t];void 0===r.priority&&(r.priority=this.getLastPriority()+1),r instanceof h.default||(r=new h.default(r.decision,r.condition,r.scope,r.target,r.priority)),this.rules.push(r)}}},{key:"sortRules",value:function(){return this.rules.sort(function(e,t){var r=e.priority,n=t.priority;return r<n?-1:r>n?1:0})}}]),Policy}();t.default=_,e.exports=t.default},/* 122 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=function(){function AllowOverrides(){(0,o.default)(this,AllowOverrides)}return(0,u.default)(AllowOverrides,[{key:"combine",/**
    * Given an array of individual authorization decisions, prioritizes a positive one.
    * @param    {boolean[]}   decisions
    * @returns  {boolean}
    */
value:function(e){return-1!==e.indexOf(!0)||-1===e.indexOf(!1)&&"Not Applicable"}}]),AllowOverrides}();t.default=a,e.exports=t.default},/* 123 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=function(){function BlockOverrides(){(0,o.default)(this,BlockOverrides)}return(0,u.default)(BlockOverrides,[{key:"combine",/**
    * Given an array of individual authorisation decisions, prioritises a negative one.
    * @param    {boolean[]}   decisions
    * @returns  {boolean}
    */
value:function(e){return-1===e.indexOf(!1)&&(-1!==e.indexOf(!0)||"Not Applicable")}}]),BlockOverrides}();t.default=a,e.exports=t.default},/* 124 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=function(){function FirstApplicable(){(0,o.default)(this,FirstApplicable)}return(0,u.default)(FirstApplicable,[{key:"combine",/**
    * Given an array of individual authorisation decisions, returns the first one different from 'Not Applicable', either positive or negative.
    * @param    {boolean[]}     decisions
    * @returns  {boolean}
    */
value:function(e){for(var t in e)if("Not Applicable"!==e[t])return e[t];return"Not Applicable"}}]),FirstApplicable}();t.default=a,e.exports=t.default},/* 125 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=r(126),s=_interopRequireDefault(a),c=r(112),f=_interopRequireDefault(c),l=r(110),p=function(){function Rule(e,t,r,n,i){(0,o.default)(this,Rule),this.decision=e,this.setCondition(t),this.priority=i,this.scope=r,this.target=n}return(0,u.default)(Rule,[{key:"setCondition",value:function(e){if(e instanceof f.default||e instanceof s.default||e instanceof s.default)this.condition=e;else{switch(e.attribute){case"subscription":this.condition=new s.default(e.attribute,e.operator,e.params);break;case void 0:this.condition=new s.default(e);break;default:this.condition=new f.default(e.attribute,e.operator,e.params)}}}},{key:"evaluate",value:function(e,t,r){var n=r?t.to:t.from,o=void 0;switch(this.scope){case"global":break;case"hyperty":if((0,l.isDataObjectURL)(n)){var i=e.runtimeRegistry.getReporterURLSynchonous((0,l.removePathFromURL)(n));void 0!==i&&(o=e.runtimeRegistry.getHypertyName(i))}else"hyperty"===n.split("://")[0]&&(o=e.runtimeRegistry.getHypertyName((0,l.removePathFromURL)(n)));if(o===this.target)break;return"Not Applicable";case"identity":var u=void 0;if((0,l.isDataObjectURL)(n)){var a=e.runtimeRegistry.getReporterURLSynchonous((0,l.removePathFromURL)(n));u=e.runtimeRegistry.getHypertyOwner(a)}else"hyperty"===n.split("://")[0]&&(u=e.runtimeRegistry.getHypertyOwner((0,l.removePathFromURL)(n)));if(void 0!==u&&(u=(0,l.getUserEmailFromURL)(u)),u===this.target)break;return"Not Applicable"}return this.condition.isApplicable(e,t,this.scope,this.target)?this.decision:"Not Applicable"}}]),Rule}();t.default=p,e.exports=t.default},/* 126 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),o=_interopRequireDefault(n),i=r(12),u=_interopRequireDefault(i),a=r(112),s=_interopRequireDefault(a),c=r(111),f=_interopRequireDefault(c),l=r(127),p=_interopRequireDefault(l),d=function(){function AdvancedCondition(e){(0,o.default)(this,AdvancedCondition),this.operators=new f.default,void 0!==e.operators&&(e=e.condition),e=this.buildCondition(e),this.condition=e}return(0,u.default)(AdvancedCondition,[{key:"buildCondition",value:function(e){return Array.isArray(e[1])?e[1]=this.buildCondition(e[1]):"subscription"===e[1].attribute?e[1]=new p.default(e[1].attribute,e[1].operator,e[1].params):e[1]=new s.default(e[1].attribute,e[1].operator,e[1].params),void 0!==e[2]&&(Array.isArray(e[2])?e[2]=this.buildCondition(e[2]):"subscription"===e[2].attribute?e[2]=new p.default(e[2].attribute,e[2].operator,e[2].params):e[2]=new s.default(e[2].attribute,e[2].operator,e[2].params)),e}},{key:"isApplicable",value:function(e,t,r,n,o,i,u){for(o||(o=this.condition[0],i=this.condition[1],u=this.condition[2]);!(i instanceof s.default)&!(i instanceof p.default)&"boolean"!=typeof i;)i=this.isApplicable(e,t,r,n,i[0],i[1],i[2]);if(void 0!==u)for(;!(u instanceof s.default)&!(u instanceof p.default)&"boolean"!=typeof u;)u=this.isApplicable(e,t,r,n,u[0],u[1],u[2]);var a="boolean"==typeof i?i:i.isApplicable(e,t,r,n),c=void 0;return void 0!==u&&(c="boolean"==typeof u?u:u.isApplicable(e,t,r,n)),this.operators[o]([a,c])}}]),AdvancedCondition}();t.default=d,e.exports=t.default},/* 127 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(63),o=_interopRequireDefault(n),i=r(11),u=_interopRequireDefault(i),a=r(12),s=_interopRequireDefault(a),c=r(64),f=_interopRequireDefault(c),l=r(128),p=_interopRequireDefault(l),d=r(65),v=_interopRequireDefault(d),y=r(112),h=_interopRequireDefault(y),_=function(e){/**
  * Creates a new SubscriptionCondition.
  * @class
  * @param  {string}  attribute
  * @param  {string}  operator
  * @param  {*}       params
  */
function SubscriptionCondition(e,t,r){return(0,u.default)(this,SubscriptionCondition),(0,f.default)(this,(SubscriptionCondition.__proto__||(0,o.default)(SubscriptionCondition)).call(this,e,t,r))}/**
  * Verifies if the subscription condition is applicable to the message. First, verifies if the message is of the subscription type; second, verifies if the message is from a remote runtime to guarantee that the subscription is being validated in the destination runtime; third, verifies if the subscription preference is met.
  * @param  {Object}    context   environment where the Policy Engine is being used
  * @param  {Object}    message
  */
return(0,v.default)(SubscriptionCondition,e),(0,s.default)(SubscriptionCondition,[{key:"isApplicable",value:function(e,t){return!!("subscribe"===t.type&e.isFromRemoteSM(t.from))&&(0,p.default)(SubscriptionCondition.prototype.__proto__||(0,o.default)(SubscriptionCondition.prototype),"isApplicable",this).call(this,e,t)}}]),SubscriptionCondition}(h.default);/**
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
t.default=_,e.exports=t.default},/* 128 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(63),o=_interopRequireDefault(n),i=r(129),u=_interopRequireDefault(i);t.default=function get(e,t,r){null===e&&(e=Function.prototype);var n=(0,u.default)(e,t);if(void 0===n){var i=(0,o.default)(e);return null===i?void 0:get(i,t,r)}if("value"in n)return n.value;var a=n.get;if(void 0!==a)return a.call(r)}},/* 129 */
/***/
function(e,t,r){e.exports={default:r(130),__esModule:!0}},/* 130 */
/***/
function(e,t,r){r(131);var n=r(0).Object;e.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}},/* 131 */
/***/
function(e,t,r){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var n=r(10),o=r(40).f;r(39)("getOwnPropertyDescriptor",function(){return function(e,t){return o(n(e),t)}})}])});