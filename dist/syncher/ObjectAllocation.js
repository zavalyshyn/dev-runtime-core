"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _promise=require("babel-runtime/core-js/promise"),_promise2=_interopRequireDefault(_promise),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require("babel-runtime/helpers/createClass"),_createClass3=_interopRequireDefault(_createClass2),ObjectAllocation=function(){function e(t,r){(0,_classCallCheck3.default)(this,e);var l=this;l._url=t,l._bus=r}return(0,_createClass3.default)(e,[{key:"create",value:function(e,t,r){var l=this,a={type:"create",from:l._url,to:"domain://msg-node."+e+"/object-address-allocation",body:{scheme:t,value:{number:r}}};return new _promise2.default(function(e,t){l._bus.postMessage(a,function(r){200===r.body.code?e(r.body.value.allocated):t(r.body.desc)})})}},{key:"url",get:function(){return this._url}}]),e}();exports.default=ObjectAllocation,module.exports=exports.default;
//# sourceMappingURL=ObjectAllocation.js.map