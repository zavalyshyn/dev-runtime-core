// utils
import {Sandbox, SandboxType} from '../utils/Sandbox';

// Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';

/**
* Runtime User Agent Interface
*/
export default class RuntimeUA {

  constructor() {

    let _this = this;

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/protostub/123

    let hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';

    _this.registry = new Registry(hypertyRuntimeURL);
    _this.identityModule = new IdentityModule();
    _this.policyEngine = new PolicyEngine();
    _this.messageBus = new MessageBus(_this.registry);

    // TODO: remove this event listener, only for testing
    let hypertyRuntimeURLStatus = 'hyperty-runtime://sp1/protostub/123/status';
    _this.messageBus.addListener(hypertyRuntimeURLStatus, (msg) => {
      console.log('Message bus response with message: ', msg);
    });

  }

  /**
  * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
  * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
  */
  discoverHiperty(descriptor) {
    // Body...
  }

  /**
  * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
  * @param  {Object} Object                   hypertyInstance
  * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
  */
  registerHyperty(hypertyInstance, descriptor) {
    // Body...
  }

  /**
  * Deploy Hyperty from Catalogue URL
  * @param  {URL.URL}    hyperty hypertyInstance url;
  */
  loadHyperty(hyperty) {
    // Body
  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadStub(domain) {

    var _this = this;

    return new Promise(function(resolve, reject) {

      let protoStubDescriptor;

      // Discover Protocol Stub
      // Step 2
      protoStubDescriptor = _this.registry.discoverProtostub(domain);

      if (!protoStubDescriptor) {

        // Step 3 and 4
        // TODO: get protostub | <sp-domain>/.well-known/protostub
        // for the request you can use the module request in utils;

        // Step 5 to 8
        protoStubDescriptor = _this.registry.registerStub(domain);

      }

      // Step 9 to 13
      // TODO: temporary address this only static for testing
      let protoStubURL = 'hyperty-runtime://sp1/protostub/123';
      let protoStubURLStatus = 'hyperty-runtime://sp1/protostub/123/status';
      let componentDownloadURL = 'sourcecode.js';

      let configuration = {};
      let prototStub = new Sandbox(SandboxType.Protostub, _this.messageBus);
      prototStub.deployComponent(componentDownloadURL, protoStubURLStatus, configuration);

      // Step 14
      _this.messageBus.addListener(protoStubURL, prototStub);

      // TODO: handle with promise success or fail on ProtoStub instantiate;
      resolve('ProtoStub successfully loaded');

      /* prototStub.addEventListener('message', function(event) {
        console.log('testing response - send from inside worker', event.data);
        resolve('testing response - send from inside worker', event.data);
      }); */

    });

  }

  /**
  * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
  * @param  {CatalogueURL}       url url
  */
  checkForUpdate(url) {
    // Body...
  }

}
