"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function notReallyPercentEncode(e){return encodeURI(e).replace(/%25[0-9][0-9]/g,function(e){return"%"+e.substring(3)})}function uriTemplateSubstitution(e){var r="";uriTemplateGlobalModifiers[e.charAt(0)]&&(r=e.charAt(0),e=e.substring(1));var t="",i="",n=!0,o=!1,a=!1;"+"===r?n=!1:"."===r?(i=".",t="."):"/"===r?(i="/",t="/"):"#"===r?(i="#",n=!1):";"===r?(i=";",t=";",o=!0,a=!0):"?"===r?(i="?",t="&",o=!0):"&"===r&&(i="&",t="&",o=!0);for(var s=[],l=e.split(","),u=[],d={},h=0;h<l.length;h++){var f=l[h],p=null;if(f.indexOf(":")!==-1){var c=f.split(":");f=c[0],p=parseInt(c[1],10)}for(var m={};uriTemplateSuffices[f.charAt(f.length-1)];)m[f.charAt(f.length-1)]=!0,f=f.substring(0,f.length-1);var y={truncate:p,name:f,suffices:m};u.push(y),d[f]=y,s.push(f)}var v=function(e){for(var r="",s=0,l=0;l<u.length;l++){var d=u[l],h=e(d.name);if(null===h||void 0===h||Array.isArray(h)&&0===h.length||"object"===("undefined"==typeof h?"undefined":(0,_typeof3.default)(h))&&0===(0,_keys2.default)(h).length)s++;else if(r+=l===s?i:t||",",Array.isArray(h)){o&&(r+=d.name+"=");for(var f=0;f<h.length;f++)f>0&&(r+=d.suffices["*"]?t||",":",",d.suffices["*"]&&o&&(r+=d.name+"=")),r+=n?encodeURIComponent(h[f]).replace(/!/g,"%21"):notReallyPercentEncode(h[f])}else if("object"===("undefined"==typeof h?"undefined":(0,_typeof3.default)(h))){o&&!d.suffices["*"]&&(r+=d.name+"=");var p=!0;for(var c in h)p||(r+=d.suffices["*"]?t||",":","),p=!1,r+=n?encodeURIComponent(c).replace(/!/g,"%21"):notReallyPercentEncode(c),r+=d.suffices["*"]?"=":",",r+=n?encodeURIComponent(h[c]).replace(/!/g,"%21"):notReallyPercentEncode(h[c])}else o&&(r+=d.name,a&&""===h||(r+="=")),null!=d.truncate&&(h=h.substring(0,d.truncate)),r+=n?encodeURIComponent(h).replace(/!/g,"%21"):notReallyPercentEncode(h)}return r};return v.varNames=s,{prefix:i,substitution:v}}function UriTemplate(e){if(!(this instanceof UriTemplate))return new UriTemplate(e);for(var r=e.split("{"),t=[r.shift()],i=[],n=[],o=[];r.length>0;){var a=r.shift(),s=a.split("}")[0],l=a.substring(s.length+1),u=uriTemplateSubstitution(s);n.push(u.substitution),i.push(u.prefix),t.push(l),o=o.concat(u.substitution.varNames)}this.fill=function(e){for(var r=t[0],i=0;i<n.length;i++){var o=n[i];r+=o(e),r+=t[i+1]}return r},this.varNames=o,this.template=e}function recursiveCompare(e,r){if(e===r)return!0;if(e&&r&&"object"===("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))&&"object"===("undefined"==typeof r?"undefined":(0,_typeof3.default)(r))){if(Array.isArray(e)!==Array.isArray(r))return!1;if(Array.isArray(e)){if(e.length!==r.length)return!1;for(var t=0;t<e.length;t++)if(!recursiveCompare(e[t],r[t]))return!1}else{var i;for(i in e)if(void 0===r[i]&&void 0!==e[i])return!1;for(i in r)if(void 0===e[i]&&void 0!==r[i])return!1;for(i in e)if(!recursiveCompare(e[i],r[i]))return!1}return!0}return!1}function parseURI(e){var r=String(e).replace(/^\s+|\s+$/g,"").match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);return r?{href:r[0]||"",protocol:r[1]||"",authority:r[2]||"",host:r[3]||"",hostname:r[4]||"",port:r[5]||"",pathname:r[6]||"",search:r[7]||"",hash:r[8]||""}:null}function resolveUrl(e,r){function t(e){var r=[];return e.replace(/^(\.\.?(\/|$))+/,"").replace(/\/(\.(\/|$))+/g,"/").replace(/\/\.\.$/,"/../").replace(/\/?[^\/]*/g,function(e){"/.."===e?r.pop():r.push(e)}),r.join("").replace(/^\//,"/"===e.charAt(0)?"/":"")}return r=parseURI(r||""),e=parseURI(e||""),r&&e?(r.protocol||e.protocol)+(r.protocol||r.authority?r.authority:e.authority)+t(r.protocol||r.authority||"/"===r.pathname.charAt(0)?r.pathname:r.pathname?(e.authority&&!e.pathname?"/":"")+e.pathname.slice(0,e.pathname.lastIndexOf("/")+1)+r.pathname:e.pathname)+(r.protocol||r.authority||r.pathname?r.search:r.search||e.search)+r.hash:null}function getDocumentUri(e){return e.split("#")[0]}function normSchema(e,r){if(e&&"object"===("undefined"==typeof e?"undefined":(0,_typeof3.default)(e)))if(void 0===r?r=e.id:"string"==typeof e.id&&(r=resolveUrl(r,e.id),e.id=r),Array.isArray(e))for(var t=0;t<e.length;t++)normSchema(e[t],r);else{"string"==typeof e.$ref&&(e.$ref=resolveUrl(r,e.$ref));for(var i in e)"enum"!==i&&normSchema(e[i],r)}}function defaultErrorReporter(e){e=e||"en";var r=languages[e];return function(e){var t=r[e.code]||ErrorMessagesDefault[e.code];if("string"!=typeof t)return"Unknown error code "+e.code+": "+(0,_stringify2.default)(e.messageParams);var i=e.params;return t.replace(/\{([^{}]*)\}/g,function(e,r){var t=i[r];return"string"==typeof t||"number"==typeof t?t:e})}}function ValidationError(e,r,t,i,n){if(Error.call(this),void 0===e)throw new Error("No error code supplied: "+i);this.message="",this.params=r,this.code=e,this.dataPath=t||"",this.schemaPath=i||"",this.subErrors=n||null;var o=new Error(this.message);if(this.stack=o.stack||o.stacktrace,!this.stack)try{throw o}catch(e){this.stack=e.stack||e.stacktrace}}function isTrustedUrl(e,r){if(r.substring(0,e.length)===e){var t=r.substring(e.length);if(r.length>0&&"/"===r.charAt(e.length-1)||"#"===t.charAt(0)||"?"===t.charAt(0))return!0}return!1}function createApi(e){var r,t,i=new ValidatorContext,n={setErrorReporter:function(e){return"string"==typeof e?this.language(e):(t=e,!0)},addFormat:function(){i.addFormat.apply(i,arguments)},language:function(e){return e?(languages[e]||(e=e.split("-")[0]),!!languages[e]&&(r=e,e)):r},addLanguage:function(e,r){var t;for(t in ErrorCodes)r[t]&&!r[ErrorCodes[t]]&&(r[ErrorCodes[t]]=r[t]);var i=e.split("-")[0];if(languages[i]){languages[e]=(0,_create2.default)(languages[i]);for(t in r)"undefined"==typeof languages[i][t]&&(languages[i][t]=r[t]),languages[e][t]=r[t]}else languages[e]=r,languages[i]=r;return this},freshApi:function(e){var r=createApi();return e&&r.language(e),r},validate:function(e,n,o,a){var s=defaultErrorReporter(r),l=t?function(e,r,i){return t(e,r,i)||s(e,r,i)}:s,u=new ValidatorContext(i,(!1),l,o,a);"string"==typeof n&&(n={$ref:n}),u.addSchema("",n);var d=u.validateAll(e,n,null,null,"");return!d&&a&&(d=u.banUnknownProperties(e,n)),this.error=d,this.missing=u.missing,this.valid=null===d,this.valid},validateResult:function(){var e={};return this.validate.apply(e,arguments),e},validateMultiple:function(e,n,o,a){var s=defaultErrorReporter(r),l=t?function(e,r,i){return t(e,r,i)||s(e,r,i)}:s,u=new ValidatorContext(i,(!0),l,o,a);"string"==typeof n&&(n={$ref:n}),u.addSchema("",n),u.validateAll(e,n,null,null,""),a&&u.banUnknownProperties(e,n);var d={};return d.errors=u.errors,d.missing=u.missing,d.valid=0===d.errors.length,d},addSchema:function(){return i.addSchema.apply(i,arguments)},getSchema:function(){return i.getSchema.apply(i,arguments)},getSchemaMap:function(){return i.getSchemaMap.apply(i,arguments)},getSchemaUris:function(){return i.getSchemaUris.apply(i,arguments)},getMissingUris:function(){return i.getMissingUris.apply(i,arguments)},dropSchemas:function(){i.dropSchemas.apply(i,arguments)},defineKeyword:function(){i.defineKeyword.apply(i,arguments)},defineError:function(e,r,t){if("string"!=typeof e||!/^[A-Z]+(_[A-Z]+)*$/.test(e))throw new Error("Code name must be a string in UPPER_CASE_WITH_UNDERSCORES");if("number"!=typeof r||r%1!==0||r<1e4)throw new Error("Code number must be an integer > 10000");if("undefined"!=typeof ErrorCodes[e])throw new Error("Error already defined: "+e+" as "+ErrorCodes[e]);if("undefined"!=typeof ErrorCodeLookup[r])throw new Error("Error code already used: "+ErrorCodeLookup[r]+" as "+r);ErrorCodes[e]=r,ErrorCodeLookup[r]=e,ErrorMessagesDefault[e]=ErrorMessagesDefault[r]=t;for(var i in languages){var n=languages[i];n[e]&&(n[r]=n[r]||n[e])}},reset:function(){i.reset(),this.error=null,this.missing=[],this.valid=!0},missing:[],error:null,valid:!0,normSchema:normSchema,resolveUrl:resolveUrl,getDocumentUri:getDocumentUri,errorCodes:ErrorCodes};return n.language(e||"en"),n}Object.defineProperty(exports,"__esModule",{value:!0});var _stringify=require("babel-runtime/core-js/json/stringify"),_stringify2=_interopRequireDefault(_stringify),_defineProperty=require("babel-runtime/core-js/object/define-property"),_defineProperty2=_interopRequireDefault(_defineProperty),_isFrozen=require("babel-runtime/core-js/object/is-frozen"),_isFrozen2=_interopRequireDefault(_isFrozen),_create=require("babel-runtime/core-js/object/create"),_create2=_interopRequireDefault(_create),_typeof2=require("babel-runtime/helpers/typeof"),_typeof3=_interopRequireDefault(_typeof2),_keys=require("babel-runtime/core-js/object/keys"),_keys2=_interopRequireDefault(_keys);_keys2.default||(Object.keys=function(){var e=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],i=t.length;return function(n){if("object"!==("undefined"==typeof n?"undefined":(0,_typeof3.default)(n))&&"function"!=typeof n||null===n)throw new TypeError("Object.keys called on non-object");var o=[];for(var a in n)e.call(n,a)&&o.push(a);if(r)for(var s=0;s<i;s++)e.call(n,t[s])&&o.push(t[s]);return o}}()),_create2.default||(Object.create=function(){function e(){}return function(r){if(1!==arguments.length)throw new Error("Object.create implementation only accepts one parameter.");return e.prototype=r,new e}}()),Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(null===this)throw new TypeError;var r=Object(this),t=r.length>>>0;if(0===t)return-1;var i=0;if(arguments.length>1&&(i=Number(arguments[1]),i!==i?i=0:0!==i&&i!==1/0&&i!==-(1/0)&&(i=(i>0||-1)*Math.floor(Math.abs(i)))),i>=t)return-1;for(var n=i>=0?i:Math.max(t-Math.abs(i),0);n<t;n++)if(n in r&&r[n]===e)return n;return-1}),_isFrozen2.default||(Object.isFrozen=function(e){for(var r="tv4_test_frozen_key";e.hasOwnProperty(r);)r+=Math.random();try{return e[r]=!0,delete e[r],!1}catch(e){return!0}});var uriTemplateGlobalModifiers={"+":!0,"#":!0,".":!0,"/":!0,";":!0,"?":!0,"&":!0},uriTemplateSuffices={"*":!0};UriTemplate.prototype={toString:function(){return this.template},fillFromObject:function(e){return this.fill(function(r){return e[r]})}};var ValidatorContext=function(e,r,t,i,n){if(this.missing=[],this.missingMap={},this.formatValidators=e?(0,_create2.default)(e.formatValidators):{},this.schemas=e?(0,_create2.default)(e.schemas):{},this.collectMultiple=r,this.errors=[],this.handleError=r?this.collectError:this.returnError,i&&(this.checkRecursive=!0,this.scanned=[],this.scannedFrozen=[],this.scannedFrozenSchemas=[],this.scannedFrozenValidationErrors=[],this.validatedSchemasKey="tv4_validation_id",this.validationErrorsKey="tv4_validation_errors_id"),n&&(this.trackUnknownProperties=!0,this.knownPropertyPaths={},this.unknownPropertyPaths={}),this.errorReporter=t||defaultErrorReporter("en"),"string"==typeof this.errorReporter)throw new Error("debug");if(this.definedKeywords={},e)for(var o in e.definedKeywords)this.definedKeywords[o]=e.definedKeywords[o].slice(0)};ValidatorContext.prototype.defineKeyword=function(e,r){this.definedKeywords[e]=this.definedKeywords[e]||[],this.definedKeywords[e].push(r)},ValidatorContext.prototype.createError=function(e,r,t,i,n,o,a){var s=new ValidationError(e,r,t,i,n);return s.message=this.errorReporter(s,o,a),s},ValidatorContext.prototype.returnError=function(e){return e},ValidatorContext.prototype.collectError=function(e){return e&&this.errors.push(e),null},ValidatorContext.prototype.prefixErrors=function(e,r,t){for(var i=e;i<this.errors.length;i++)this.errors[i]=this.errors[i].prefixWith(r,t);return this},ValidatorContext.prototype.banUnknownProperties=function(e,r){for(var t in this.unknownPropertyPaths){var i=this.createError(ErrorCodes.UNKNOWN_PROPERTY,{path:t},t,"",null,e,r),n=this.handleError(i);if(n)return n}return null},ValidatorContext.prototype.addFormat=function(e,r){if("object"===("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))){for(var t in e)this.addFormat(t,e[t]);return this}this.formatValidators[e]=r},ValidatorContext.prototype.resolveRefs=function(e,r){if(void 0!==e.$ref){if(r=r||{},r[e.$ref])return this.createError(ErrorCodes.CIRCULAR_REFERENCE,{urls:(0,_keys2.default)(r).join(", ")},"","",null,void 0,e);r[e.$ref]=!0,e=this.getSchema(e.$ref,r)}return e},ValidatorContext.prototype.getSchema=function(e,r){var t;if(void 0!==this.schemas[e])return t=this.schemas[e],this.resolveRefs(t,r);var i=e,n="";if(e.indexOf("#")!==-1&&(n=e.substring(e.indexOf("#")+1),i=e.substring(0,e.indexOf("#"))),"object"===(0,_typeof3.default)(this.schemas[i])){t=this.schemas[i];var o=decodeURIComponent(n);if(""===o)return this.resolveRefs(t,r);if("/"!==o.charAt(0))return;for(var a=o.split("/").slice(1),s=0;s<a.length;s++){var l=a[s].replace(/~1/g,"/").replace(/~0/g,"~");if(void 0===t[l]){t=void 0;break}t=t[l]}if(void 0!==t)return this.resolveRefs(t,r)}void 0===this.missing[i]&&(this.missing.push(i),this.missing[i]=i,this.missingMap[i]=i)},ValidatorContext.prototype.searchSchemas=function(e,r){if(Array.isArray(e))for(var t=0;t<e.length;t++)this.searchSchemas(e[t],r);else if(e&&"object"===("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))){"string"==typeof e.id&&isTrustedUrl(r,e.id)&&void 0===this.schemas[e.id]&&(this.schemas[e.id]=e);for(var i in e)if("enum"!==i)if("object"===(0,_typeof3.default)(e[i]))this.searchSchemas(e[i],r);else if("$ref"===i){var n=getDocumentUri(e[i]);n&&void 0===this.schemas[n]&&void 0===this.missingMap[n]&&(this.missingMap[n]=n)}}},ValidatorContext.prototype.addSchema=function(e,r){if("string"!=typeof e||"undefined"==typeof r){if("object"!==("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))||"string"!=typeof e.id)return;r=e,e=r.id}e===getDocumentUri(e)+"#"&&(e=getDocumentUri(e)),this.schemas[e]=r,delete this.missingMap[e],normSchema(r,e),this.searchSchemas(r,e)},ValidatorContext.prototype.getSchemaMap=function(){var e={};for(var r in this.schemas)e[r]=this.schemas[r];return e},ValidatorContext.prototype.getSchemaUris=function(e){var r=[];for(var t in this.schemas)e&&!e.test(t)||r.push(t);return r},ValidatorContext.prototype.getMissingUris=function(e){var r=[];for(var t in this.missingMap)e&&!e.test(t)||r.push(t);return r},ValidatorContext.prototype.dropSchemas=function(){this.schemas={},this.reset()},ValidatorContext.prototype.reset=function(){this.missing=[],this.missingMap={},this.errors=[]},ValidatorContext.prototype.validateAll=function(e,r,t,i,n){var o;if(r=this.resolveRefs(r),!r)return null;if(r instanceof ValidationError)return this.errors.push(r),r;var a,s=this.errors.length,l=null,u=null;if(this.checkRecursive&&e&&"object"===("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))){if(o=!this.scanned.length,e[this.validatedSchemasKey]){var d=e[this.validatedSchemasKey].indexOf(r);if(d!==-1)return this.errors=this.errors.concat(e[this.validationErrorsKey][d]),null}if((0,_isFrozen2.default)(e)&&(a=this.scannedFrozen.indexOf(e),a!==-1)){var h=this.scannedFrozenSchemas[a].indexOf(r);if(h!==-1)return this.errors=this.errors.concat(this.scannedFrozenValidationErrors[a][h]),null}if(this.scanned.push(e),(0,_isFrozen2.default)(e))a===-1&&(a=this.scannedFrozen.length,this.scannedFrozen.push(e),this.scannedFrozenSchemas.push([])),l=this.scannedFrozenSchemas[a].length,this.scannedFrozenSchemas[a][l]=r,this.scannedFrozenValidationErrors[a][l]=[];else{if(!e[this.validatedSchemasKey])try{(0,_defineProperty2.default)(e,this.validatedSchemasKey,{value:[],configurable:!0}),(0,_defineProperty2.default)(e,this.validationErrorsKey,{value:[],configurable:!0})}catch(r){e[this.validatedSchemasKey]=[],e[this.validationErrorsKey]=[]}u=e[this.validatedSchemasKey].length,e[this.validatedSchemasKey][u]=r,e[this.validationErrorsKey][u]=[]}}var f=this.errors.length,p=this.validateBasic(e,r,n)||this.validateNumeric(e,r,n)||this.validateString(e,r,n)||this.validateArray(e,r,n)||this.validateObject(e,r,n)||this.validateCombinations(e,r,n)||this.validateHypermedia(e,r,n)||this.validateFormat(e,r,n)||this.validateDefinedKeywords(e,r,n)||null;if(o){for(;this.scanned.length;){var c=this.scanned.pop();delete c[this.validatedSchemasKey]}this.scannedFrozen=[],this.scannedFrozenSchemas=[]}if(p||f!==this.errors.length)for(;t&&t.length||i&&i.length;){var m=t&&t.length?""+t.pop():null,y=i&&i.length?""+i.pop():null;p&&(p=p.prefixWith(m,y)),this.prefixErrors(f,m,y)}return null!==l?this.scannedFrozenValidationErrors[a][l]=this.errors.slice(s):null!==u&&(e[this.validationErrorsKey][u]=this.errors.slice(s)),this.handleError(p)},ValidatorContext.prototype.validateFormat=function(e,r){if("string"!=typeof r.format||!this.formatValidators[r.format])return null;var t=this.formatValidators[r.format].call(null,e,r);return"string"==typeof t||"number"==typeof t?this.createError(ErrorCodes.FORMAT_CUSTOM,{message:t},"","/format",null,e,r):t&&"object"===("undefined"==typeof t?"undefined":(0,_typeof3.default)(t))?this.createError(ErrorCodes.FORMAT_CUSTOM,{message:t.message||"?"},t.dataPath||"",t.schemaPath||"/format",null,e,r):null},ValidatorContext.prototype.validateDefinedKeywords=function(e,r,t){for(var i in this.definedKeywords)if("undefined"!=typeof r[i])for(var n=this.definedKeywords[i],o=0;o<n.length;o++){var a=n[o],s=a(e,r[i],r,t);if("string"==typeof s||"number"==typeof s)return this.createError(ErrorCodes.KEYWORD_CUSTOM,{key:i,message:s},"","",null,e,r).prefixWith(null,i);if(s&&"object"===("undefined"==typeof s?"undefined":(0,_typeof3.default)(s))){var l=s.code;if("string"==typeof l){if(!ErrorCodes[l])throw new Error("Undefined error code (use defineError): "+l);l=ErrorCodes[l]}else"number"!=typeof l&&(l=ErrorCodes.KEYWORD_CUSTOM);var u="object"===(0,_typeof3.default)(s.message)?s.message:{key:i,message:s.message||"?"},d=s.schemaPath||"/"+i.replace(/~/g,"~0").replace(/\//g,"~1");return this.createError(l,u,s.dataPath||null,d,null,e,r)}}return null},ValidatorContext.prototype.validateBasic=function(e,r,t){var i;return(i=this.validateType(e,r,t))?i.prefixWith(null,"type"):(i=this.validateEnum(e,r,t))?i.prefixWith(null,"type"):null},ValidatorContext.prototype.validateType=function(e,r){if(void 0===r.type)return null;var t="undefined"==typeof e?"undefined":(0,_typeof3.default)(e);null===e?t="null":Array.isArray(e)&&(t="array");var i=r.type;Array.isArray(i)||(i=[i]);for(var n=0;n<i.length;n++){var o=i[n];if(o===t||"integer"===o&&"number"===t&&e%1===0)return null}return this.createError(ErrorCodes.INVALID_TYPE,{type:t,expected:i.join("/")},"","",null,e,r)},ValidatorContext.prototype.validateEnum=function(e,r){if(void 0===r.enum)return null;for(var t=0;t<r.enum.length;t++){var i=r.enum[t];if(recursiveCompare(e,i))return null}return this.createError(ErrorCodes.ENUM_MISMATCH,{value:"undefined"!=typeof JSON?(0,_stringify2.default)(e):e},"","",null,e,r)},ValidatorContext.prototype.validateNumeric=function(e,r,t){return this.validateMultipleOf(e,r,t)||this.validateMinMax(e,r,t)||this.validateNaN(e,r,t)||null};var CLOSE_ENOUGH_LOW=Math.pow(2,-51),CLOSE_ENOUGH_HIGH=1-CLOSE_ENOUGH_LOW;ValidatorContext.prototype.validateMultipleOf=function(e,r){var t=r.multipleOf||r.divisibleBy;if(void 0===t)return null;if("number"==typeof e){var i=e/t%1;if(i>=CLOSE_ENOUGH_LOW&&i<CLOSE_ENOUGH_HIGH)return this.createError(ErrorCodes.NUMBER_MULTIPLE_OF,{value:e,multipleOf:t},"","",null,e,r)}return null},ValidatorContext.prototype.validateMinMax=function(e,r){if("number"!=typeof e)return null;if(void 0!==r.minimum){if(e<r.minimum)return this.createError(ErrorCodes.NUMBER_MINIMUM,{value:e,minimum:r.minimum},"","/minimum",null,e,r);if(r.exclusiveMinimum&&e===r.minimum)return this.createError(ErrorCodes.NUMBER_MINIMUM_EXCLUSIVE,{value:e,minimum:r.minimum},"","/exclusiveMinimum",null,e,r)}if(void 0!==r.maximum){if(e>r.maximum)return this.createError(ErrorCodes.NUMBER_MAXIMUM,{value:e,maximum:r.maximum},"","/maximum",null,e,r);if(r.exclusiveMaximum&&e===r.maximum)return this.createError(ErrorCodes.NUMBER_MAXIMUM_EXCLUSIVE,{value:e,maximum:r.maximum},"","/exclusiveMaximum",null,e,r)}return null},ValidatorContext.prototype.validateNaN=function(e,r){return"number"!=typeof e?null:isNaN(e)===!0||e===1/0||e===-(1/0)?this.createError(ErrorCodes.NUMBER_NOT_A_NUMBER,{value:e},"","/type",null,e,r):null},ValidatorContext.prototype.validateString=function(e,r,t){return this.validateStringLength(e,r,t)||this.validateStringPattern(e,r,t)||null},ValidatorContext.prototype.validateStringLength=function(e,r){return"string"!=typeof e?null:void 0!==r.minLength&&e.length<r.minLength?this.createError(ErrorCodes.STRING_LENGTH_SHORT,{length:e.length,minimum:r.minLength},"","/minLength",null,e,r):void 0!==r.maxLength&&e.length>r.maxLength?this.createError(ErrorCodes.STRING_LENGTH_LONG,{length:e.length,maximum:r.maxLength},"","/maxLength",null,e,r):null},ValidatorContext.prototype.validateStringPattern=function(e,r){if("string"!=typeof e||"string"!=typeof r.pattern&&!(r.pattern instanceof RegExp))return null;var t;if(r.pattern instanceof RegExp)t=r.pattern;else{var i,n="",o=r.pattern.match(/^\/(.+)\/([img]*)$/);o?(i=o[1],n=o[2]):i=r.pattern,t=new RegExp(i,n)}return t.test(e)?null:this.createError(ErrorCodes.STRING_PATTERN,{pattern:r.pattern},"","/pattern",null,e,r)},ValidatorContext.prototype.validateArray=function(e,r,t){return Array.isArray(e)?this.validateArrayLength(e,r,t)||this.validateArrayUniqueItems(e,r,t)||this.validateArrayItems(e,r,t)||null:null},ValidatorContext.prototype.validateArrayLength=function(e,r){var t;return void 0!==r.minItems&&e.length<r.minItems&&(t=this.createError(ErrorCodes.ARRAY_LENGTH_SHORT,{length:e.length,minimum:r.minItems},"","/minItems",null,e,r),this.handleError(t))?t:void 0!==r.maxItems&&e.length>r.maxItems&&(t=this.createError(ErrorCodes.ARRAY_LENGTH_LONG,{length:e.length,maximum:r.maxItems},"","/maxItems",null,e,r),this.handleError(t))?t:null},ValidatorContext.prototype.validateArrayUniqueItems=function(e,r){if(r.uniqueItems)for(var t=0;t<e.length;t++)for(var i=t+1;i<e.length;i++)if(recursiveCompare(e[t],e[i])){var n=this.createError(ErrorCodes.ARRAY_UNIQUE,{match1:t,match2:i},"","/uniqueItems",null,e,r);if(this.handleError(n))return n}return null},ValidatorContext.prototype.validateArrayItems=function(e,r,t){if(void 0===r.items)return null;var i,n;if(Array.isArray(r.items)){for(n=0;n<e.length;n++)if(n<r.items.length){if(i=this.validateAll(e[n],r.items[n],[n],["items",n],t+"/"+n))return i}else if(void 0!==r.additionalItems)if("boolean"==typeof r.additionalItems){if(!r.additionalItems&&(i=this.createError(ErrorCodes.ARRAY_ADDITIONAL_ITEMS,{},"/"+n,"/additionalItems",null,e,r),this.handleError(i)))return i}else if(i=this.validateAll(e[n],r.additionalItems,[n],["additionalItems"],t+"/"+n))return i}else for(n=0;n<e.length;n++)if(i=this.validateAll(e[n],r.items,[n],["items"],t+"/"+n))return i;return null},ValidatorContext.prototype.validateObject=function(e,r,t){return"object"!==("undefined"==typeof e?"undefined":(0,_typeof3.default)(e))||null===e||Array.isArray(e)?null:this.validateObjectMinMaxProperties(e,r,t)||this.validateObjectRequiredProperties(e,r,t)||this.validateObjectProperties(e,r,t)||this.validateObjectDependencies(e,r,t)||null},ValidatorContext.prototype.validateObjectMinMaxProperties=function(e,r){var t,i=(0,_keys2.default)(e);return void 0!==r.minProperties&&i.length<r.minProperties&&(t=this.createError(ErrorCodes.OBJECT_PROPERTIES_MINIMUM,{propertyCount:i.length,minimum:r.minProperties},"","/minProperties",null,e,r),this.handleError(t))?t:void 0!==r.maxProperties&&i.length>r.maxProperties&&(t=this.createError(ErrorCodes.OBJECT_PROPERTIES_MAXIMUM,{propertyCount:i.length,maximum:r.maxProperties},"","/maxProperties",null,e,r),this.handleError(t))?t:null},ValidatorContext.prototype.validateObjectRequiredProperties=function(e,r){if(void 0!==r.required)for(var t=0;t<r.required.length;t++){var i=r.required[t];if(void 0===e[i]){var n=this.createError(ErrorCodes.OBJECT_REQUIRED,{key:i},"","/required/"+t,null,e,r);if(this.handleError(n))return n}}return null},ValidatorContext.prototype.validateObjectProperties=function(e,r,t){var i;for(var n in e){var o=t+"/"+n.replace(/~/g,"~0").replace(/\//g,"~1"),a=!1;if(void 0!==r.properties&&void 0!==r.properties[n]&&(a=!0,i=this.validateAll(e[n],r.properties[n],[n],["properties",n],o)))return i;if(void 0!==r.patternProperties)for(var s in r.patternProperties){var l=new RegExp(s);if(l.test(n)&&(a=!0,i=this.validateAll(e[n],r.patternProperties[s],[n],["patternProperties",s],o)))return i}if(a)this.trackUnknownProperties&&(this.knownPropertyPaths[o]=!0,delete this.unknownPropertyPaths[o]);else if(void 0!==r.additionalProperties){if(this.trackUnknownProperties&&(this.knownPropertyPaths[o]=!0,delete this.unknownPropertyPaths[o]),"boolean"==typeof r.additionalProperties){if(!r.additionalProperties&&(i=this.createError(ErrorCodes.OBJECT_ADDITIONAL_PROPERTIES,{key:n},"","/additionalProperties",null,e,r).prefixWith(n,null),this.handleError(i)))return i}else if(i=this.validateAll(e[n],r.additionalProperties,[n],["additionalProperties"],o))return i}else this.trackUnknownProperties&&!this.knownPropertyPaths[o]&&(this.unknownPropertyPaths[o]=!0)}return null},ValidatorContext.prototype.validateObjectDependencies=function(e,r,t){var i;if(void 0!==r.dependencies)for(var n in r.dependencies)if(void 0!==e[n]){var o=r.dependencies[n];if("string"==typeof o){if(void 0===e[o]&&(i=this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY,{key:n,missing:o},"","",null,e,r).prefixWith(null,n).prefixWith(null,"dependencies"),this.handleError(i)))return i}else if(Array.isArray(o))for(var a=0;a<o.length;a++){var s=o[a];if(void 0===e[s]&&(i=this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY,{key:n,missing:s},"","/"+a,null,e,r).prefixWith(null,n).prefixWith(null,"dependencies"),this.handleError(i)))return i}else if(i=this.validateAll(e,o,[],["dependencies",n],t))return i}return null},ValidatorContext.prototype.validateCombinations=function(e,r,t){return this.validateAllOf(e,r,t)||this.validateAnyOf(e,r,t)||this.validateOneOf(e,r,t)||this.validateNot(e,r,t)||null},ValidatorContext.prototype.validateAllOf=function(e,r,t){if(void 0===r.allOf)return null;for(var i,n=0;n<r.allOf.length;n++){var o=r.allOf[n];if(i=this.validateAll(e,o,[],["allOf",n],t))return i}return null},ValidatorContext.prototype.validateAnyOf=function(e,r,t){if(void 0===r.anyOf)return null;var i,n,o=[],a=this.errors.length;this.trackUnknownProperties&&(i=this.unknownPropertyPaths,n=this.knownPropertyPaths);for(var s=!0,l=0;l<r.anyOf.length;l++){this.trackUnknownProperties&&(this.unknownPropertyPaths={},this.knownPropertyPaths={});var u=r.anyOf[l],d=this.errors.length,h=this.validateAll(e,u,[],["anyOf",l],t);if(null===h&&d===this.errors.length){if(this.errors=this.errors.slice(0,a),this.trackUnknownProperties){for(var f in this.knownPropertyPaths)n[f]=!0,delete i[f];for(var p in this.unknownPropertyPaths)n[p]||(i[p]=!0);s=!1;continue}return null}h&&o.push(h.prefixWith(null,""+l).prefixWith(null,"anyOf"))}return this.trackUnknownProperties&&(this.unknownPropertyPaths=i,this.knownPropertyPaths=n),s?(o=o.concat(this.errors.slice(a)),this.errors=this.errors.slice(0,a),this.createError(ErrorCodes.ANY_OF_MISSING,{},"","/anyOf",o,e,r)):void 0},ValidatorContext.prototype.validateOneOf=function(e,r,t){if(void 0===r.oneOf)return null;var i,n,o=null,a=[],s=this.errors.length;this.trackUnknownProperties&&(i=this.unknownPropertyPaths,n=this.knownPropertyPaths);for(var l=0;l<r.oneOf.length;l++){this.trackUnknownProperties&&(this.unknownPropertyPaths={},this.knownPropertyPaths={});var u=r.oneOf[l],d=this.errors.length,h=this.validateAll(e,u,[],["oneOf",l],t);if(null===h&&d===this.errors.length){if(null!==o)return this.errors=this.errors.slice(0,s),this.createError(ErrorCodes.ONE_OF_MULTIPLE,{index1:o,index2:l},"","/oneOf",null,e,r);if(o=l,this.trackUnknownProperties){for(var f in this.knownPropertyPaths)n[f]=!0,delete i[f];for(var p in this.unknownPropertyPaths)n[p]||(i[p]=!0)}}else h&&a.push(h)}return this.trackUnknownProperties&&(this.unknownPropertyPaths=i,this.knownPropertyPaths=n),null===o?(a=a.concat(this.errors.slice(s)),this.errors=this.errors.slice(0,s),this.createError(ErrorCodes.ONE_OF_MISSING,{},"","/oneOf",a,e,r)):(this.errors=this.errors.slice(0,s),null)},ValidatorContext.prototype.validateNot=function(e,r,t){if(void 0===r.not)return null;var i,n,o=this.errors.length;this.trackUnknownProperties&&(i=this.unknownPropertyPaths,n=this.knownPropertyPaths,this.unknownPropertyPaths={},this.knownPropertyPaths={});var a=this.validateAll(e,r.not,null,null,t),s=this.errors.slice(o);return this.errors=this.errors.slice(0,o),this.trackUnknownProperties&&(this.unknownPropertyPaths=i,this.knownPropertyPaths=n),null===a&&0===s.length?this.createError(ErrorCodes.NOT_PASSED,{},"","/not",null,e,r):null},ValidatorContext.prototype.validateHypermedia=function(e,r,t){if(!r.links)return null;for(var i,n=0;n<r.links.length;n++){var o=r.links[n];if("describedby"===o.rel){for(var a=new UriTemplate(o.href),s=!0,l=0;l<a.varNames.length;l++)if(!(a.varNames[l]in e)){s=!1;break}if(s){var u=a.fillFromObject(e),d={$ref:u};if(i=this.validateAll(e,d,[],["links",n],t))return i}}}};var ErrorCodes={INVALID_TYPE:0,ENUM_MISMATCH:1,ANY_OF_MISSING:10,ONE_OF_MISSING:11,ONE_OF_MULTIPLE:12,NOT_PASSED:13,NUMBER_MULTIPLE_OF:100,NUMBER_MINIMUM:101,NUMBER_MINIMUM_EXCLUSIVE:102,NUMBER_MAXIMUM:103,NUMBER_MAXIMUM_EXCLUSIVE:104,NUMBER_NOT_A_NUMBER:105,STRING_LENGTH_SHORT:200,STRING_LENGTH_LONG:201,STRING_PATTERN:202,OBJECT_PROPERTIES_MINIMUM:300,OBJECT_PROPERTIES_MAXIMUM:301,OBJECT_REQUIRED:302,OBJECT_ADDITIONAL_PROPERTIES:303,OBJECT_DEPENDENCY_KEY:304,ARRAY_LENGTH_SHORT:400,ARRAY_LENGTH_LONG:401,ARRAY_UNIQUE:402,ARRAY_ADDITIONAL_ITEMS:403,FORMAT_CUSTOM:500,KEYWORD_CUSTOM:501,CIRCULAR_REFERENCE:600,UNKNOWN_PROPERTY:1e3},ErrorCodeLookup={};for(var key in ErrorCodes)ErrorCodeLookup[ErrorCodes[key]]=key;var ErrorMessagesDefault={INVALID_TYPE:"Invalid type: {type} (expected {expected})",ENUM_MISMATCH:"No enum match for: {value}",ANY_OF_MISSING:'Data does not match any schemas from "anyOf"',ONE_OF_MISSING:'Data does not match any schemas from "oneOf"',ONE_OF_MULTIPLE:'Data is valid against more than one schema from "oneOf": indices {index1} and {index2}',NOT_PASSED:'Data matches schema from "not"',NUMBER_MULTIPLE_OF:"Value {value} is not a multiple of {multipleOf}",NUMBER_MINIMUM:"Value {value} is less than minimum {minimum}",NUMBER_MINIMUM_EXCLUSIVE:"Value {value} is equal to exclusive minimum {minimum}",NUMBER_MAXIMUM:"Value {value} is greater than maximum {maximum}",NUMBER_MAXIMUM_EXCLUSIVE:"Value {value} is equal to exclusive maximum {maximum}",NUMBER_NOT_A_NUMBER:"Value {value} is not a valid number",STRING_LENGTH_SHORT:"String is too short ({length} chars), minimum {minimum}",STRING_LENGTH_LONG:"String is too long ({length} chars), maximum {maximum}",STRING_PATTERN:"String does not match pattern: {pattern}",OBJECT_PROPERTIES_MINIMUM:"Too few properties defined ({propertyCount}), minimum {minimum}",OBJECT_PROPERTIES_MAXIMUM:"Too many properties defined ({propertyCount}), maximum {maximum}",OBJECT_REQUIRED:"Missing required property: {key}",OBJECT_ADDITIONAL_PROPERTIES:"Additional properties not allowed",OBJECT_DEPENDENCY_KEY:"Dependency failed - key must exist: {missing} (due to key: {key})",ARRAY_LENGTH_SHORT:"Array is too short ({length}), minimum {minimum}",ARRAY_LENGTH_LONG:"Array is too long ({length}), maximum {maximum}",ARRAY_UNIQUE:"Array items are not unique (indices {match1} and {match2})",ARRAY_ADDITIONAL_ITEMS:"Additional items not allowed",FORMAT_CUSTOM:"Format validation failed ({message})",KEYWORD_CUSTOM:"Keyword failed: {key} ({message})",CIRCULAR_REFERENCE:"Circular $refs: {urls}",UNKNOWN_PROPERTY:"Unknown property (not in schema)"};ValidationError.prototype=(0,_create2.default)(Error.prototype),ValidationError.prototype.constructor=ValidationError,ValidationError.prototype.name="ValidationError",ValidationError.prototype.prefixWith=function(e,r){
if(null!==e&&(e=e.replace(/~/g,"~0").replace(/\//g,"~1"),this.dataPath="/"+e+this.dataPath),null!==r&&(r=r.replace(/~/g,"~0").replace(/\//g,"~1"),this.schemaPath="/"+r+this.schemaPath),null!==this.subErrors)for(var t=0;t<this.subErrors.length;t++)this.subErrors[t].prefixWith(e,r);return this};var languages={},tv4=createApi();tv4.addLanguage("en-gb",ErrorMessagesDefault),tv4.tv4=tv4,exports.default=tv4,module.exports=exports.default;
//# sourceMappingURL=tv4.js.map