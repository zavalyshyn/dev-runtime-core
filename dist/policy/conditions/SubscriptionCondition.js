"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _getPrototypeOf=require("babel-runtime/core-js/object/get-prototype-of"),_getPrototypeOf2=_interopRequireDefault(_getPrototypeOf),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require("babel-runtime/helpers/createClass"),_createClass3=_interopRequireDefault(_createClass2),_possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn"),_possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2),_get2=require("babel-runtime/helpers/get"),_get3=_interopRequireDefault(_get2),_inherits2=require("babel-runtime/helpers/inherits"),_inherits3=_interopRequireDefault(_inherits2),_Condition2=require("./Condition"),_Condition3=_interopRequireDefault(_Condition2),SubscriptionCondition=function(e){function t(e,r,i){return(0,_classCallCheck3.default)(this,t),(0,_possibleConstructorReturn3.default)(this,(0,_getPrototypeOf2.default)(t).call(this,e,r,i))}return(0,_inherits3.default)(t,e),(0,_createClass3.default)(t,[{key:"isApplicable",value:function(e,r,i,o){var l="subscribe"===r.type,u=e.isFromRemoteSM(r.from);return!!(l&u)&&(0,_get3.default)((0,_getPrototypeOf2.default)(t.prototype),"isApplicable",this).call(this,e,r)}}]),t}(_Condition3.default);exports.default=SubscriptionCondition,module.exports=exports.default;
//# sourceMappingURL=SubscriptionCondition.js.map