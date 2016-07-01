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

// Distribution file for MessageNodeCtx.js 
// version: 0.5.0
// Last build: Sat Jul 02 2016 00:45:21 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.MessageNodeCtx=e()}}(function(){return function e(t,r,o){function n(s,u){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!u&&c)return c(s,!0);if(i)return i(s,!0);var a=new Error("Cannot find module '"+s+"'");throw a.code="MODULE_NOT_FOUND",a}var l=r[s]={exports:{}};t[s][0].call(l.exports,function(e){var r=t[s][1][e];return n(r?r:e)},l,l.exports,e,t,r,o)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)n(o[s]);return n}({1:[function(e,t,r){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":13}],2:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/create"),__esModule:!0}},{"core-js/library/fn/object/create":14}],3:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/define-property"),__esModule:!0}},{"core-js/library/fn/object/define-property":15}],4:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/get-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/get-prototype-of":16}],5:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/keys"),__esModule:!0}},{"core-js/library/fn/object/keys":17}],6:[function(e,t,r){t.exports={"default":e("core-js/library/fn/object/set-prototype-of"),__esModule:!0}},{"core-js/library/fn/object/set-prototype-of":18}],7:[function(e,t,r){t.exports={"default":e("core-js/library/fn/symbol"),__esModule:!0}},{"core-js/library/fn/symbol":19}],8:[function(e,t,r){"use strict";r.__esModule=!0,r["default"]=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},{}],9:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var n=e("../core-js/object/define-property"),i=o(n);r["default"]=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),(0,i["default"])(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}()},{"../core-js/object/define-property":3}],10:[function(e,t,r){"use strict";var o=e("babel-runtime/core-js/object/create")["default"],n=e("babel-runtime/core-js/object/set-prototype-of")["default"];r["default"]=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=o(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(n?n(e,t):e.__proto__=t)},r.__esModule=!0},{"babel-runtime/core-js/object/create":2,"babel-runtime/core-js/object/set-prototype-of":6}],11:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}r.__esModule=!0;var n=e("../helpers/typeof"),i=o(n);r["default"]=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==("undefined"==typeof t?"undefined":(0,i["default"])(t))&&"function"!=typeof t?e:t}},{"../helpers/typeof":12}],12:[function(e,t,r){"use strict";var o=e("babel-runtime/core-js/symbol")["default"];r["default"]=function(e){return e&&e.constructor===o?"symbol":typeof e},r.__esModule=!0},{"babel-runtime/core-js/symbol":7}],13:[function(e,t,r){var o=e("../../modules/$.core");t.exports=function(e){return(o.JSON&&o.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},{"../../modules/$.core":23}],14:[function(e,t,r){var o=e("../../modules/$");t.exports=function(e,t){return o.create(e,t)}},{"../../modules/$":37}],15:[function(e,t,r){var o=e("../../modules/$");t.exports=function(e,t,r){return o.setDesc(e,t,r)}},{"../../modules/$":37}],16:[function(e,t,r){e("../../modules/es6.object.get-prototype-of"),t.exports=e("../../modules/$.core").Object.getPrototypeOf},{"../../modules/$.core":23,"../../modules/es6.object.get-prototype-of":50}],17:[function(e,t,r){e("../../modules/es6.object.keys"),t.exports=e("../../modules/$.core").Object.keys},{"../../modules/$.core":23,"../../modules/es6.object.keys":51}],18:[function(e,t,r){e("../../modules/es6.object.set-prototype-of"),t.exports=e("../../modules/$.core").Object.setPrototypeOf},{"../../modules/$.core":23,"../../modules/es6.object.set-prototype-of":52}],19:[function(e,t,r){e("../../modules/es6.symbol"),e("../../modules/es6.object.to-string"),t.exports=e("../../modules/$.core").Symbol},{"../../modules/$.core":23,"../../modules/es6.object.to-string":53,"../../modules/es6.symbol":54}],20:[function(e,t,r){t.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},{}],21:[function(e,t,r){var o=e("./$.is-object");t.exports=function(e){if(!o(e))throw TypeError(e+" is not an object!");return e}},{"./$.is-object":36}],22:[function(e,t,r){var o={}.toString;t.exports=function(e){return o.call(e).slice(8,-1)}},{}],23:[function(e,t,r){var o=t.exports={version:"1.2.6"};"number"==typeof __e&&(__e=o)},{}],24:[function(e,t,r){var o=e("./$.a-function");t.exports=function(e,t,r){if(o(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,o){return e.call(t,r,o)};case 3:return function(r,o,n){return e.call(t,r,o,n)}}return function(){return e.apply(t,arguments)}}},{"./$.a-function":20}],25:[function(e,t,r){t.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},{}],26:[function(e,t,r){t.exports=!e("./$.fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./$.fails":29}],27:[function(e,t,r){var o=e("./$");t.exports=function(e){var t=o.getKeys(e),r=o.getSymbols;if(r)for(var n,i=r(e),s=o.isEnum,u=0;i.length>u;)s.call(e,n=i[u++])&&t.push(n);return t}},{"./$":37}],28:[function(e,t,r){var o=e("./$.global"),n=e("./$.core"),i=e("./$.ctx"),s="prototype",u=function(e,t,r){var c,a,l,f=e&u.F,p=e&u.G,b=e&u.S,d=e&u.P,y=e&u.B,h=e&u.W,m=p?n:n[t]||(n[t]={}),g=p?o:b?o[t]:(o[t]||{})[s];p&&(r=t);for(c in r)a=!f&&g&&c in g,a&&c in m||(l=a?g[c]:r[c],m[c]=p&&"function"!=typeof g[c]?r[c]:y&&a?i(l,o):h&&g[c]==l?function(e){var t=function(t){return this instanceof e?new e(t):e(t)};return t[s]=e[s],t}(l):d&&"function"==typeof l?i(Function.call,l):l,d&&((m[s]||(m[s]={}))[c]=l))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,t.exports=u},{"./$.core":23,"./$.ctx":24,"./$.global":31}],29:[function(e,t,r){t.exports=function(e){try{return!!e()}catch(t){return!0}}},{}],30:[function(e,t,r){var o=e("./$.to-iobject"),n=e("./$").getNames,i={}.toString,s="object"==typeof window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],u=function(e){try{return n(e)}catch(t){return s.slice()}};t.exports.get=function(e){return s&&"[object Window]"==i.call(e)?u(e):n(o(e))}},{"./$":37,"./$.to-iobject":46}],31:[function(e,t,r){var o=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=o)},{}],32:[function(e,t,r){var o={}.hasOwnProperty;t.exports=function(e,t){return o.call(e,t)}},{}],33:[function(e,t,r){var o=e("./$"),n=e("./$.property-desc");t.exports=e("./$.descriptors")?function(e,t,r){return o.setDesc(e,t,n(1,r))}:function(e,t,r){return e[t]=r,e}},{"./$":37,"./$.descriptors":26,"./$.property-desc":41}],34:[function(e,t,r){var o=e("./$.cof");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==o(e)?e.split(""):Object(e)}},{"./$.cof":22}],35:[function(e,t,r){var o=e("./$.cof");t.exports=Array.isArray||function(e){return"Array"==o(e)}},{"./$.cof":22}],36:[function(e,t,r){t.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},{}],37:[function(e,t,r){var o=Object;t.exports={create:o.create,getProto:o.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:o.getOwnPropertyDescriptor,setDesc:o.defineProperty,setDescs:o.defineProperties,getKeys:o.keys,getNames:o.getOwnPropertyNames,getSymbols:o.getOwnPropertySymbols,each:[].forEach}},{}],38:[function(e,t,r){var o=e("./$"),n=e("./$.to-iobject");t.exports=function(e,t){for(var r,i=n(e),s=o.getKeys(i),u=s.length,c=0;u>c;)if(i[r=s[c++]]===t)return r}},{"./$":37,"./$.to-iobject":46}],39:[function(e,t,r){t.exports=!0},{}],40:[function(e,t,r){var o=e("./$.export"),n=e("./$.core"),i=e("./$.fails");t.exports=function(e,t){var r=(n.Object||{})[e]||Object[e],s={};s[e]=t(r),o(o.S+o.F*i(function(){r(1)}),"Object",s)}},{"./$.core":23,"./$.export":28,"./$.fails":29}],41:[function(e,t,r){t.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},{}],42:[function(e,t,r){t.exports=e("./$.hide")},{"./$.hide":33}],43:[function(e,t,r){var o=e("./$").getDesc,n=e("./$.is-object"),i=e("./$.an-object"),s=function(e,t){if(i(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,n){try{n=e("./$.ctx")(Function.call,o(Object.prototype,"__proto__").set,2),n(t,[]),r=!(t instanceof Array)}catch(i){r=!0}return function(e,t){return s(e,t),r?e.__proto__=t:n(e,t),e}}({},!1):void 0),check:s}},{"./$":37,"./$.an-object":21,"./$.ctx":24,"./$.is-object":36}],44:[function(e,t,r){var o=e("./$").setDesc,n=e("./$.has"),i=e("./$.wks")("toStringTag");t.exports=function(e,t,r){e&&!n(e=r?e:e.prototype,i)&&o(e,i,{configurable:!0,value:t})}},{"./$":37,"./$.has":32,"./$.wks":49}],45:[function(e,t,r){var o=e("./$.global"),n="__core-js_shared__",i=o[n]||(o[n]={});t.exports=function(e){return i[e]||(i[e]={})}},{"./$.global":31}],46:[function(e,t,r){var o=e("./$.iobject"),n=e("./$.defined");t.exports=function(e){return o(n(e))}},{"./$.defined":25,"./$.iobject":34}],47:[function(e,t,r){var o=e("./$.defined");t.exports=function(e){return Object(o(e))}},{"./$.defined":25}],48:[function(e,t,r){var o=0,n=Math.random();t.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++o+n).toString(36))}},{}],49:[function(e,t,r){var o=e("./$.shared")("wks"),n=e("./$.uid"),i=e("./$.global").Symbol;t.exports=function(e){return o[e]||(o[e]=i&&i[e]||(i||n)("Symbol."+e))}},{"./$.global":31,"./$.shared":45,"./$.uid":48}],50:[function(e,t,r){var o=e("./$.to-object");e("./$.object-sap")("getPrototypeOf",function(e){return function(t){return e(o(t))}})},{"./$.object-sap":40,"./$.to-object":47}],51:[function(e,t,r){var o=e("./$.to-object");e("./$.object-sap")("keys",function(e){return function(t){return e(o(t))}})},{"./$.object-sap":40,"./$.to-object":47}],52:[function(e,t,r){var o=e("./$.export");o(o.S,"Object",{setPrototypeOf:e("./$.set-proto").set})},{"./$.export":28,"./$.set-proto":43}],53:[function(e,t,r){},{}],54:[function(e,t,r){"use strict";var o=e("./$"),n=e("./$.global"),i=e("./$.has"),s=e("./$.descriptors"),u=e("./$.export"),c=e("./$.redefine"),a=e("./$.fails"),l=e("./$.shared"),f=e("./$.set-to-string-tag"),p=e("./$.uid"),b=e("./$.wks"),d=e("./$.keyof"),y=e("./$.get-names"),h=e("./$.enum-keys"),m=e("./$.is-array"),g=e("./$.an-object"),$=e("./$.to-iobject"),v=e("./$.property-desc"),j=o.getDesc,_=o.setDesc,w=o.create,x=y.get,P=n.Symbol,k=n.JSON,O=k&&k.stringify,S=!1,E=b("_hidden"),C=o.isEnum,T=l("symbol-registry"),M=l("symbols"),D="function"==typeof P,A=Object.prototype,N=s&&a(function(){return 7!=w(_({},"a",{get:function(){return _(this,"a",{value:7}).a}})).a})?function(e,t,r){var o=j(A,t);o&&delete A[t],_(e,t,r),o&&e!==A&&_(A,t,o)}:_,F=function(e){var t=M[e]=w(P.prototype);return t._k=e,s&&S&&N(A,e,{configurable:!0,set:function(t){i(this,E)&&i(this[E],e)&&(this[E][e]=!1),N(this,e,v(1,t))}}),t},R=function(e){return"symbol"==typeof e},U=function(e,t,r){return r&&i(M,t)?(r.enumerable?(i(e,E)&&e[E][t]&&(e[E][t]=!1),r=w(r,{enumerable:v(0,!1)})):(i(e,E)||_(e,E,v(1,{})),e[E][t]=!0),N(e,t,r)):_(e,t,r)},J=function(e,t){g(e);for(var r,o=h(t=$(t)),n=0,i=o.length;i>n;)U(e,r=o[n++],t[r]);return e},L=function(e,t){return void 0===t?w(e):J(w(e),t)},V=function(e){var t=C.call(this,e);return!(t||!i(this,e)||!i(M,e)||i(this,E)&&this[E][e])||t},W=function(e,t){var r=j(e=$(e),t);return!r||!i(M,t)||i(e,E)&&e[E][t]||(r.enumerable=!0),r},I=function(e){for(var t,r=x($(e)),o=[],n=0;r.length>n;)i(M,t=r[n++])||t==E||o.push(t);return o},q=function(e){for(var t,r=x($(e)),o=[],n=0;r.length>n;)i(M,t=r[n++])&&o.push(M[t]);return o},z=function(e){if(void 0!==e&&!R(e)){for(var t,r,o=[e],n=1,i=arguments;i.length>n;)o.push(i[n++]);return t=o[1],"function"==typeof t&&(r=t),!r&&m(t)||(t=function(e,t){if(r&&(t=r.call(this,e,t)),!R(t))return t}),o[1]=t,O.apply(k,o)}},G=a(function(){var e=P();return"[null]"!=O([e])||"{}"!=O({a:e})||"{}"!=O(Object(e))});D||(P=function(){if(R(this))throw TypeError("Symbol is not a constructor");return F(p(arguments.length>0?arguments[0]:void 0))},c(P.prototype,"toString",function(){return this._k}),R=function(e){return e instanceof P},o.create=L,o.isEnum=V,o.getDesc=W,o.setDesc=U,o.setDescs=J,o.getNames=y.get=I,o.getSymbols=q,s&&!e("./$.library")&&c(A,"propertyIsEnumerable",V,!0));var K={"for":function(e){return i(T,e+="")?T[e]:T[e]=P(e)},keyFor:function(e){return d(T,e)},useSetter:function(){S=!0},useSimple:function(){S=!1}};o.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),function(e){var t=b(e);K[e]=D?t:F(t)}),S=!0,u(u.G+u.W,{Symbol:P}),u(u.S,"Symbol",K),u(u.S+u.F*!D,"Object",{create:L,defineProperty:U,defineProperties:J,getOwnPropertyDescriptor:W,getOwnPropertyNames:I,getOwnPropertySymbols:q}),k&&u(u.S+u.F*(!D||G),"JSON",{stringify:z}),f(P,"Symbol"),f(Math,"Math",!0),f(n.JSON,"JSON",!0)},{"./$":37,"./$.an-object":21,"./$.descriptors":26,"./$.enum-keys":27,"./$.export":28,"./$.fails":29,"./$.get-names":30,"./$.global":31,"./$.has":32,"./$.is-array":35,"./$.keyof":38,"./$.library":39,"./$.property-desc":41,"./$.redefine":42,"./$.set-to-string-tag":44,"./$.shared":45,"./$.to-iobject":46,"./$.uid":48,"./$.wks":49}],55:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var n=e("babel-runtime/helpers/classCallCheck"),i=o(n),s=e("babel-runtime/helpers/createClass"),u=o(s),c=function(){function e(){if((0,i["default"])(this,e),this.constructor===e)throw new TypeError("Can not construct abstract class.");if(this.constructor===e.prototype.constructor)throw new TypeError("Please implement abstract method constructor.")}return(0,u["default"])(e,null,[{key:"loadPolicies",value:function(){throw this===e?new TypeError("Can not call static abstract method loadPolicies."):this.loadPolicies===e.loadPolicies?new TypeError("Please implement static abstract method loadPolicies."):new TypeError("Do not call static abstract method loadPolicies from child.")}},{key:"addSubscriptionPolicy",value:function(){throw this===e?new TypeError("Can not call static abstract method addSubscriptionPolicy."):this.addSubscriptionPolicy===e.addSubscriptionPolicy?new TypeError("Please implement static abstract method addSubscriptionPolicy."):new TypeError("Do not call static abstract method addSubscriptionPolicy from child.")}},{key:"isToVerify",value:function(){throw this===e?new TypeError("Can not call static abstract method isToVerify."):this.isToVerify===e.isToVerify?new TypeError("Please implement static abstract method isToVerify."):new TypeError("Do not call static abstract method isToVerify from child.")}},{key:"getApplicablePolicies",value:function(){throw this===e?new TypeError("Can not call static abstract method getApplicablePolicies."):this.getApplicablePolicies===e.getApplicablePolicies?new TypeError("Please implement static abstract method getApplicablePolicies."):new TypeError("Do not call static abstract method getApplicablePolicies from child.")}},{key:"applyPolicies",value:function(){throw this===e?new TypeError("Can not call static abstract method applyPolicies."):this.applyPolicies===e.applyPolicies?new TypeError("Please implement static abstract method applyPolicies."):new TypeError("Do not call static abstract method applyPolicies from child.")}},{key:"authorise",value:function(){throw this===e?new TypeError("Can not call static abstract method authorise."):this.authorise===e.authorise?new TypeError("Please implement static abstract method authorise."):new TypeError("Do not call static abstract method authorise from child.")}}]),e}();r["default"]=c,t.exports=r["default"]},{"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9}],56:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var n=e("babel-runtime/core-js/object/get-prototype-of"),i=o(n),s=e("babel-runtime/helpers/classCallCheck"),u=o(s),c=e("babel-runtime/helpers/createClass"),a=o(c),l=e("babel-runtime/helpers/possibleConstructorReturn"),f=o(l),p=e("babel-runtime/helpers/inherits"),b=o(p),d=e("../Context"),y=o(d),h=e("../../utils/utils"),m=function(e){function t(){(0,u["default"])(this,t);var e=(0,f["default"])(this,(0,i["default"])(t).call(this)),r=e;return r.policies=r.loadPolicies(),r.groups={},e}return(0,b["default"])(t,e),(0,a["default"])(t,[{key:"applyPolicies",value:function(e){var t=this,r=[!0,[]],o=t.getApplicablePolicies(e);return r=t.pdp.evaluate(e,o),e.body.auth=0!==o.length,t.pep.enforce(r),{message:e,policiesResult:r}}},{key:"_getDate",value:function(){var e=new Date,t=String(e.getDate());1===t.length&&(t="0"+t);var r=String(e.getMonth()+1);return 1===r.length&&(r="0"+r),t+"/"+r+"/"+e.getFullYear()}},{key:"_getList",value:function(e,t){var r=this,o=r.groups,n=[];return void 0!==o[e]&&void 0!==o[e][t]&&(n=o[e][t]),n}},{key:"_getTime",value:function(){var e=new Date,t=String(e.getMinutes());return 1===t.length&&(t="0"+t),parseInt(String(e.getHours())+t)}},{key:"_getWeekDay",value:function(){return String((new Date).getDay())}},{key:"date",set:function(e){var t=this;e.message||(t._dateAttribute="string"==typeof e?e:t._getDate())},get:function(){var e=this;return e._dateAttribute}},{key:"domain",set:function(e){var t=this;t._domainAttribute=(0,h.divideEmail)(e.message.body.identity.userProfile.username).domain},get:function(){var e=this;return e._domainAttribute}},{key:"source",set:function(e){var t=this;t._sourceAttribute=e.message.body.identity.userProfile.username},get:function(){var e=this;return e._sourceAttribute}},{key:"time",set:function(e){var t=this;e.message||(t._timeAttribute=e?e:t._getTime())},get:function(){var e=this;return e._timeAttribute}},{key:"weekday",set:function(e){var t=this;e.message||(t._weekdayAttribute=e?e:t._getWeekDay())},get:function(){var e=this;return e._weekdayAttribute}}]),t}(y["default"]);r["default"]=m,t.exports=r["default"]},{"../../utils/utils":58,"../Context":55,"babel-runtime/core-js/object/get-prototype-of":4,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9,"babel-runtime/helpers/inherits":10,"babel-runtime/helpers/possibleConstructorReturn":11}],57:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var n=e("babel-runtime/core-js/object/get-prototype-of"),i=o(n),s=e("babel-runtime/helpers/classCallCheck"),u=o(s),c=e("babel-runtime/helpers/createClass"),a=o(c),l=e("babel-runtime/helpers/possibleConstructorReturn"),f=o(l),p=e("babel-runtime/helpers/inherits"),b=o(p),d=e("./CommonCtx"),y=o(d),h=function(e){function t(){return(0,u["default"])(this,t),(0,f["default"])(this,(0,i["default"])(t).call(this))}return(0,b["default"])(t,e),(0,a["default"])(t,[{key:"loadPolicies",value:function(){return{}}},{key:"getApplicablePolicies",value:function(){var e=this,t=e.policies,r=[];for(var o in t)r.push.apply(r,t[o]);return r}},{key:"authorise",value:function(e){var t=this;e.body=e.body||{};var r=void 0,o=t.isToVerify(e);if(o){r=t.applyPolicies(e);var n=r.policiesResult[0];return n}return!0}},{key:"isToVerify",value:function(){return!0}},{key:"group",set:function(e){var t=this;t.groupAttribute=t._getList(e.scope,e.group)},get:function(){var e=this;return e.groupAttribute}}]),t}(y["default"]);r["default"]=h,t.exports=r["default"]},{"./CommonCtx":56,"babel-runtime/core-js/object/get-prototype-of":4,"babel-runtime/helpers/classCallCheck":8,"babel-runtime/helpers/createClass":9,"babel-runtime/helpers/inherits":10,"babel-runtime/helpers/possibleConstructorReturn":11}],58:[function(e,t,r){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function n(e){if(!e)throw Error("URL is needed to split");var t=/([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi,r="$1,$2,$3",o=e.replace(t,r).split(",");o[0]===e&&(o[0]="https",o[1]=e);var n={type:o[0],domain:o[1],identity:o[2]};return n}function i(e){var t=e.indexOf("@"),r={username:e.substring(0,t),domain:e.substring(t+1,e.length)};return r}function s(e){return!((0,d["default"])(e).length>0)}function u(e){if(e)return JSON.parse((0,p["default"])(e))}function c(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}function a(e){var t=n(e);return t.identity.replace("/","")+"@"+t.domain}function l(e){if("user://"===e.substring(0,7)){var t=n(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return c(e)}Object.defineProperty(r,"__esModule",{value:!0});var f=e("babel-runtime/core-js/json/stringify"),p=o(f),b=e("babel-runtime/core-js/object/keys"),d=o(b);r.divideURL=n,r.divideEmail=i,r.emptyObject=s,r.deepClone=u,r.getUserURLFromEmail=c,r.getUserEmailFromURL=a,r.convertToUserURL=l},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":5}]},{},[57])(57)});
//# sourceMappingURL=MessageNodeCtx.js.map
