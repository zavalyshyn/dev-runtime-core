// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import {divideURL, getUserEmailFromURL, getUserIdentityDomain, parseMessageURL } from '../utils/utils.js';
import Identity from './Identity';
import Crypto from '../cryptoManager/Crypto';
import GuiFake from './GuiFake';
import { WatchingYou } from 'service-framework/dist/Utils';

/**
*
* The Identity Module (Id Module) is the component responsible for handling the
* user identity and the association of this identity with the Hyperty instances,
* in order to make Hyperty instances identifiable. The identity in the reTHINK project
* is not fixed to a unique Identity Service Provider, but obtained through several
* different Identity sources. With this approach, the Id Module provides to the user the
* option to choose the preferred method for authentication.
* This module will thus able to support multiple Identity acquisition methods,
* such as OpenID connect 1.0, Kerberos System, or authentication through smart cards.
* For example, a user with a Google account can use the Google as an Identity Provider to provide Identity Tokens,
*  which can be used by the Identity Module to associate it with a Hyperty instance.
*
* The Identity Module uses a node package, the HelloJS, which is a client-side JavaScript API for authentication
* that facilitates the requests for the OpenID connect protocol. This method allows for some abstraction
* when making requests for different Identity Providers, such as OpenID connect used by Google, Facebook, Microsoft, for example.
*
* When a request for a user identity is made using the method loginWithRP(identifier, scope),
* this method will analyse the Identity Provider chosen to obtain an identity and will use the HelloJS node package
* with the selected Identity Provider and identity scope. After the HelloJS request for an Access Token
* to the Identity Providers, the user will be prompted to authenticate towards the Identity Provider.
* Upon receiving the Access Token, this token is validated with a RESTful web service request to an endpoint
* on the Identity Provider Authorization Server, and after the validation is done,
* an ID token is obtained with the information according to the scope required.
* This ID token is then preserved in this module that can obtained through the getIdentities()
* and is passed as return value of the loginWithRP function. The methods generateAssertion and validateAssertion have not yet been developed.
*
*/
class IdentityModule {

  /**
  * This is the constructor to initialise the Identity Module it does not require any input.
  */
  constructor(runtimeURL, runtimeCapabilities, storageManager, dataObjectsStorage, runtimeFactory) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing');
    if (!runtimeFactory) throw new Error('runtimeFactory is missing');

    _this._runtimeURL = runtimeURL;
    _this.storageManager = storageManager;
    _this.dataObjectsStorage = dataObjectsStorage;
    _this._idmURL = _this._runtimeURL + '/idm';
    _this._guiURL = _this._runtimeURL + '/identity-gui';
    _this.runtimeCapabilities = runtimeCapabilities;
    _this.runtimeFactory = runtimeFactory;

    _this._domain = divideURL(_this._runtimeURL).domain;

    _this.watchingYou = new WatchingYou();

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
    _this.identitiesList =  _this.watchingYou.watch('identitiesList', {}, true);
    _this.emailsList = [];
    let newIdentity = new Identity('guid', 'HUMAN');
    _this.identity = newIdentity;
    _this.crypto = new Crypto(_this.runtimeFactory);
    _this.currentIdentity;
    _this.defaultIdentity;

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {};

    // hashTable to store all the crypto information between two hyperties
    _this.chatKeys = {};

    // hashTable to store the symmetric keys to be used in the chat group
    _this.dataObjectSessionKeys = {};

    //failsafe to enable/disable all the criptographic functions
    _this.isToUseEncryption = true;

    // variable to know if the GUI is deployed to choose the identity. if the real GUI is not deployed, a fake gui is deployed instead.
    _this.guiDeployed = false;

    // verification of nodeJS, and in case it is nodeJS then disable encryption
    // TODO improve later, this exists because the crypto lib uses browser cryptographic methods
    //_this.isToUseEncryption = (window) ? true : false;

    // _this.loadIdentities();

  }

  //******************* GET AND SET METHODS *******************

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;
    _this.addGUIListeners();
  }

  /**
  * return the coreDiscovery component
  */
  get coreDiscovery() {
    let _this = this;
    return _this._coreDiscovery;
  }

  /**
  * Set the coreDiscovery component
  * @param {coreDiscovery} coreDiscovery
  */
  set coreDiscovery(coreDiscovery) {
    let _this = this;
    _this._coreDiscovery = coreDiscovery;
  }

  /**
  * return the registry in this idModule
  * @param {registry}           registry
  */
  get registry() {
    let _this = this;
    return _this._registry;
  }

  /**
  * Set the registry in this idModule
  * @param {registry}     reg
  */
  set registry(registry) {
    let _this = this;
    _this._registry = registry;
  }


  //******************* IDENTITY RELEATED METHODS *******************
  /**
  * gets all the information from a given userURL
  * @param  {String}  userURL     user url
  * @return {JSON}    identity    identity bundle from the userURL
  */
  getIdentity(userURL) {
    let _this = this;

    for (let index in _this.identities) {

      let identity = _this.identities[index];

      if (identity.identity === userURL) {
        return identity;
      }
    }

    throw 'identity not found';
  }

  /**
  * Function to set the current Identity with a given Identity
  * @param {Identity}        identity         identity
  */
  setCurrentIdentity(identity) {
    let _this = this;
    _this.currentIdentity = identity;
  }

  /**
  * Function to return all the identities registered within a session by a user.
  * These identities are returned in an array containing a JSON package for each user identity.
  * @return {Array<Identities>}         Identities
  */
  getIdentities() {
    let _this = this;
    return _this.identities;
  }

  getIdentitiesToChoose() {
    let _this = this;
    let identities = _this.emailsList;

    // let idps = [
    //   { domain: 'google.com', type: 'idToken'},
    //   { domain: 'microsoft.com', type: 'idToken'},
    //   { domain: 'orange.fr', type: 'idToken'},
    //   { domain: 'slack.com', type: 'Legacy'}
    // ];

    let idps = [
      { domain: 'google.com', type: 'idToken'},
      { domain: 'microsoft.com', type: 'idToken'},
      { domain: 'slack.com', type: 'Legacy'}
    ];

    return {identities: identities, idps: idps};
  }

  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
  }

  loadIdentities() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('idModule:identities').then((identities) => {

        if (identities) {
          _this.identities = identities;

          identities.forEach((identity) => {
            let timeNow = _this._secondsSinceEpoch();
            let expires = 0;

            if (identity.info && identity.info.expires) {
              expires = identity.info.expires;
            }  else if (identity.info && identity.info.tokenIDJSON && identity.info.tokenIDJSON.exp) {
              expires = identity.info.tokenIDJSON.exp;
            }

            if (!identity.hasOwnProperty('interworking') && !identity.interworking) {
              _this.defaultIdentity = identity.messageInfo;

              if (parseInt(expires) > timeNow) {
                _this.defaultIdentity.expires = parseInt(expires);
                _this.currentIdentity = _this.defaultIdentity;
              }

            }

          });
        }
        resolve();
      });
    });
  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identityBundle) {
    log.log('[getIdentityAssertion:identityBundle]', identityBundle);
    let _this = this;

    return new Promise(function(resolve, reject) {

      //CHECK whether is browser environment or nodejs
      //if it is browser, then create a fake identity

      _this.runtimeCapabilities.isAvailable('browser').then((result) => {
        log.log('runtime browser identity acquisition', result);

        if (!result) return;

        //todo: only idp should be mandatory when identityBundle exists

        if (identityBundle &&
            identityBundle.hasOwnProperty('idp')) {

          let idp = identityBundle.idp;
          let origin = identityBundle.hasOwnProperty('origin') ? identityBundle.origin : 'origin';
          let idHint = identityBundle.hasOwnProperty('idHint') ? identityBundle.idHint : '';

          _this.selectIdentityForHyperty(origin, idp, idHint).then((assertion) => {
            log.log('[IdentityModule] Identity selected by hyperty.');
            return resolve(assertion);
          }, (err) => { // if it got an error then just select identity from GUI
            // console.error('[IdentityModule] Could not select identity from hyperty.');
            _this.selectIdentityFromGUI().then((newAssertion) => {
              log.log('[IdentityModule] Identity selected by hyperty.');
              return resolve(newAssertion);
            }, (err) => {
              return reject(err);
            });
          });
        } else {

          if (_this.defaultIdentity && _this.defaultIdentity.expires > _this._secondsSinceEpoch()) {
            return resolve(_this.defaultIdentity);
          } else {
            _this.selectIdentityFromGUI().then((assertion) => {

              log.log('[IdentityModule] Identity selected from GUI.');

              if (assertion.hasOwnProperty('messageInfo')) {
                _this.defaultIdentity = assertion.messageInfo;
                return resolve(assertion.messageInfo);
              }

              _this.defaultIdentity = assertion;
              return resolve(assertion);
            }, (err) => {
              return reject(err);
            });
          }
        }
      }).catch(error => {
        console.error('Error on identity acquisition ', error);
        return reject(error);
      });

      _this.runtimeCapabilities.isAvailable('node').then((result) => {
        log.log('node identity acquisition', result);

        if (!result) return;

        if (_this.currentIdentity !== undefined) {
          //TODO verify whether the token is still valid or not.
          // should be needed to make further requests, to obtain a valid token
          return resolve(_this.currentIdentity);
        } else {
          log.log('getIdentityAssertion for nodejs');

          let idp = {type: 'idp', value: 'nodejs-idp', code: 200, auth: false};
          _this.callNodeJsGenerateMethods(idp.value, 'origin').then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });
        }

      }).catch(error => {
        console.error('Error on identity acquisition ', error);
        reject(error);
      });
    });
  }


  /**
  * Function to return all the users URLs registered within a session
  * These users URLs are returned in an array of strings.
  * @param  {Boolean}  emailFormat (Optional)   boolean to indicate to return in email format
  * @return {Array<String>}         users
  */
  getUsersIDs(emailFormat) {
    log.log('[getUsersIDs:emailFormat]', emailFormat);
    log.log('getUsersIDs:emailFormat', emailFormat);
    let _this = this;
    let users = [];

    //if request comes with the emailFormat option, then convert url to email format
    let converter = (emailFormat) ? getUserEmailFromURL : (value) => { return value; };

    for (let index in _this.identities) {
      let identity = _this.identities[index];
      users.push(converter(identity.identity));
    }

    return users;
  }

  /**
  * Function to remove an identity from the Identities array
  * @param {String}    userURL      userURL
  */
  deleteIdentity(userURL) {
    let _this = this;

    //let userURL = convertToUserURL(userID);

    for (let identity in _this.identities) {
      if (_this.identities[identity].identity === userURL) {
        _this.identities.splice(identity, 1);
      }
    }
  }

  /**
  * Function to unregister an identity from the emailsList array and not show in to the GUI
  * @param {String}    email      email
  */
  unregisterIdentity(email) {
    let _this = this;

    for (let e in _this.emailsList) {
      if (_this.emailsList[e] === email) {
        _this.emailsList.splice(e, 1);
      }
    }
  }

  /**
  * Function that sends a request to the GUI using messages. Sends all identities registered and
  * the Idps supported, and return the identity/idp received by the GUI
  * @param {Array<identity>}  identities      list of identitiies
  * @param {Array<String>}    idps            list of idps to authenticate
  * @return {Promise}         returns a chosen identity or idp
  */
  requestIdentityToGUI(identities, idps) {
    log.log('[requestIdentityToGUI:identities]', identities);
    log.log('[requestIdentityToGUI:idps]', idps);

    let _this = this;
    return new Promise(function(resolve, reject) {

      //condition to check if the real GUI is deployed. If not, deploys a fake gui
      if (_this.guiDeployed === false) {
        let guiFakeURL = _this._guiURL;
        let guiFake = new GuiFake(guiFakeURL, _this._messageBus);
        _this.guiFake = guiFake;
        _this.guiDeployed = true;
      }

      let message = {type: 'create', to: _this._guiURL, from: _this._idmURL,
        body: {value: {identities: identities, idps: idps}}};

      let callback = msg => {
        _this._messageBus.removeResponseListener(_this._idmURL, msg.id);


        // todo: to return the user URL and not the email or identifier

        if (msg.body.code === 200) {
          let selectedIdentity = msg.body;

          log.log('selectedIdentity: ', selectedIdentity.value);
          resolve(selectedIdentity);
        } else {
          reject('error on requesting an identity to the GUI');
        }
      };

      //postMessage with callback but without timeout
      try {
        _this._messageBus.postMessage(message, callback, false);
      } catch (err) {
        reject('In method callIdentityModuleFunc error: ' + err);
      }
    });
  }

  callNodeJsGenerateMethods(idp, origin) {
    log.log('[callNodeJsGenerateMethods:idp]', idp);
    log.log('[callNodeJsGenerateMethods:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {
      //debugger;
      let publicKey;
      let userkeyPair;

      //let keyPair = nodeJSKeyPairPopulate;

      //generates the RSA key pair
          _this.crypto.generateRSAKeyPair().then(function(keyPair) {

      log.log('[callNodeJsGenerateMethods:keyPair.public]', keyPair.public);


      console.log('constructor:::')
      console.log('constructor:::', keyPair.public)
      console.log('constructor:::', keyPair.public.constructor)
      publicKey = _this.crypto.stringify(keyPair.public);

      userkeyPair = keyPair;

      //log.log('[callNodeJsGenerateMethods:generateSelectedIdentity] NO_URL');
      //    return _this.generateAssertion(publicKey, origin, '', userkeyPair, idp);
      //}).then(function(url) {

      log.log('[callNodeJsGenerateMethods:generateSelectedIdentity] NO_URL');

      //let url = 'https://localhost/#state=state&code=4/-mlGUZDkPUC79MzA9sd4Sk5vMJLihmmxFvewM8yJrbs&access_token=ya29.Glv3BKDuB09-tnIKKu5WT_Zextcd7ysgWKvZbvGv-RYI0HaQ76qwIvsTF3sVuJfh2e-cztojXy0ZsjHSfa1cMfnqNKYtjg8Z2qm0POvZkJODsNVUdO2-oz7dHhvr&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ikl6NnZJNXRremZlelY2VDVadGVtdEEiLCJjX2hhc2giOiI1ZGV6Z1FrTTFyZ25FVTJFanpTUFVBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd3TERFME1pd3lNekFzTWpJeUxESXpMREU1T0N3eU9Td3hOVFlzTVRFeUxESXpOaXd4TWpZc01qSXlMREkwTml3ME15dzROaXc0TUN3eE9Ea3NNVFE0TERZNExERTVOaXd4TmpJc09USXNOakVzTWpZc01qUTRMRE15TERJeE5TdzROU3d4T1RJc01UVXhMRGs0TERRM0xESTBNaXd4TVN3eE56UXNNVGNzTWpJeUxERXhNeXd5TkRrc09EVXNNVE0xTERFeU9Dd3lOVFFzTVRJMUxERTNOQ3d5TURBc01UYzRMRGd4TERZMkxEazRMRFUwTERFMU1Td3hNelFzTVRJMUxETTFMREl5TVN3eE9UZ3NNeklzTVRBNUxETTJMRGNzTnpJc01UVTVMRFUyTERZekxEWXlMRGMwTERFNU1Td3hNellzTVRVc016WXNNVGd3TERFM09Td3hOVGdzTlRFc01UZ3NNVGt5TERFM01pd3lNamtzTWpVMUxERXhPU3cxTnl3eU16QXNNakFzTWpReUxESXdNaXd4T0RBc01URXdMREUyTnl3NE15d3lORGNzTVRVekxERTVPU3c1TVN3eE1qVXNNVGt5TERJeE9Dd3hNeXd4TlRrc01qRTNMREV5Tnl3eE1EUXNNakUwTERRNExEVXNNVEl4TERJeU9Dd3pNeXd4TWpZc09UUXNNVEU0TERneExERTJNaXd4TURJc01URXdMRGMxTERrNExETXhMREl3TWl3ek5Td3hOemtzTVRRc016Y3NNVElzTWpFMkxEWTFMREkwTlN3Mk5Td3hNRFVzTWpNM0xESTBOU3d4TkRBc01UZzBMRFU0TERJeU15dzNOeXd4TXpVc01qVXlMRElzTkRjc01UQTBMRFU1TERJMU5Td3lNVFlzTVRNM0xERTFNeXd5Tnl3eE56SXNNakl3TERFMU9Td3hPVFVzTWpFeUxESTVMREV4Tml3eE1EVXNNVEUyTERJeE1pd3lORGdzTnl3MU1pd3lPQ3d4TlRBc016QXNNamNzTWpFc01UY3NNVEkzTERnNExEVTBMREUzTkN3eE15dzBPU3d5TWpJc01UY3lMREl4TXl3eE1EZ3NNVFl5TERRM0xERTROaXd4TXpBc01qSTJMRFFzTVRjc01UZzVMRGcxTERFNE5Dd3lNVGNzTVRnMUxERTFNaXd4TVRrc01UQTBMREU1TXl3MU5Dd3lNVEVzTVRZeExERTVNU3d6TVN3ek9Dd3hNamtzTVRFM0xESXdOU3d4TURRc05pd3hOelVzTWpFNUxERXhOQ3czTERnMkxERTJNeXd4TWpZc01qVXpMREl4TXl3ek5pd3hNamtzTVRJc01UWTBMREV5Tnl3eU1qY3NNakF6TERnMUxEWTJMREl6TERVM0xERTBMREU1Tnl3eU9Dd3lOVElzTWpJeExEUXNNelFzTWpVd0xERTNOU3d5TVRnc01UZzFMREV4T1N3M01Dd3lORFlzTVRNMkxEZzVMREl3TERjd0xERXlNaXd4TURjc01qSXdMRGMxTERJd01Td3hOekFzTkRNc01qTXdMREl6Tml3ME55d3hNQ3d5TURjc01URTFMREkyTERFek1Td3lMRE1zTVN3d0xERT0iLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiNDU0MTM3NGVjMmY1OWExMWMwNWE0NDFjMTRmMTJkNTllY2UxYzVmYiIsImlhdCI6MTUwOTY0MDA0OSwiZXhwIjoxNTA5NjQzNjQ5fQ.vlWWkWcz333hA4lY0onl2jeat5eHCKvyMD_m-KieMtGqcLhtknMl3HbYTABL2k3HEdqbnNlD1G6OyRG-nDWt6qWCgI-gGJ6ZeU9Xrd5fPlFyRPj-FOAhA514uaYss10GYgt5XoArV7oXrR1-FNVZVNhyioggqJjJ4xtnZ6_j0isUxE7uZTlJLX8ixL44eoPVujmXKIJaXRYp0xf3626rnBz8znmGTt1G1jTwMNZmhZc8LxSauVFMLLoRjmLgNKgsGJNKN3ND7H6rsD0Vw5t24tlBwT_fsYIPauJJVZeqpmzy6L-pCEPUc0oJ7OqML84MB2W2zTq4uv6bMh4nQ_mdrA&authuser=0&session_state=44077304f5ec024da73af13a720afad0e4cb945d..2df8&prompt=consent';
      //_this.myHint = url;

      return _this.generateAssertion(publicKey, origin, 'url', userkeyPair, idp);

    }).then(function(value) {
      if (value) {
        resolve(value);
      } else {
        reject('Error on obtaining Identity');
      }
    }).catch(function(err) {
      log.log(err);
      reject(err);

            });

    });
  }

  fakeNodePopUp() {
    log.log('[fakeNodePopUp]');
    return new Promise((resolve, reject) => {

      let url = 'https://localhost/#state=state&code=4/xWFnH5iLpxv4W4Bm58oVqDK6vwVessKKMoNs-LsSKNY&access_token=ya29.GlsVBM3VBlBR1YNREuXqOr4G_UzvoL_y64YtOGGKJJ-QlasBW-HrV0b1HsxR4uNB7r-N-pElCleW6kNYW4WIIr6mOSp1euVD09eoDXtVZZFHuU8LEzcGYmVV7QLh&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5N2Y2MGIxMjRhNjc1NDI2NDhlYjIzYjc0YmY4YTg2MDJkY2I4YTYifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im94X1Vva3FwRDNkMjBpZzRXeEd2WlEiLCJjX2hhc2giOiJFem9RYmNwdGJxQlhoa0NEZGVOUFNRIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd4TERFeU9Dd3hNRGdzTVRnekxESTFNeXd5TlN3eU16WXNPVGdzT0RBc016a3NNakl4TERrekxESXhMRFV4TERFNUxERXlMRFEzTERFd0xESTFOU3d5Tnl3eU1qWXNNVFV4TERFNU55d3hNRGNzTVRRekxERTJOeXd4T1N3eE5EQXNNVGs1TERFNE9Dd3lNelFzTVRNMUxEVTFMREl3TlN3eU1Ua3NNVGdzT0RRc01qSXlMREV4TUN3eU1Ea3NNVFU1TERFNE5Td3lORFFzTWpRM0xERXhPQ3d4T0RBc01qQXhMREV6T1N3eE1pd3lNakFzTVRBNExERTROaXd6T1N3eU1qQXNPRFFzTVRVeExESTFNeXd6TlN3MU1Td3hPVEVzT0RFc01UYzBMREU0T1N3NExEa3dMREkxTWl3eU1EWXNNalFzTVRVekxERTRPQ3d5TlRJc01qUXhMRFV4TERFMU9TdzVMREU0TERFM05Dd3pNaXd4T0RNc01qSXpMREU1Tml3ME1Td3hOeklzTlRNc01qRXNNemNzTWpReUxERTNOeXd4T1Rjc05Dd3lOQ3d4Tnprc01UYzRMREUxTnl3eE1UWXNNakkyTERjd0xERXdPQ3d4TkRFc01UZzVMREU1TWl3eU16Z3NNVEE0TERFeU9Dd3hNelFzTkRBc01pd3hOemtzTmpjc01UQXhMRE01TERjM0xESXhPQ3cwT0N3eU5UQXNNVGsyTERjd0xEZzBMREUyTml3eE55d3hOVFlzTlRZc01UTTFMRFFzTkRNc01UYzRMREkxTkN3ME5Dd3lOeXd4Tnpjc01UYzRMREUwTlN3eE5ESXNNVFF3TERJMUxERTBOU3d4TnpNc05ERXNNVEl4TERJeU9Dd3lORGtzTkRrc01UVTJMREl5TUN3eE1ESXNNVGd4TERFeUxERXdMREl4TkN3eE1Ea3NOVFFzTVRrekxESTBNQ3d5TVRZc01qRTRMRGNzTVRBNUxEa3dMREl4Tnl3ek1Dd3lORGNzTVRReExERTFOeXcxT1N3eU1qWXNORFlzTVRVMUxEUTBMREUxTml3NU55dzBPQ3d4T0Rrc01USXpMREU0TWl3eE5qVXNNalF3TERFd05TdzNPQ3d4T1Rnc05Ua3NNalVzTVRreUxESXhNeXd4TlRVc09EUXNNVGtzT1Rnc09EZ3NPVGNzTVRFNExERTVNU3czT1N3eE1EZ3NNakl4TERFd05Dd3lNVElzTlRBc016QXNNVGt5TERFeE1TdzNNeXd4T0RFc01USTRMRGt5TERFME9Dd3lNVEFzTWpBMExESXlNQ3d5TXpjc01UTTRMREkwTml3eE9Ea3NNVGsyTERFNE55d3pOU3d5TVRnc01qVXpMRFUzTERNd0xEWTFMRFkyTERFd015d3lPQ3d4TlRBc01USXNNakEwTERRd0xEZzBMRFF5TERFd05DdzJOU3d4TmpRc01UUTJMREl5Tnl3NE1pdzJMREUyTERFMk55d3hNak1zTVRrc01qSXhMREV6TVN3eE5UUXNOREVzT1RZc05qZ3NNakVzTVRRd0xESTJMRGc0TERFeU5pdzJOaXczTnl3NE9TdzNNeXd4T1RNc01pd3pMREVzTUN3eCIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTAxMjEwNDQsImV4cCI6MTQ5MDEyNDY0NH0.GRnWCUx5r5ll9xkCRlYwUjISxi7nQ0OtlayWeqVcmoSf9W0k9HcBH_9U1CA-LJDkJCntDtkSkQyuRF-Sh53S2QYa396fqRZONp1czj6zCIxjZX30--vOvBCGyAI8sC9vssoKciTHn1aQhzDvY7HD4C7gt0KGI3FbtYRGa_RNm6v2ngqwVq0GyqE0KuosgVw0IjxbjOShrwWSHD1UszkEMhf4dQuekrZlvfkEfZN9aWbhy4qQy0y1Eiz0jTP2b5Yp1F1KyUQcgh8ofU2mE19nWzqxsMw-CEnGOUuwjfEGPqTg6ej0TDOz6rkODMvmQ9q33tL6TMbbJWga7DxAOOXSRQ&authuser=0&session_state=68cc1dc43bf1d78f415cc69354e639bdc52fb45f..2f30&prompt=consent';
      resolve(url);
    });
  }

  callGenerateMethods(idp, origin) {
    log.log('[callGenerateMethods:idp]', idp);
    log.log('[callGenerateMethods:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {

      let publicKey;
      let userkeyPair;

      //generates the RSA key pair
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {

        log.log('[callNodeJsGenerateMethods:keyPair.public]', keyPair.public);
        log.log('[callNodeJsGenerateMethods:keyPair.private]', keyPair.private);

        publicKey = _this.crypto.stringify(keyPair.public);
        userkeyPair = keyPair;
        log.log('generateAssertion:no_hint');
        return _this.generateAssertion(publicKey, origin, '', userkeyPair, idp);

      }).then(function(url) {
        _this.myHint = url;
        log.log('generateAssertion:hint');
        return _this.generateAssertion(publicKey, origin, url, userkeyPair, idp);

      }).then(function(value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }


  loginSelectedIdentity(publicKey, origin, idp, keyPair, loginUrl) {
    log.log('[loginSelectedIdentity:publicKey]', publicKey);
    log.log('[loginSelectedIdentity:origin]', origin);
    log.log('[loginSelectedIdentity:idp]', idp);
    log.log('[loginSelectedIdentity:keyPair]', keyPair);
    log.log('[loginSelectedIdentity:loginUrl]', loginUrl);
    let _this = this;

    return new Promise((resolve, reject) => {
      log.log('[IdentityModule:generateSelectedIdentity] openPopup');
      _this.callIdentityModuleFunc('openPopup', {urlreceived: loginUrl}).then((idCode) => {
        return idCode;
      }, (err) => {
        console.error('Error while logging in for the selected identity.');
        return reject(err);
      }).then((idCode) => {
        _this.sendGenerateMessage(publicKey, origin, idCode, idp).then((newResponse) => {
          if (newResponse.hasOwnProperty('assertion')) {
            _this.storeIdentity(newResponse, keyPair).then(result => {
              resolve('Login was successfull');
            }).catch(err => { reject('Login has failed:' + err); });
          } else {
            console.error('Error while logging in for the selected identity.');
            return reject('Could not generate a valid assertion for selected identity.');
          }
        }).catch(err => { reject('On loginSelectedIdentity from method sendGenerateMessage error:  ' + err); });
      });
    });
  }


  selectIdentityForHyperty(origin, idp, idHint) {
    log.log('[selectIdentityForHyperty:origin]', origin);
    log.log('[selectIdentityForHyperty:idp]', idp);
    log.log('[selectIdentityForHyperty:idHint]', idHint);
    let _this = this;

    return new Promise((resolve, reject) => {

      //generates the RSA key pair
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {
        let publicKey = _this.crypto.stringify(keyPair.public);

        _this.sendGenerateMessage(publicKey, origin, idHint, idp).then((response) => {
          if (response.hasOwnProperty('assertion')) { // identity was logged in, just save it
            _this.storeIdentity(response, keyPair).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          } else if (response.hasOwnProperty('loginUrl')) { // identity was not logged in
            _this.loginSelectedIdentity(publicKey, origin, idp, keyPair, response.loginUrl).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          } else { // you should never get here, if you do then the IdP Proxy is not well implemented
            // console.error('GenerateAssertion returned invalid response.');
            log.log('Proceeding by logging in.');
            _this.generateSelectedIdentity(publicKey, origin, idp, keyPair).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          }
        }).catch(err => { reject('On selectIdentityForHyperty from method sendGenerateMessage error:  ' + err); });
      }).catch(err => { reject('On selectIdentityForHyperty from method generateRSAKeyPair error:  ' + err); });
    });
  }

  selectIdentityFromGUI(origin) {
    log.log('[selectIdentityFromGUI:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {
      let identitiesInfo = _this.getIdentitiesToChoose();

      _this.requestIdentityToGUI(identitiesInfo.identities, identitiesInfo.idps).then(value => {

        if (value.type === 'identity') {

        //  let chosenID = getUserURLFromEmail(value.value);
        // hack while the user url is not returned from requestIdentityToGUI;

          let chosenID = 'user://' + _this.currentIdentity.idp + '/' + value.value;

          _this.defaultIdentity = _this.currentIdentity;

          // returns the identity info from the chosen id
          for (let i in _this.identities) {
            if (_this.identities[i].identity === chosenID) {
              return resolve(_this.identities[i].messageInfo);
            }
          }
          return reject('no identity was found .');
        } else if (value.type === 'idp') {

          _this.callGenerateMethods(value.value, origin).then((value) => {
            return resolve(value);
          }, (err) => {
            return reject(err);
          });

        } else {
          return reject('error on GUI received message.');
        }
      }).catch(err => { reject('On selectIdentityFromGUI from method requestIdentityToGUI error:  ' + err); });
    });
  }

  storeIdentity(result, keyPair) {
    console.log('[storeIdentity:result]', result);
    log.log('[storeIdentity:keyPair]', keyPair);
    let _this = this;

    return new Promise((resolve, reject) => {

      if (!result.hasOwnProperty('assertion')) {
        return reject('StoreIdentity: input is not an identity assertion.');
      }

      let splitedAssertion = result.assertion.split('.');
      let assertionParsed;

      //verify if the token contains the 3 components, or just the assertion
      try {
        if (splitedAssertion[1]) {
          assertionParsed = _this.crypto.decode(splitedAssertion[1]);
        } else {
          assertionParsed = _this.crypto.decode(result.assertion);
        }
      } catch (err) {
        return reject('In storeIdentity, error parsing assertion: ' + err);
      }

      let idToken;

      //TODO remove the verification and remove the tokenIDJSON from the google idpProxy;
      if (assertionParsed.tokenIDJSON) {
        idToken = assertionParsed.tokenIDJSON;
      } else {
        idToken = assertionParsed;
      }

      idToken.idp = result.idp;

      let email = idToken.email || idToken.sub;

      // let identifier = getUserURLFromEmail(email);

      let identifier = 'user://' + idToken.idp.domain + '/' + email;

      result.identity = identifier;

      _this.identity.addIdentity(result);

      // check if exists any infoToken in the result received
      let infoToken = (result.infoToken) ? result.infoToken : {};

      let commonName = idToken.name || email.substring(0, email.indexOf('@'));
      let userProfileBundle = {username: email, cn: commonName, avatar: infoToken.picture, locale: infoToken.locale, userURL: identifier};

      let expires = undefined;
      if (infoToken.hasOwnProperty('exp')) {
        expires = infoToken.exp;
      } else if (result.hasOwnProperty('info') && result.info.hasOwnProperty('expires')) {
        expires = result.info.expires;
      }

      //creation of a new JSON with the identity to send via messages
      let newIdentity = {userProfile: userProfileBundle, idp: result.idp.domain, assertion: result.assertion, expires: expires};
      result.messageInfo = newIdentity;
      result.keyPair = keyPair;

      _this.currentIdentity = newIdentity;

      //verify if the id already exists. If already exists then do not add to the identities list;
      //to be reviewed since the identity contains data like the asssrtion and ley pairs that may be different if generated twice

      let idAlreadyExists = false;
      let oldId;
      for (let identity in _this.identities) {
        if (_this.identities[identity].identity === result.identity) {
          idAlreadyExists = true;
          oldId = _this.identities[identity];
        }
      }

      if (idAlreadyExists) { // TODO: maybe overwrite the identity

        oldId = Object.assign(oldId, result);
        resolve(oldId.messageInfo);
        let exists = false;

        //check if the identity exists in emailList, if not add it
        //This is useful if an identity was previously registered but was later unregistered
        for (let i in _this.emailsList) {
          if (_this.emailsList[i] === email) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          _this.emailsList.push(email);
        }

      } else {
        _this.emailsList.push(email);
        _this.identities.push(result);
      }

      _this.storageManager.set('idModule:identities', 0, _this.identities).then(() => {

        if (_this.identitiesList[idToken.idp.domain]) {
          _this.identitiesList[idToken.idp.domain].status = 'created';
        }
        log.log('storeIdentity:newID', newIdentity);
        resolve(newIdentity);
      }).catch(err => {
        reject('On _sendReporterSessionKey from method storeIdentity error: ' + err);
      });

    });
  }

  generateSelectedIdentity(publicKey, origin, idp, keyPair) {
    log.log('[generateSelectedIdentity:publicKey]', publicKey);
    log.log('[generateSelectedIdentity:origin]', origin);
    log.log('[generateSelectedIdentity:idp]', idp);
    log.log('[generateSelectedIdentity:keyPair]', keyPair);

    let _this = this;

    return new Promise((resolve, reject) => {
      log.log('[IdentityModule:generateSelectedIdentity] NO_URL');
      _this.generateAssertion(publicKey, origin, '', keyPair, idp).then((loginUrl) => {
        return loginUrl;
      }).then(function(url) {
        log.log('[IdentityModule:generateSelectedIdentity] URL');
        return _this.generateAssertion(publicKey, origin, url, keyPair, idp);
      }).then(function(value) {
        if (value) {
          return resolve(value);
        } else {
          return reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
        console.error(err);
        return reject(err);
      });
    });
  }

  callIdentityModuleFunc(methodName, parameters) {
    log.log('[callIdentityModuleFunc:methodName]', methodName);
    log.log('[callIdentityModuleFunc:parameters]', parameters);
    let _this = this;

    return new Promise((resolve, reject) => {
      let message = { type: 'execute', to: _this._guiURL, from: _this._idmURL,
        body: { resource: 'identity', method: methodName, params: parameters } };

        //post msg with callback but without timout
      let callback = msg => {
        _this._messageBus.removeResponseListener(_this._idmURL, msg.id);
        let result = msg.body.value;
        resolve(result);
      };
      try {

        _this._messageBus.postMessage(message, callback, false);

      } catch (err) {
        reject('In method callIdentityModuleFunc error: ' + err);
      }
    });
  }

  //******************* TOKEN METHODS *******************
  /**
  * get a Token to be added to a message
  * @param  {String}  fromURL     origin of the message
  * @param  {String}  toURL     target of the message
  * @return {JSON}    token    token to be added to the message
  */
  getToken(fromURL, toUrl) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      // log.log('[Identity.IdentityModule.getToken] from->', fromURL, '  to->', toUrl);

      if (toUrl) {
        //log.log('toUrl', toUrl);
        _this.registry.isLegacy(toUrl).then(function(result) {
          // log.log('[Identity.IdentityModule.getToken] isLEGACY: ', result);
          if (result) {

            // TODO: check if in the future other legacy hyperties have expiration times
            // if so the check should be made here (or in the getAccessToken function)
            let token = _this.getAccessToken(toUrl);
            if (token)              { return resolve(token); }

            let domain = getUserIdentityDomain(toUrl);

            // check if process to get token has already started
            if (_this.identitiesList[domain] && _this.identitiesList[domain].status === 'in-progress') {
              // The process to get the token has already started, let's wait by watching its status

              _this.watchingYou.observe('identitiesList', (change) => {

                // log.log('[Identity.IdentityModule.getToken]  identitiesList changed ' + _this.identitiesList);

                let keypath = change.keypath;

                if (keypath.includes('status')) {
                  keypath = keypath.replace('.status', '');
                }

                if (keypath === domain && change.name === 'status' && change.newValue === 'created') {
                  // log.log('[Identity.IdentityModule.getToken] token is created ' + _this.identitiesList[domain]);
                  return resolve(_this.getAccessToken(toUrl));
                }
              });
            } else { //Token does not exist and the process to get has not started yet

              _this.identitiesList[domain] = {
                status: 'in-progress'
              };

              // log.log('[Identity.IdentityModule.getToken] for-> ', domain);
              _this.callGenerateMethods(domain).then((value) => {
                // log.log('[Identity.IdentityModule.getToken] CallGeneratemethods', value);
                let token = _this.getAccessToken(toUrl);
                if (token) {
                  return resolve(token);
                } else {
                  return reject('No Access token found');
                }
              }, (err) => {
                console.error('[Identity.IdentityModule.getToken] error CallGeneratemethods');
                return reject(err);
              });
            }

          } else {
            _this._getValidToken(fromURL).then((identity) => {
              resolve(identity);
            }).catch(err => { reject('On getToken from method _getValidToken error: ' + err); });
          }
        }).catch(err => { reject('On getToken from method isLegacy error: ' + err); });
      } else {
        _this._getValidToken(fromURL).then((identity) => {
          resolve(identity);
        });
      }
    });
  }

  /**
  * get an Id Token for a HypertyURL
  * @param  {String}  hypertyURL     the Hyperty address
  * @return {JSON}    token    Id token to be added to the message
  */
  getIdToken(hypertyURL) {
    console.info('getIdToken:hypertyURL ', hypertyURL);
    let _this = this;
    return new Promise(function(resolve, reject) {
      let splitURL = hypertyURL.split('://');
      if (splitURL[0] !== 'hyperty') {

        _this._getHypertyFromDataObject(hypertyURL).then((returnedHypertyURL) => {

          let userURL = _this.registry.getHypertyOwner(returnedHypertyURL);

          if (userURL) {

            for (let index in _this.identities) {
              let identity = _this.identities[index];
              if (identity.identity === userURL) {
                return resolve(identity.messageInfo);
              }
            }
          } else {
            return reject('no identity was found ');
          }
        }).catch((reason) => {
          console.error('no identity was found: ', reason);
          reject(reason);
        });
      } else {
        let userURL = _this.registry.getHypertyOwner(hypertyURL);
        if (userURL) {

          for (let index in _this.identities) {
            let identity = _this.identities[index];
            if (identity.identity === userURL) {
              // TODO check this getIdToken when we run on nodejs environment;
              if (identity.hasOwnProperty('messageInfo')) {
                if (identity.messageInfo.hasOwnProperty('assertion')) { return resolve(identity.messageInfo); } else { //hack while idm is not reestuctured
                  identity.messageInfo.assertion = identity.assertion;
                  return resolve(identity.messageInfo);
                }
              } else {
                return resolve(identity);
              }
            }
          }
        } else {
          return reject('no identity was found.');
        }
      }
    });
  }

  /**
  * get an Access Token for a legacyURL
  * @param  {String}  legacyURL     the legacy address
  * @return {JSON}    token    Access token to be added to the message
  */
  getAccessToken(url) {
    let _this = this;

    /*  let urlSplit = url.split('.');
    let length = urlSplit.length;*/

    let domainToCheck = divideURL(url).domain;

    if (url.includes('protostub')) {
      domainToCheck = domainToCheck.replace(domainToCheck.split('.')[0] + '.', '');
    }

    let identityToReturn;
    let expirationDate = undefined;
    let timeNow = _this._secondsSinceEpoch();
    for (let index in _this.identities) {
      let identity = _this.identities[index];
      if (identity.hasOwnProperty('interworking') && identity.interworking.domain === domainToCheck) {
        // check if there is expiration time
        if (identity.hasOwnProperty('info') && identity.info.hasOwnProperty('expires')) {
          expirationDate = identity.info.expires;
          log.log('[Identity.IdentityModule.getAccessToken] Token expires in', expirationDate);
          log.log('[Identity.IdentityModule.getAccessToken] time now:', timeNow);

          // TODO: this should not be verified in this way
          // we should contact the IDP to verify this instead of using the local clock
          // but this works for now...
          if (timeNow >= expirationDate) {
            // delete current identity
            //_this.deleteIdentity(identity.identity);
            return null; // the getToken function then generates a new token
          }
        } // else this access token has no expiration time

        if (identity.hasOwnProperty('messageInfo') && identity.messageInfo.hasOwnProperty('userProfile') && identity.messageInfo.userProfile) {
          identityToReturn = { userProfile: identity.messageInfo.userProfile, access_token: identity.interworking.access_token };
          if (identity.hasOwnProperty('infoToken') && identity.infoToken.hasOwnProperty('id')) {
            identityToReturn.userProfile.id = identity.infoToken.id;
          }
        }
        return identityToReturn;
      }
    }

    return null;
  }


  //******************* OTHER METHODS *******************

  loadSessionKeys() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        if (sessionKeys) {
          //TODO: Check if this is needed and if it is, how can the key be recovered (the keyURL is stored were?)
          //sessionKeys.sessionKey = new Uint8Array(JSON.parse('[' + sessionKeys.sessionKey + ']'));
          _this.dataObjectSessionKeys = sessionKeys;
        } else {
          _this.dataObjectSessionKeys = {};
        }
        resolve();
      });
    });
  }


  sendRefreshMessage(oldIdentity) {
    let _this = this;
    let domain = _this._resolveDomain(oldIdentity.idp);
    let message;
    let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

    log.log('sendRefreshMessage:oldIdentity', oldIdentity);

    return new Promise((resolve, reject) => {
      let domain = _this._resolveDomain(oldIdentity.idp);
      let message;
      let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

      console.info('sendRefreshMessage:oldIdentity', oldIdentity);

      message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'refreshAssertion', params: {identity: assertion}}};
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In sendRefreshMessage on postMessage error: ' + err);
      }

    });

  }

  sendGenerateMessage(contents, origin, usernameHint, idpDomain) {
    log.log('[sendGenerateMessage:contents]', contents);
    log.log('[sendGenerateMessage:origin]', origin);
    log.log('[sendGenerateMessage:usernameHint]', usernameHint);
    log.log('[sendGenerateMessage:idpDomain]', idpDomain);
    log.log('sendGenerateMessage_hint');
    let _this = this;

    return new Promise((resolve, reject) => {

      let domain = _this._resolveDomain(idpDomain);
      let message;

      message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'generateAssertion', params: {contents: contents, origin: origin, usernameHint: usernameHint}}};
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In sendRefreshMessage on postMessage error: ' + err);
      }
    });
  }

  /**
  * Requests the IdpProxy from a given Domain for an identityAssertion
  *
  * @param  {DOMString} contents     contents
  * @param  {DOMString} origin       origin
  * @param  {DOMString} usernameHint usernameHint
  * @param  {JSON}      keyPair       user keyPair
  * @return {IdAssertion}              IdAssertion
  */
  generateAssertion(contents, origin, usernameHint, keyPair, idpDomain) {
    log.log('[generateAssertion:contents]', contents);
    log.log('[generateAssertion:origin]', origin);
    log.log('[generateAssertion:usernameHint]', usernameHint);
    log.log('[generateAssertion:keyPair]', keyPair);
    log.log('[generateAssertion:idpDomain]', idpDomain);
    let _this = this;

    return new Promise(function(resolve, reject) {
      log.log('[IdentityModule:generateSelectedIdentity:sendGenerateMessage]', usernameHint);
      _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((result) => {

        if (result.loginUrl) {

          _this.callIdentityModuleFunc('openPopup', {urlreceived: result.loginUrl}).then((value) => {
            log.log('[IdentityModule:generateSelectedIdentity:openPopup]', usernameHint);

            resolve(value);
          }, (err) => {
            reject(err);
          });
        } else if (result) {

          _this.storeIdentity(result, keyPair).then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });

        } else {
          reject('error on obtaining identity information');
        }

      }).catch(err => { reject('On generateAssertion from method sendGenerateMessage error: ' + err); });
    });
  }

  /**
  * Requests the IdpProxy from a given Domain to validate an IdentityAssertion
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @param  {DOMString} origin       origin
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion, origin, idpDomain) {
    log.log('[validateAssertion:assertion]', assertion);
    log.log('[validateAssertion:origin]', origin);
    log.log('[validateAssertion:idpDomain]', idpDomain);
    let _this = this;

    let domain = _this._resolveDomain(idpDomain);

    let message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'validateAssertion',
      params: {assertion: assertion, origin: origin}}};

    return new Promise(function(resolve, reject) {
      try {
        _this._messageBus.postMessage(message, (result) => {
          if (result.body.code === 200) {
            resolve(result.body.value);
          } else {
            reject('error', result.body.code);
          }
        });
      } catch (err) {
        reject('On validateAssertion from method postMessage error: ' + err);
      }
    });
  }

  addGUIListeners() {
    let _this = this;

    _this._messageBus.addListener(_this._idmURL, (msg) => {
      let funcName = msg.body.method;

      let returnedValue;
      if (funcName === 'deployGUI') {
        returnedValue = _this.deployGUI();
      } else if (funcName === 'getIdentitiesToChoose') {
        returnedValue = _this.getIdentitiesToChoose();
      } else if (funcName === 'unregisterIdentity') {
        let email = msg.body.params.email;
        returnedValue = _this.unregisterIdentity(email);
      } else if (funcName === 'generateRSAKeyPair') {
        // because generateRSAKeyPair is a promise
        // we have to send the message only after getting the key pair
        _this.crypto.generateRSAKeyPair().then((keyPair) => {
          let value = {type: 'execute', value: keyPair, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if generateRSAKeyPair method postMessage error: ' + err);
          }
        });
        return;
      } else if (funcName === 'sendGenerateMessage') {
        let contents = msg.body.params.contents;
        let origin = msg.body.params.origin;
        let usernameHint = msg.body.params.usernameHint;
        let idpDomain = msg.body.params.idpDomain;
        _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((returnedValue) => {
          let value = {type: 'execute', value: returnedValue, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if sendGenerateMessage method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'storeIdentity') {
        let result = msg.body.params.result;
        let keyPair = msg.body.params.keyPair;
        _this.storeIdentity(result, keyPair).then((returnedValue) => {
          let value = {type: 'execute', value: returnedValue, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
          }

        });
        return;
      } /*else if (funcName === 'selectIdentityForHyperty') {
        let origin = msg.body.params.origin;
        let idp = msg.body.params.idp;
        let idHint = msg.body.params.idHint;
        _this.selectIdentityForHyperty(origin, idp, idHint);
        return;
      }*/

      // if the function requested is not a promise
      let value = {type: 'execute', value: returnedValue, code: 200};
      let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
      try {
        _this._messageBus.postMessage(replyMsg);
      } catch (err) {
        reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
      }

    });
  }

  deployGUI() {
    let _this = this;
    _this.guiDeployed = true;
  }

  //******************* PRIVATE METHODS *******************
  /**
   * GetValidToken is for non legacy hyperties and verifies if the Token is still valid
   * if the token is invalid it requests a new token
   * @param  {String} hypertyURL hypertyURL
   * @return {Promise}
   */
  _getValidToken(hypertyURL) {
  //  console.info('_getValidToken:hypertyURL', hypertyURL);
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.getIdToken(hypertyURL).then(function(identity) {
        //        log.log('[Identity.IdentityModule.getValidToken] Token', identity);
        let timeNow = _this._secondsSinceEpoch();
        let completeId = _this.getIdentity(identity.userProfile.userURL);
        let expirationDate = undefined;

        if (completeId.hasOwnProperty('info')) {
          if (completeId.info.hasOwnProperty('expires')) {
            expirationDate = completeId.info.expires;
          } else if (completeId.info.hasOwnProperty('tokenIDJSON')) {
            expirationDate = completeId.info.tokenIDJSON.exp;
          } else {
            // throw 'The ID Token does not have an expiration time';
            console.info('The ID Token does not have an expiration time');
            resolve(identity);
          }
        } else if (completeId.hasOwnProperty('infoToken') && completeId.infoToken.hasOwnProperty('exp')) {
          expirationDate = completeId.infoToken.exp;
        } else {
          // throw 'The ID Token does not have an expiration time';
          console.info('The ID Token does not have an expiration time');
          resolve(identity);
        }

        log.log('[Identity.IdentityModule.getValidToken] Token expires in', expirationDate);
        log.log('[Identity.IdentityModule.getValidToken] time now:', timeNow);

        if (timeNow >= expirationDate) {
          if (identity.idp === 'google.com') {
            _this.sendRefreshMessage(identity).then((newIdentity) => {
              _this.deleteIdentity(completeId.identity);
              _this.storeIdentity(newIdentity, completeId.keyPair).then((value) => {
                resolve(value);
              }, (err) => {
                console.error('[Identity.IdentityModule.getToken] error on getToken', err);
                reject(err);
              });
            });
          } else { // microsoft.com
            _this.deleteIdentity(completeId.identity);

            // generate new idToken
            _this.callGenerateMethods(identity.idp).then((value) => {
              resolve(value);
            }).catch(err => { reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err); });
          }
        } else {
          resolve(identity);
        }
      }).catch(function(error) {
        console.error('[Identity.IdentityModule.getToken] error on getToken', error);
        reject(error);
      });
    });
  }

  /**
  * returns the reporter associated to the dataObject URL
  * @param   {String}   dataObjectURL         dataObject url
  * @return   {String}  reporter              dataObject url reporter
  */
  _getHypertyFromDataObject(dataObjectURL) {
    console.info('_getHypertyFromDataObject:dataObjectURL', dataObjectURL);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let splitedURL = divideURL(dataObjectURL);
      let domain = splitedURL.domain;
      let finalURL = parseMessageURL(dataObjectURL);

      // check if is the creator of the hyperty
      let reporterURL = _this.registry.getReporterURLSynchonous(finalURL);
      console.info('_getHypertyFromDataObject:reporterURL', reporterURL);

      if (reporterURL) {
        resolve(reporterURL);
      } else {
        // check if there is already an association from an hypertyURL to the dataObject
        let storedReporterURL = _this.dataObjectsIdentity[finalURL];
        console.info('_getHypertyFromDataObject:storedReporterURL', storedReporterURL);

        if (storedReporterURL) {
          resolve(storedReporterURL);
        } else {
          // check if there is any hyperty that subscribed the dataObjectURL
          let subscriberHyperty = _this.registry.getDataObjectSubscriberHyperty(dataObjectURL);
          console.info('_getHypertyFromDataObject:subscriberHyperty', subscriberHyperty);

          if (subscriberHyperty) {
            resolve(subscriberHyperty);
          } else {
            // search in domain registry for the hyperty associated to the dataObject
            // search in case is a subscriber who wants to know the reporter
            _this._coreDiscovery.discoverDataObjectPerURL(finalURL, domain).then(dataObject => {
              console.info('_getHypertyFromDataObject:dataObject', dataObject);
              _this.dataObjectsIdentity[finalURL] = dataObject.reporter;
              console.info('_getHypertyFromDataObject:dataObject.reporter', dataObject.reporter);
              resolve(dataObject.reporter);
            }, err => {
              reject(err);
            });
          }
        }
      }
    });
  }

  /**
  * Function that resolve and create the domainURL in case it is provided one. If not, resolve the default domainURL
  * @param {String}     idpDomain     idpDomain (Optional)
  */
  _resolveDomain(idpDomain) {
    if (!idpDomain) {
      return 'domain-idp://google.com';
    } else {
      return 'domain-idp://' + idpDomain;
    }
  }

  /**
  * filter the messages to hash, by removing some fields not generated by the runtime core
  * @param {Message}  message                     message
  * @param {String}  decryptedValue (Optional)    value from body.value in case it originally comes encrypted
  * @param {JSON}  identity(Optional)    add the hyperty identity associated in case is not added to the initial message
  * @return {Message}  new message filtered
  */
  _filterMessageToHash(message, decryptedValue, identity) {

    return {
      type: message.type,
      from: message.from,
      to: message.to,
      body: {
        identity: identity || message.body.identity,
        value: decryptedValue || message.body.value,
        handshakePhase: message.body.handshakePhase
      }
    };
  }

  /**
  * generates the initial structure for the keys between two users
  * @param {JSON}    message              initial message that triggers the mutual authentication
  * @param {String}  userURL              userURL
  * @param {boolean} receiver(Optional)  indicates if is the sender or the receiver that creates a new chat crypto
  * @return {JSON} newChatCrypto  new JSON structure for the chat crypto
  */
  _newChatCrypto(message, userURL, receiver) {
    let _this = this;

    //check whether is the sender or the receiver to create a new chatCrypto
    //to mantain consistency on the keys if the receiver create a new chatCrypto,
    //then invert the fields
    let from = (receiver) ? message.to : message.from;
    let to = (receiver) ? message.from : message.to;

    let userInfo = _this.getIdentity(userURL);

    let newChatCrypto =
      {
        hypertyFrom:
        {
          hyperty: from,
          userID: userInfo.messageInfo.userProfile.username,
          privateKey: userInfo.keyPair.private,
          publicKey: userInfo.keyPair.public,
          assertion: userInfo.assertion,
          messageInfo: userInfo.messageInfo
        },
        hypertyTo:
        {
          hyperty: to,
          userID: undefined,
          publicKey: undefined,
          assertion: undefined
        },
        keys:
        {
          hypertyToSessionKey: undefined,
          hypertyFromSessionKey: undefined,
          hypertyToHashKey: undefined,
          hypertyFromHashKey: undefined,
          toRandom: undefined,
          fromRandom: undefined,
          premasterKey: undefined,
          masterKey: undefined
        },
        handshakeHistory: {
          senderHello: undefined,
          receiverHello: undefined,
          senderCertificate: undefined,
          receiverFinishedMessage: undefined
        },
        initialMessage: (message.body.ignore) ? undefined : message,
        callback: message.callback,
        authenticated: false,
        dataObjectURL: message.dataObjectURL
      };

    return newChatCrypto;
  }

  _secondsSinceEpoch() {
    return Math.floor(Date.now() / 1000);
  }
}


function _chatkeysToStringCloner(chatKeysURL, sessionKeys) {
  let dataObjectSessionKeysClone = {};
  let fields = Object.keys(sessionKeys);
  if (fields) {
    try {
      for (let i = 0; i <  fields.length; i++) {
        let field = fields[i];
        dataObjectSessionKeysClone[field] = {};
        dataObjectSessionKeysClone[field].sessionKey = sessionKeys[field].sessionKey.toString();
        dataObjectSessionKeysClone[field].isToEncrypt = sessionKeys[field].isToEncrypt;
      }
    } catch (err) {
      log.error('_chatkeysToStringCloner:err', err);
    }
  }
  return dataObjectSessionKeysClone;
}

function _chatkeysToArrayCloner(chatKeysURL, sessionKeys) {
  let dataObjectSessionKeysClone = {};
  let fields = Object.keys(sessionKeys);
  if (fields) {
    try {
      for (let i = 0; i <  fields.length; i++) {
        let field = fields[i];
        dataObjectSessionKeysClone[field] = {};
        let arrayValues = JSON.parse('[' + sessionKeys[field].sessionKey + ']');
        dataObjectSessionKeysClone[field].sessionKey = new Uint8Array(arrayValues);
        dataObjectSessionKeysClone[field].isToEncrypt = sessionKeys[field].isToEncrypt;
      }
    } catch (err) {
      log.error('_chatkeysToArrayCloner:err', err);
    }
  }
  return dataObjectSessionKeysClone;
}


/*
function _chatkeysToStringCloner(chatKeysURL, chatKeys) {
  let dataObjectSessionKeysClone = Object.assign({}, chatKeys);
  if (dataObjectSessionKeysClone[chatKeysURL].sessionKey) {
    log.log('_chatkeysToStringCloner:keys', dataObjectSessionKeysClone[chatKeysURL].sessionKey);
    try {
      dataObjectSessionKeysClone[chatKeysURL].sessionKey = dataObjectSessionKeysClone[chatKeysURL].sessionKey.toString();
    } catch (err) {
      log.log('_chatkeysToStringCloner:err', err);
    }
  }
  return dataObjectSessionKeysClone;
}

function _chatkeysToArrayCloner(chatKeysURL, sessionKeys) {
  log.log('_chatkeysToArrayCloner', chatKeysURL, sessionKeys);
  if (sessionKeys) {
    log.log('_chatkeysToArrayCloner:insideIf', sessionKeys[chatKeysURL].sessionKey);
    try {
      sessionKeys[chatKeysURL].sessionKey = new Uint8Array(JSON.parse('[' + sessionKeys[chatKeysURL].sessionKey + ']'));
    } catch (err) {
      log.log('_chatkeysToArrayCloner:err', err);
    }
  }
  return sessionKeys;
}
*/


//function logS(f1, f2) {
//  log.log(f1, JSON.stringify(util.inspect(f2)));
//}

/*
const nodeJSKeyPairPopulate = { public: [48, 130, 1, 34, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 130, 1, 15, 0, 48, 130, 1, 10, 2, 130, 1, 1, 0, 228, 43, 101, 12, 121, 7, 157, 71, 81, 58, 219, 32, 10, 108, 193, 179, 212, 116, 255, 59, 217, 32, 161, 201, 53, 171, 226, 199, 137, 202, 171, 60, 82, 53, 125, 62, 177, 126, 165, 24, 141, 30, 15, 226, 59, 107, 34, 7, 13, 149, 112, 125, 10, 230, 191, 156, 164, 177, 10, 185, 13, 66, 3, 217, 166, 244, 90, 119, 111, 27, 145, 104, 71, 189, 166, 226, 255, 133, 83, 151, 231, 101, 151, 89, 22, 19, 65, 154, 10, 53, 208, 218, 252, 219, 37, 50, 212, 86, 145, 107, 132, 90, 233, 202, 227, 108, 114, 141, 29, 73, 187, 31, 13, 234, 0, 232, 24, 191, 35, 149, 179, 138, 214, 159, 245, 162, 148, 221, 118, 17, 105, 89, 151, 146, 209, 55, 236, 61, 143, 233, 228, 10, 115, 8, 81, 197, 45, 123, 187, 223, 176, 254, 165, 69, 143, 29, 100, 114, 17, 130, 226, 223, 33, 11, 240, 81, 61, 172, 191, 157, 246, 202, 87, 131, 221, 88, 48, 127, 159, 119, 160, 152, 117, 61, 253, 174, 65, 214, 203, 218, 63, 50, 78, 160, 181, 221, 211, 128, 70, 178, 191, 170, 0, 13, 122, 173, 12, 203, 252, 4, 184, 225, 252, 7, 62, 96, 116, 15, 216, 158, 55, 85, 48, 16, 9, 206, 119, 74, 112, 243, 136, 84, 184, 223, 254, 101, 91, 61, 10, 91, 85, 192, 147, 144, 57, 29, 66, 238, 199, 244, 193, 194, 150, 232, 200, 107, 2, 3, 1, 0, 1],
  private: [48, 130, 4, 191, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 4, 169, 48, 130, 4, 165, 2, 1, 0, 2, 130, 1, 1, 0, 228, 43, 101, 12, 121, 7, 157, 71, 81, 58, 219, 32, 10, 108, 193, 179, 212, 116, 255, 59, 217, 32, 161, 201, 53, 171, 226, 199, 137, 202, 171, 60, 82, 53, 125, 62, 177, 126, 165, 24, 141, 30, 15, 226, 59, 107, 34, 7, 13, 149, 112, 125, 10, 230, 191, 156, 164, 177, 10, 185, 13, 66, 3, 217, 166, 244, 90, 119, 111, 27, 145, 104, 71, 189, 166, 226, 255, 133, 83, 151, 231, 101, 151, 89, 22, 19, 65, 154, 10, 53, 208, 218, 252, 219, 37, 50, 212, 86, 145, 107, 132, 90, 233, 202, 227, 108, 114, 141, 29, 73, 187, 31, 13, 234, 0, 232, 24, 191, 35, 149, 179, 138, 214, 159, 245, 162, 148, 221, 118, 17, 105, 89, 151, 146, 209, 55, 236, 61, 143, 233, 228, 10, 115, 8, 81, 197, 45, 123, 187, 223, 176, 254, 165, 69, 143, 29, 100, 114, 17, 130, 226, 223, 33, 11, 240, 81, 61, 172, 191, 157, 246, 202, 87, 131, 221, 88, 48, 127, 159, 119, 160, 152, 117, 61, 253, 174, 65, 214, 203, 218, 63, 50, 78, 160, 181, 221, 211, 128, 70, 178, 191, 170, 0, 13, 122, 173, 12, 203, 252, 4, 184, 225, 252, 7, 62, 96, 116, 15, 216, 158, 55, 85, 48, 16, 9, 206, 119, 74, 112, 243, 136, 84, 184, 223, 254, 101, 91, 61, 10, 91, 85, 192, 147, 144, 57, 29, 66, 238, 199, 244, 193, 194, 150, 232, 200, 107, 2, 3, 1, 0, 1, 2, 130, 1, 0, 103, 244, 137, 118, 116, 82, 14, 203, 102, 107, 253, 88, 12, 199, 222, 60, 243, 136, 86, 157, 74, 224, 190, 53, 113, 57, 157, 250, 49, 130, 96, 31, 252, 136, 152, 70, 143, 17, 215, 96, 103, 51, 18, 35, 141, 212, 210, 205, 9, 216, 83, 70, 245, 71, 138, 119, 112, 229, 164, 176, 9, 37, 81, 161, 193, 154, 68, 249, 115, 106, 201, 6, 12, 225, 144, 126, 141, 210, 141, 242, 128, 159, 221, 163, 222, 21, 233, 230, 167, 206, 59, 24, 250, 233, 81, 122, 102, 26, 6, 233, 72, 133, 47, 77, 155, 238, 86, 6, 139, 24, 131, 163, 179, 112, 48, 247, 142, 6, 207, 204, 173, 223, 140, 199, 150, 95, 123, 152, 202, 155, 131, 238, 62, 96, 133, 4, 217, 51, 121, 30, 38, 178, 189, 216, 44, 35, 241, 93, 7, 62, 90, 111, 216, 66, 209, 243, 128, 234, 141, 84, 135, 181, 13, 38, 220, 114, 245, 240, 178, 95, 220, 206, 11, 186, 234, 213, 66, 121, 83, 68, 89, 75, 46, 183, 145, 183, 147, 160, 215, 118, 198, 125, 181, 146, 30, 251, 58, 87, 47, 209, 237, 97, 24, 47, 179, 6, 110, 242, 99, 150, 226, 148, 198, 174, 146, 101, 213, 87, 178, 10, 223, 105, 18, 56, 53, 22, 212, 158, 170, 176, 51, 86, 145, 125, 124, 44, 9, 85, 19, 144, 246, 170, 78, 124, 30, 32, 12, 166, 174, 139, 77, 63, 173, 82, 10, 153, 2, 129, 129, 0, 248, 18, 143, 246, 137, 136, 145, 219, 178, 39, 27, 94, 64, 90, 47, 163, 114, 60, 63, 187, 131, 143, 244, 16, 42, 128, 231, 117, 92, 98, 219, 155, 62, 107, 252, 17, 245, 45, 160, 225, 103, 142, 72, 36, 193, 150, 235, 214, 175, 62, 212, 56, 45, 9, 0, 60, 114, 107, 134, 228, 204, 131, 131, 214, 94, 201, 148, 159, 99, 139, 181, 13, 119, 38, 30, 107, 166, 165, 203, 43, 34, 20, 207, 171, 32, 58, 167, 62, 196, 153, 103, 204, 213, 247, 48, 111, 227, 59, 95, 97, 194, 187, 53, 10, 247, 108, 58, 86, 28, 29, 113, 8, 110, 171, 220, 245, 11, 82, 233, 223, 91, 68, 166, 117, 174, 187, 62, 77, 2, 129, 129, 0, 235, 118, 2, 105, 239, 212, 30, 104, 157, 41, 109, 11, 248, 152, 22, 236, 97, 40, 153, 131, 228, 5, 86, 187, 113, 126, 144, 76, 141, 79, 110, 250, 146, 152, 49, 58, 156, 201, 176, 92, 189, 209, 30, 112, 108, 175, 204, 204, 247, 164, 46, 129, 239, 98, 127, 49, 145, 218, 63, 193, 124, 174, 18, 98, 201, 99, 154, 162, 138, 78, 159, 253, 3, 248, 3, 209, 36, 239, 193, 155, 193, 5, 19, 236, 37, 78, 118, 135, 250, 199, 7, 141, 248, 120, 36, 136, 93, 98, 174, 60, 18, 215, 93, 174, 107, 141, 116, 145, 167, 221, 210, 169, 247, 67, 254, 222, 161, 134, 63, 221, 90, 87, 42, 99, 227, 81, 173, 151, 2, 129, 129, 0, 133, 23, 168, 103, 83, 232, 146, 160, 181, 23, 40, 38, 204, 13, 214, 203, 49, 41, 195, 227, 189, 181, 8, 243, 119, 106, 75, 67, 250, 250, 10, 234, 98, 118, 26, 250, 35, 121, 132, 124, 10, 76, 26, 198, 165, 154, 108, 19, 117, 88, 23, 17, 192, 143, 184, 177, 181, 141, 157, 4, 185, 248, 193, 77, 204, 243, 7, 170, 240, 4, 111, 113, 183, 0, 27, 136, 20, 19, 149, 74, 33, 241, 218, 108, 236, 80, 171, 148, 16, 116, 97, 109, 83, 74, 88, 145, 94, 239, 102, 192, 19, 114, 207, 5, 128, 51, 111, 164, 237, 86, 154, 99, 52, 197, 62, 57, 182, 6, 152, 245, 61, 137, 58, 105, 159, 2, 84, 109, 2, 129, 129, 0, 226, 67, 111, 132, 95, 91, 101, 177, 63, 189, 44, 53, 193, 184, 92, 230, 223, 98, 133, 74, 209, 86, 52, 7, 65, 195, 206, 100, 81, 178, 144, 65, 167, 151, 42, 79, 89, 149, 18, 173, 188, 21, 244, 251, 49, 230, 41, 150, 153, 46, 35, 38, 231, 99, 174, 56, 115, 32, 215, 253, 85, 147, 108, 197, 147, 34, 236, 216, 222, 177, 57, 90, 136, 114, 207, 48, 46, 31, 90, 220, 18, 58, 143, 239, 111, 214, 27, 95, 6, 36, 53, 229, 62, 108, 45, 39, 1, 30, 47, 178, 56, 164, 206, 56, 42, 208, 46, 193, 61, 31, 147, 45, 147, 23, 187, 22, 50, 255, 111, 229, 132, 199, 152, 75, 142, 136, 209, 151, 2, 129, 129, 0, 165, 56, 232, 76, 55, 57, 240, 159, 92, 207, 220, 143, 130, 30, 57, 234, 251, 172, 171, 180, 54, 159, 229, 96, 246, 73, 112, 146, 75, 157, 242, 201, 161, 218, 37, 176, 35, 170, 50, 90, 148, 102, 191, 199, 239, 174, 78, 72, 67, 85, 199, 45, 149, 145, 132, 161, 212, 33, 157, 75, 216, 79, 39, 233, 18, 210, 255, 26, 72, 229, 239, 44, 12, 147, 158, 176, 192, 95, 126, 32, 175, 23, 226, 131, 139, 197, 175, 193, 62, 8, 151, 252, 68, 154, 94, 89, 189, 125, 90, 30, 36, 175, 73, 230, 194, 13, 233, 247, 123, 60, 241, 47, 171, 51, 189, 112, 111, 213, 141, 89, 70, 249, 236, 63, 236, 110, 115, 208]};
*/
export default IdentityModule;
