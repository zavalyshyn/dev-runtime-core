'use strict mode';
import chaiAsPromised from 'chai-as-promised';
import assertArrays from 'chai-arrays';
import MessageBus from '../src/bus/MessageBus';
import IdentityModule from '../src/identity/IdentityModule';
import { runtimeFactory } from './resources/runtimeFactory';
import DataObjectsStorage from '../src/store-objects/DataObjectsStorage';
import PEP from '../src/policy/PEP';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';
import Crypto from '../src/cryptoManager/Crypto';
import CryptoManager from '../src/cryptoManager/CryptoManager';
import Registry from '../src/registry/Registry';

chai.config.truncateThreshold = 0;
chai.use(chaiAsPromised);
chai.use(assertArrays);

const IV_SIZE = 16;
const RANDOM_VALUE_SIZE = 32;
const PMS_SIZE = 48;

const expect = chai.expect;
const assert = chai.assert;

let crypto = undefined;

let bus = undefined;
let storageManager = undefined;
let runtimeCapabilities = undefined;
let hyperURL1 = undefined;
let hyperURL2 = undefined;
let runtimeURL = undefined;
let policyEngine = undefined;
let msgNodeResponseFunc = undefined;
let coreDiscovery = undefined;
let objURL = undefined;
let identityModule = undefined;
let userEmail = undefined;
let userURL = undefined;
let loginUrl = undefined;
let cryptoManager = undefined;
let registry = undefined;
let appSandbox = undefined;
let runtimeCatalogue = undefined;
let dataObjectsStorage = undefined;


describe('Crypto tests', function() {

  before('Init structures before test', function() {
    crypto = new Crypto(runtimeFactory);
    console.log(crypto);
  });


  it('Test generated IVs', function() {
    let IV_1 = crypto.generateIV();
    let IV_2 = crypto.generateIV();
    expect(IV_1).to.be.ofSize(IV_SIZE);
    expect(IV_2).to.be.ofSize(IV_SIZE);
    expect(IV_1).not.to.be.equalTo(IV_2);
  });

  it('Test generated random values', function() {
    let rand1 = crypto.generateRandom();
    let rand2 = crypto.generateRandom();
    expect(rand1).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(rand2).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(rand1).not.to.be.equalTo(rand2);
  });

  it('Test generatePMS key', function() {
    let PMS_1 = crypto.generatePMS();
    let PMS_2 = crypto.generatePMS();
    expect(PMS_1).to.be.ofSize(PMS_SIZE);
    expect(PMS_2).to.be.ofSize(PMS_SIZE);
    expect(PMS_1).not.to.be.equalTo(PMS_2);
  });

  it('Test generateMasterSecret key', function(done) {
    let oldKey = crypto.generateRandom();
    let seed = crypto.generateRandom();

    crypto.generateMasterSecret(oldKey, seed).then(key1 => {
      crypto
        .generateMasterSecret(oldKey, seed)
        .then(key2 => {
          expect(key1).to.be.ofSize(PMS_SIZE);
          expect(key2).to.be.ofSize(PMS_SIZE);
          expect(key1).to.be.equalTo(key2);
        })
        .then(function() { done(); });
    });
  });

  it('Test concatPMSwithRandoms key', function() {
    let PMSKey = crypto.generatePMS();
    let newChatCrypto = crypto.generateRandom();
    let rand2 = crypto.generateRandom();
    let totalSize = PMSKey.length + newChatCrypto.length + rand2.length;
    let concat1 = crypto.concatPMSwithRandoms(PMSKey, newChatCrypto, rand2);
    let concat2 = crypto.concatPMSwithRandoms(PMSKey, newChatCrypto, rand2);
    expect(concat1).to.be.ofSize(totalSize);
    expect(concat2).to.be.ofSize(totalSize);
    expect(concat1).to.be.equalTo(concat2);
  });

  it('Test generateKeys', function(done) {
    let secret = crypto.generateRandom();
    let seed = crypto.generateRandom();
    crypto.generateKeys(secret, seed).then(key1 => {
      crypto
        .generateKeys(secret, seed)
        .then(key2 => {
          expect(key1).to.be.ofSize(4);
          expect(key1[0]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[1]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[2]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[3]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2).to.be.ofSize(4);
          expect(key2[0]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[1]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[2]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[3]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1).not.to.be.equalTo(key2);
        })
        .then(function() { done(); });
    });
  });

  it('Test genereated keys pair with encrypt and decrypt data', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      let data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      crypto.encryptRSA(keyPair.public, data).then(encryptedData => {
        crypto
          .decryptRSA(keyPair.private, encryptedData)
          .then(decryptedData => {
            expect(data).to.be.equalTo(decryptedData);
          })
          .then(function() { done(); });
      });
    });
  });

  it('Test AES algorithm', function(done) {
    let AESKey = crypto.generateRandom();
    let IV = crypto.generateIV();
    expect(AESKey).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(IV).to.be.ofSize(IV_SIZE);
    let data = '0,1,2,3,4,5,6,7,8,9';
    crypto.encryptAES(AESKey, data, IV).then(encryptedData => {
      crypto
        .decryptAES(AESKey, encryptedData, IV)
        .then(decryptedData => {
          expect(data).to.equal(decryptedData);
        })
        .then(function() { done(); });
    });
  });

  it('Test genereated keys pair, signRSA and verifyRSA', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      let data = 'test';
      crypto.signRSA(keyPair.private, data).then(signedData => {
        crypto.verifyRSA(keyPair.public, data, signedData)
          .then(verificationResult => {
            assert.isTrue(verificationResult, 'The signitured is different');
          })
          .then(function() { done(); });
      }).catch(err => { console.log(err); });
    }).catch(err => { console.log(err); });
  });

  it('Test hashHMAC and verifyHMAC', function(done) {
    let key = crypto.generateRandom();
    let data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    crypto.hashHMAC(key, data).then(HMAC => {
      crypto
        .verifyHMAC(key, data, HMAC)
        .then(verificationResult => {
          assert.isTrue(verificationResult, 'HMAC is different');
        })
        .then(function() { done(); });
    });
  });
});




describe('CryptoManager tests', function() {

  before('Init structures once before all tests', function() {
    crypto = new Crypto(runtimeFactory);

    hyperURL1 = 'hyperty://h1.domain/h1';
    hyperURL2 = 'hyperty://h2.domain/h2';
    runtimeURL = 'runtime://fake-runtime';
    objURL = 'resource://obj1';
    userEmail = 'testandthink123@gmail.com';
    userURL = 'user://google.com/testandthink123@gmail.com';
    loginUrl =
      'https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code token id_token&state=state&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTQ3LDc3LDE2MiwyMjUsNzYsMTE5LDM4LDI1MSw3MiwyMjcsNTIsMjA4LDE4MSwxODQsMTUzLDU4LDExOCwxNTksODUsOTksNzEsMTE4LDQzLDIzMiwxMTUsMTEsMTgwLDE2LDIwNCwyMTIsODgsMjUwLDIyOCw0NywxNDksMTExLDc4LDEzNCwxMjEsMjA1LDIxNiwxOTgsMTYsMTE5LDEwMywxNTQsMjM5LDE1NSwxMjMsMTk4LDUxLDE3Niw4NywxNTcsMjQ0LDE1MiwxMDUsMTIsMjA1LDg5LDI1MiwyNTIsNDgsMTU4LDE1OCwyOSwxNzYsMTAzLDE1MSwyMDQsNzgsMjEsODAsMTQzLDEyMCwxMDcsMjQ1LDI0NSwzLDkxLDIwNiwyNCwxMjAsNzMsMTgwLDEyOCwxNjAsMTA0LDIxNyw4OSwzOCwyMzEsMjksMjI3LDI1Myw0OCwyOSw4MywxMDksMTU0LDI2LDIxNSwxMzEsMjQxLDIzNyw1MCwxMzEsMjM0LDc4LDcwLDEzOCwyNDMsNSwyNTMsMTgyLDkxLDIyNSwxODIsMTgwLDUyLDE3LDE1LDEwOSwxMSwxMjYsOTUsMjE2LDM3LDIyNCwxNCwwLDIxNSwyMDQsNjEsMTU2LDIwNywxMzEsMTIxLDc2LDkzLDE2OCwxNTEsNDAsMTcsMTI0LDExMCw4MiwyMTksMjA1LDIxNSwyNDksMTcsMjA4LDk2LDExNCwxOTQsNjcsMjMsMTUsMjA2LDIyNiwxMzIsMTg0LDE0MSwxMTgsMTAsMTA1LDkyLDg3LDYwLDE3NiwxNTYsMTMxLDk0LDUyLDEwLDI0OCwyNTUsMjM5LDgsMTgxLDE3Myw2NywxODEsMjUsNzYsMjU1LDUzLDE3NSwxOCwxMzgsMTkwLDEyNCwxODIsMTU1LDE4LDE5OSwxMzIsNzUsMjMyLDUsMTU2LDE1MiwxODcsMTIyLDU4LDIzNiwxNTgsMTY3LDQ3LDE5MywxMzYsODIsMjM0LDIxMSwxNzYsODAsMTg1LDE3MSwxMjMsMCw2LDE5OCwyMTQsMjEsMTAzLDc4LDIyNywzNywxMDIsNjksMTYsNjAsOCwyMDMsNTQsMTc0LDE3MiwyMDksMTY0LDIyMSwyNywxNTUsODUsMTI2LDE1NSwyNDEsODMsMSwxMTgsMTE3LDIsMjM3LDEwMSw3MiwxMDcsMiwzLDEsMCwx';
    msgNodeResponseFunc = msgNodeResponseFuncPopulate;
    coreDiscovery = coreDiscoveryPopulate;
    storageManager = runtimeFactory.storageManager('idModule:identities');
    runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
  });

  beforeEach('Init structures before each test', function() {

    appSandbox = runtimeFactory.createAppSandbox();
    runtimeCatalogue = runtimeFactory.createRuntimeCatalogue();
    registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue, runtimeCapabilities, storageManager);
    dataObjectsStorage = new DataObjectsStorage(storageManager, {});

    bus = new MessageBus(registry);
    bus.pipeline = {};
    bus.pipeline.handlers = handlersPopulate;
    bus._onPostMessage = msg => {
      msgNodeResponseFunc(bus, msg);
    };

    cryptoManager = new CryptoManager();

    cryptoManager.init(
      runtimeURL,
      runtimeCapabilities,
      storageManager,
      registry,
      coreDiscoveryPopulate,
      dataObjectsStorage,
      identityModule,
      runtimeCatalogue
    );

/*
    identityModule = new IdentityModule(
      runtimeURL,
      runtimeCapabilities,
      storageManager,
      dataObjectsStorage,
      cryptoManager,
      runtimeFactory.createRuntimeCatalogue()
    );

    identityModule.messageBus = bus;
    identityModule.registry = registry;
    identityModule.coreDiscovery = coreDiscovery;

    let runtimeCoreCtx = new RuntimeCoreCtx(
      runtimeURL,
      identityModule,
      registry,
      storageManager,
      runtimeFactory.runtimeCapabilities()
    );
    policyEngine = new PEP(runtimeCoreCtx);
    */
  });

  it('test encryptDataObject/decryptDataObject', function(done) {
    let sender = 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a';
    let sessionKey = crypto.generateRandom();
    let dataObjectSessionKeys = {};
    dataObjectSessionKeys[sender] = {
      sessionKey: sessionKey,
      isToEncrypt: true
    };
    storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeys);

    cryptoManager
      .encryptDataObject(dataObjectPopulate, sender)
      .then(encryDataObject => {
        cryptoManager
          .decryptDataObject(encryDataObject, sender)
          .then(decryDataObject => {
            let value =
              decryDataObject.value.data.content ===
                dataObjectPopulate.data.content &&
              encryDataObject.hasOwnProperty('value') &&
              encryDataObject.hasOwnProperty('iv');
            assert(value, 'Decrypted data is not the same');
          })
          .then(done);
      });
  });

  it('test _filterMessageToHash', function() {
    let message = messageToBeHashedPopulate;
    let decryptedValue = 'decryptedValue';
    let identity = hyperURL1;
    let receivedHash = cryptoManager._filterMessageToHash(
      message,
      decryptedValue,
      identity
    );

    let valueVerificationResult =
      receivedHash.type === messageToBeHashedPopulate.type &&
      receivedHash.from === messageToBeHashedPopulate.from &&
      receivedHash.to === messageToBeHashedPopulate.to &&
      receivedHash.body.identity ===
        (identity || messageToBeHashedPopulate.body.identity) &&
      receivedHash.body.value ===
        (decryptedValue || messageToBeHashedPopulate.body.value) &&
      receivedHash.body.handshakePhase ===
        messageToBeHashedPopulate.body.handshakePhase;
    assert(valueVerificationResult, 'Received message is not the expected');
  });

  it('test _newChatCrypto', function(done) {
    let message = messageForNewChatCrypto;
    let receiver = false;

    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule.storeIdentity(returnedAssertionValuePopulate, keyPair).then(result =>{
        let newChatCrypto = cryptoManager.default._newChatCrypto(message, userURL, receiver);
        let valueVerificationResult =
          newChatCrypto.hypertyFrom.userID === userEmail &&
          newChatCrypto.hypertyFrom.messageInfo.assertion === returnedAssertionValuePopulate.assertion &&
          newChatCrypto.callback === messageForNewChatCrypto.callback &&
          newChatCrypto.dataObjectURL === message.dataObjectURL;

        assert(valueVerificationResult, 'Generated chat crypto messege is not the expected one');
      }).then(function() { done(); });
    });
  });


  it('test _sendReporterSessionKey', function(done) {
    let message = {
      from: hyperURL1, to: hyperURL2
    };

    let chatKeys = {
      dataObjectURL: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a',
      hypertyFrom: {messageInfo: 'messageInfo'},
      keys: {
        hypertyFromSessionKey: crypto.generateRandom(),
        hypertyFromHashKey: crypto.generateRandom()
      }
    };

    cryptoManager.default._sendReporterSessionKey(message, chatKeys).then(result =>{
      let assertFields = result.hasOwnProperty('message') &&
          result.message.type === 'handshake' &&
          result.message.to === hyperURL1 &&
          result.message.from === hyperURL2 &&
          result.message.body.hasOwnProperty('handshakePhase') &&
          result.message.body.hasOwnProperty('value') &&
          result.hasOwnProperty('chatKeys') &&
          result.chatKeys.hasOwnProperty('hypertyFrom') &&
          result.chatKeys.hasOwnProperty('keys') &&
          result.chatKeys.keys.hasOwnProperty('hypertyFromHashKey');

      assert(assertFields, 'Result has not the required fields or values');
    }).then(function() { done(); });
  });


  //test isFromHyperty to isToHyperty communication -> handshake + update //TODO incomplete cases
  it('test encryptMessage - startHandShake and update', function(done) {
    let chatKeys = chatKeysPopulate;
    let helloMessage = messageForNewChatCrypto;
    let keyPair = {
      public: chatKeysPopulate.hypertyFrom.publicKey,
      private: chatKeysPopulate.hypertyFrom.privateKey
    };

    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    chatKeys.keys.hypertyToSessionKey = chatKeys.keys.hypertyFromSessionKey;
    chatKeys.keys.hypertyToHashKey = chatKeys.keys.hypertyFromHashKey;
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    cryptoManager.default.chatKeys[encryptMessagePopulate.from + '<->' + encryptMessagePopulate.to] = chatKeys;
    cryptoManager.default.chatKeys[encryptMessagePopulate.to + '<->' + encryptMessagePopulate.from] = chatKeys;


    identityModule.storeIdentity(returnedAssertionValuePopulate, keyPair).then(result1 =>{
      helloMessage.body.handshakePhase = 'startHandShake';

      cryptoManager.default._doHandShakePhase(helloMessage, chatKeys).then(result2 => {

        cryptoManager.default.encryptMessage(encryptMessagePopulate).then(resolvedMessage => {
          assert.equal(encryptMessagePopulate, resolvedMessage, 'Messages should be the same');
          encryptMessagePopulate.type = 'update';

          cryptoManager.default.encryptMessage(encryptMessagePopulate).then(updateMessage => {
            assert.equal(encryptMessagePopulate, updateMessage, 'Messages should be the same');
            encryptMessagePopulate.type = 'encrypt';//Don't know the correct keyword but this works for now

            cryptoManager.default.encryptMessage(encryptMessagePopulate).then(encryptedMessage => {

              cryptoManager.default.decryptMessage(encryptedMessage).then(decryptedMessage => {
                assert.equal(decryptedMessage.body.value, encryptMessagePopulate.body.value, 'Encryption failed');
              }).then(function() { done(); });
            });
          });
        });
      });
    });
    encryptMessagePopulate.type = 'handshake';
  });


  it('test _doHandShakePhase - startHandShake', function(done) {
    let message = messageForNewChatCrypto;
    message.body.handshakePhase = 'startHandShake';
    let chatKeys = chatKeysPopulate;
    cryptoManager.default._doHandShakePhase(message, chatKeys).then(result => {
      let assertFields = result.message.type === 'handshake' &&
          result.message.body.handshakePhase === 'senderHello' &&
          result.hasOwnProperty('chatKeys') &&
          result.message.type === 'handshake';
      assert(assertFields, 'Result has not the expected values');
    }).then(function() { done(); });
  });


  it('test _doHandShakePhase - senderHello', function(done) {
    let message = senderHelloMessagePopulate;
    let chatKeys = chatKeysPopulate;
    cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
      let assertFields = resultMessage.message.type === 'handshake' &&
          resultMessage.message.body.handshakePhase === 'receiverHello' &&
          resultMessage.hasOwnProperty('chatKeys') &&
          resultMessage.hasOwnProperty('message');
      assert(assertFields, 'Result has not the expected values');
    }).then(function() { done(); });
  });

  it('test _doHandShakePhase - receiverHello', function(done) {
    let message = receiverHelloMessagePopulate;

    //let cloneOfA = JSON.parse(JSON.stringify(object));
    let chatKeys = chatKeysPopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
        let assertFields = resultMessage.message.type === 'handshake' &&
          resultMessage.message.body.handshakePhase === 'senderCertificate' &&
          resultMessage.hasOwnProperty('chatKeys') &&
          resultMessage.hasOwnProperty('message');
        assert(assertFields, 'Result has not the expected values');
      }).then(function() { done(); });
    });
  });

  it('test _doHandShakePhase - senderCertificate', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = senderCertificateMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      let pms = crypto.generatePMS();
      chatKeys.keys.premasterKey = new Uint8Array(pms);

      crypto.encryptRSA(chatKeys.hypertyFrom.publicKey, pms).then(encryptedVal =>{
        receivedValue.assymetricEncryption =  crypto.encode(encryptedVal);
        let messageHash = cryptoManager._filterMessageToHash(message, chatKeys.keys.premasterKey);
        let messageToBeSigned = JSON.stringify(chatKeys.handshakeHistory) + JSON.stringify(messageHash);
        let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

        crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{
          crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys =>{

            crypto.encryptAES(keys[1], 'ok', receivedValue.iv).then(aesEncryption => {
              receivedValue.symetricEncryption = crypto.encode(aesEncryption);

              crypto.signRSA(chatKeys.hypertyFrom.privateKey, messageToBeSigned).then(signature =>{
                receivedValue.signature = crypto.encode(signature);

                let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);
                crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
                  receivedValue.hash = crypto.encode(HMAC);

                  receivedValue.iv = crypto.encode(receivedValue.iv);
                  message.body.value = btoa(JSON.stringify(receivedValue));
                  cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
                    let assertFields = resultMessage.chatKeys.hypertyFrom.userID === userEmail &&
     		 resultMessage.message.body.handshakePhase === 'receiverFinishedMessage' &&
     		 resultMessage.hasOwnProperty('chatKeys') &&
     		 resultMessage.hasOwnProperty('message');
                    assert(assertFields, 'Result has not the expected values');
                  }).then(function() { done(); });
                });
              });
            });
          });
        });
      });
    });
  });

  it('test _doHandShakePhase - receiverFinishedMessage', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverFinishedMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

    crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{
      crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys =>{
        chatKeys.keys.hypertyToSessionKey = keys[1];
        crypto.encryptAES(keys[1], 'ok', receivedValue.iv).then(aesEncryption => {
          receivedValue.value = crypto.encode(aesEncryption);

          let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);
          crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
            chatKeys.keys.hypertyToHashKey = keys[3];
            receivedValue.hash = crypto.encode(HMAC);
            receivedValue.iv = crypto.encode(receivedValue.iv);
            message.body.value = btoa(JSON.stringify(receivedValue));

            cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
              let assertFields = resultMessage.chatKeys.hypertyFrom.userID === userEmail &&
                   resultMessage.message.type === 'create' &&
                   resultMessage.message.body.value === chatKeysPopulate.initialMessage.body.value &&
                   resultMessage.hasOwnProperty('chatKeys') &&
                   resultMessage.hasOwnProperty('message');
              assert(assertFields, 'Result has not the expected values');
            }).then(function() { done(); });

          });
        });
      });
    });
  });

  it('test _doHandShakePhase - reporterSessionKey', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverAcknowledgeMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

    crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{

      crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys => {
        chatKeys.keys.hypertyToSessionKey = keys[1];
        chatKeys.keys.hypertyFromSessionKey = keys[1];
        chatKeys.keys.hypertyFromHashKey = keys[1];

        let sessionKey = crypto.encode(keys[1]);

        //      let dataObjectURL = crypto.encode(dataObjectURL);
        let dataToEncrypt = JSON.stringify({value: sessionKey, dataObjectURL: chatKeys.dataObjectURL});

        crypto.encryptAES(keys[1], dataToEncrypt, receivedValue.iv).then(aesEncryption => {
          receivedValue.value = crypto.encode(aesEncryption);

          let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);

          crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
            chatKeys.keys.hypertyToHashKey = keys[3];
            receivedValue.hash = crypto.encode(HMAC);
            receivedValue.iv = crypto.encode(receivedValue.iv);
            message.body.value = btoa(JSON.stringify(receivedValue));

            cryptoManager._doHandShakePhase(message, chatKeys).then(resultMessage => {
              assert.equal(resultMessage, 'handShakeEnd', 'Result has not the expected values');
            }).then(function() { done(); });

          });

        });

      });
    });

  });

  it('test doMutualAuthentication', function(done) {
    let sender = hyperURL1;
    let receiver = hyperURL2;

    identityModule.registry.getReporterURLSynchonous = (sender) => { return undefined; };
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    let chatKeys = chatKeysPopulate;
    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a',
    cryptoManager.default.chatKeys[sender + '<->' + receiver] = chatKeys;

    cryptoManager.default._doMutualAuthenticationPhase1(sender, receiver).then(resultMessage => {
      assert.equal(resultMessage, 'exchange of chat sessionKey initiated', 'Message is not the expected one');
    }).then(function() { done(); });
  });


  //test isFromHyperty to isToHyperty communication -> handshake + update //TODO incomplete cases
  it('test encryptMessage - startHandShake and update', function(done) {
    let chatKeys = chatKeysPopulate;
    let helloMessage = messageForNewChatCrypto;
    let keyPair = {
      public: chatKeysPopulate.hypertyFrom.publicKey,
      private: chatKeysPopulate.hypertyFrom.privateKey
    };
    let encryptMessage = encryptMessagePopulate;

    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    chatKeys.keys.hypertyToSessionKey = chatKeys.keys.hypertyFromSessionKey;
    chatKeys.keys.hypertyToHashKey = chatKeys.keys.hypertyFromHashKey;
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    cryptoManager.default.chatKeys[encryptMessagePopulate.from + '<->' + encryptMessagePopulate.to] = chatKeys;
    cryptoManager.default.chatKeys[encryptMessagePopulate.to + '<->' + encryptMessagePopulate.from] = chatKeys;

    identityModule.storeIdentity(returnedAssertionValuePopulate, keyPair).then(result1 =>{
      helloMessage.body.handshakePhase = 'startHandShake';

      cryptoManager.default._doHandShakePhase(helloMessage, chatKeys).then(result2 => {

        cryptoManager.default.encryptMessage(encryptMessagePopulate).then(resolvedMessage => {
          assert.equal(encryptMessagePopulate, resolvedMessage, 'Messages should be the same');
          encryptMessagePopulate.type = 'update';

          cryptoManager.default.encryptMessage(encryptMessagePopulate).then(updateMessage => {
            assert.equal(encryptMessagePopulate, updateMessage, 'Messages should be the same');
            encryptMessagePopulate.type = 'encrypt';//Don't know the correct keyword but this works for now

            cryptoManager.default.encryptMessage(encryptMessagePopulate).then(encryptedMessage => {

              cryptoManager.default.decryptMessage(encryptedMessage).then(decryptedMessage => {
                assert.equal(decryptedMessage.body.value, encryptMessagePopulate.body.value, 'Encryption failed');
              }).then(function() { done(); });
            });
          });
        });
      });
    });
    encryptMessagePopulate.type = 'handshake';
  });


  it('test _doHandShakePhase - startHandShake', function(done) {
    let message = messageForNewChatCrypto;
    message.body.handshakePhase = 'startHandShake';
    let chatKeys = chatKeysPopulate;
    cryptoManager.default._doHandShakePhase(message, chatKeys).then(result => {
      let assertFields = result.message.type === 'handshake' &&
            result.message.body.handshakePhase === 'senderHello' &&
            result.hasOwnProperty('chatKeys') &&
            result.message.type === 'handshake';
      assert(assertFields, 'Result has not the expected values');
    }).then(function() { done(); });
  });


  it('test _doHandShakePhase - senderHello', function(done) {
    let message = senderHelloMessagePopulate;
    let chatKeys = chatKeysPopulate;
    cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
      let assertFields = resultMessage.message.type === 'handshake' &&
            resultMessage.message.body.handshakePhase === 'receiverHello' &&
            resultMessage.hasOwnProperty('chatKeys') &&
            resultMessage.hasOwnProperty('message');
      assert(assertFields, 'Result has not the expected values');
    }).then(function() { done(); });
  });

  it('test _doHandShakePhase - receiverHello', function(done) {
    let message = receiverHelloMessagePopulate;

    //let cloneOfA = JSON.parse(JSON.stringify(object));
    let chatKeys = chatKeysPopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
        let assertFields = resultMessage.message.type === 'handshake' &&
            resultMessage.message.body.handshakePhase === 'senderCertificate' &&
            resultMessage.hasOwnProperty('chatKeys') &&
            resultMessage.hasOwnProperty('message');
        assert(assertFields, 'Result has not the expected values');
      }).then(function() { done(); });
    });
  });

  it('test _doHandShakePhase - senderCertificate', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = senderCertificateMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      let pms = crypto.generatePMS();
      chatKeys.keys.premasterKey = new Uint8Array(pms);

      crypto.encryptRSA(chatKeys.hypertyFrom.publicKey, pms).then(encryptedVal =>{
        receivedValue.assymetricEncryption =  crypto.encode(encryptedVal);
        let messageHash = cryptoManager._filterMessageToHash(message, chatKeys.keys.premasterKey);
        let messageToBeSigned = JSON.stringify(chatKeys.handshakeHistory) + JSON.stringify(messageHash);
        let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

        crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{
          crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys =>{

            crypto.encryptAES(keys[1], 'ok', receivedValue.iv).then(aesEncryption => {
              receivedValue.symetricEncryption = crypto.encode(aesEncryption);

              crypto.signRSA(chatKeys.hypertyFrom.privateKey, messageToBeSigned).then(signature =>{
                receivedValue.signature = crypto.encode(signature);

                let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);
                crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
                  receivedValue.hash = crypto.encode(HMAC);

                  receivedValue.iv = crypto.encode(receivedValue.iv);
                  message.body.value = btoa(JSON.stringify(receivedValue));
                  cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
                    let assertFields = resultMessage.chatKeys.hypertyFrom.userID === userEmail &&
       		 resultMessage.message.body.handshakePhase === 'receiverFinishedMessage' &&
       		 resultMessage.hasOwnProperty('chatKeys') &&
       		 resultMessage.hasOwnProperty('message');
                    assert(assertFields, 'Result has not the expected values');
                  }).then(function() { done(); });
                });
              });
            });
          });
        });
      });
    });
  });

  it('test _doHandShakePhase - receiverFinishedMessage', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverFinishedMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

    crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{
      crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys =>{
        chatKeys.keys.hypertyToSessionKey = keys[1];
        crypto.encryptAES(keys[1], 'ok', receivedValue.iv).then(aesEncryption => {
          receivedValue.value = crypto.encode(aesEncryption);

          let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);
          crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
            chatKeys.keys.hypertyToHashKey = keys[3];
            receivedValue.hash = crypto.encode(HMAC);
            receivedValue.iv = crypto.encode(receivedValue.iv);
            message.body.value = btoa(JSON.stringify(receivedValue));

            cryptoManager.default._doHandShakePhase(message, chatKeys).then(resultMessage => {
              let assertFields = resultMessage.chatKeys.hypertyFrom.userID === userEmail &&
                     resultMessage.message.type === 'create' &&
                     resultMessage.message.body.value === chatKeysPopulate.initialMessage.body.value &&
                     resultMessage.hasOwnProperty('chatKeys') &&
                     resultMessage.hasOwnProperty('message');
              assert(assertFields, 'Result has not the expected values');
            }).then(function() { done(); });

          });
        });
      });
    });
  });

  it('test _doHandShakePhase - reporterSessionKey', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverAcknowledgeMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

    crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(masterKey =>{

      crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom).then(keys => {
        chatKeys.keys.hypertyToSessionKey = keys[1];
        chatKeys.keys.hypertyFromSessionKey = keys[1];
        chatKeys.keys.hypertyFromHashKey = keys[1];

        let sessionKey = crypto.encode(keys[1]);

        //      let dataObjectURL = crypto.encode(dataObjectURL);
        let dataToEncrypt = JSON.stringify({value: sessionKey, dataObjectURL: chatKeys.dataObjectURL});

        crypto.encryptAES(keys[1], dataToEncrypt, receivedValue.iv).then(aesEncryption => {
          receivedValue.value = crypto.encode(aesEncryption);

          let filteredMessage = cryptoManager._filterMessageToHash(message, 'ok' + receivedValue.iv);

          crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
            chatKeys.keys.hypertyToHashKey = keys[3];
            receivedValue.hash = crypto.encode(HMAC);
            receivedValue.iv = crypto.encode(receivedValue.iv);
            message.body.value = btoa(JSON.stringify(receivedValue));

            cryptoManager._doHandShakePhase(message, chatKeys).then(resultMessage => {
              assert.equal(resultMessage, 'handShakeEnd', 'Result has not the expected values');
            }).then(function() { done(); });

          });

        });

      });
    });

  });

  it('test doMutualAuthentication', function(done) {
    let sender = hyperURL1;
    let receiver = hyperURL2;

    identityModule.registry.getReporterURLSynchonous = (sender) => { return undefined; };
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    let chatKeys = chatKeysPopulate;
    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a',
    cryptoManager.default.chatKeys[sender + '<->' + receiver] = chatKeys;

    cryptoManager.default._doMutualAuthenticationPhase1(sender, receiver).then(resultMessage => {
      assert.equal(resultMessage, 'exchange of chat sessionKey initiated', 'Message is not the expected one');
    }).then(function() { done(); });
  });
});


let msgNodeResponseFuncPopulate = (bus, msg) => {
  console.log('BUS RESPONSE');
  if (msg.type === 'subscribe') {
    log('msgNodeResponse subscribe: ' + msg);
    if (msg.id === 2) {

      //reporter subscribe
      expect(msg).to.contain.all.keys({
        id: 2, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h1.domain/sm',
        body: { resources: [objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL1 }
      });
    } else {

      //observer subscribe
      expect(msg).to.contain.all.keys({
		  id: 5, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.obj1/sm',
		  body: { resources: [objURL + '/changes', objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL2 }
      });
	  }
  } else if (msg.type === 'execute') {
    log('msgNodeResponseFunc EXE');
    let resMsg = {
      id: msg.id,
      type: 'response',
      to: msg.from,
      from: msg.to,
      body: {
        auth: false,
        code: 200,
        value: ''
      }
    };
    log(resMsg);

    //		if(msg.body.method === 'generateAssertion' && msg.body.params.usernameHint != ''){
    if (msg.body.method === 'generateAssertion') {
      log('msgNodeResponseFunc generateAssertion');

      // if(msg.body.params.usernameHint == ''){
      // 	log('msgNodeResponseFunc loginUrl');
      // 	resMsg.body.value = {loginUrl: loginUrl};
      // }else{
      log('msgNodeResponseFunc assertionVal');
      resMsg.body.value = sendGenerateMessageResponse;

      //			}
    } else if (msg.body.method === 'openPopup') {
      log('msgNodeResponseFunc openPopup');
      resMsg.body.value = loginUrl;
 		} else if (msg.body.resource === 'identity') {
      if (msg.body.method === 'validateAssertion') {
        log('msgNodeResponseFunc validateAssertion');
        resMsg.body.value = validateAssertionValuePopulate;
      } else {
        log('msgNodeResponseFunc identity');
        resMsg.body.value = sendGenerateMessageResponse;
			 }
    }
    bus.postMessage(resMsg);
  } else if (msg.type === 'create') {
    log('msgNodeResponse generateAssertion: ' + msg);
    let resMsg = {
      id: msg.id,
      type: 'response',
      to: msg.from,
      from: msg.to,
      body: {
        code: 200,
        type: 'identity',
        value: userEmail
      }
    };
    log(resMsg);
	  bus.postMessage(resMsg);
  }
};

let registryPopulate = {
  registerDataObject: objectRegistration => {
    log('REGISTRY-OBJECT: ', objectRegistration);
    return new Promise(resolve => {
      resolve('ok');
    });
  },

  isInterworkingProtoStub: url => {
    log('isInterworkingProtoStub: ', url);
    return false;
  },

  unregisterDataObject: url => {
    log('Unregister Data Object:', url);
    return true;
  },

  getPreAuthSubscribers: () => {
    return ['hyperty://domain/hyperty-instance'];
  },
  getHypertyName: () => {
    return 'HypertyChat';
  },
  isDataObjectURL: dataObjectURL => {
    let splitURL = dataObjectURL.split('://');
    return splitURL[0] === 'comm';
  },
  registerSubscribedDataObject: () => {},
  registerSubscriber: () => {},
  isLocal: url => {
    log('isLocal: ', url);
    return false;
  },
  runtimeURL: runtimeURL
};


let handlersPopulate = [
  function(ctx) {
    policyEngine
      .authorise(ctx.msg)
      .then(function(changedMgs) {
        console.log('Authorized');
        changedMgs.body.identity = {
          userProfile: {
            userURL: userURL
          }
        };
        ctx.msg = changedMgs;
        ctx.next();
      })
      .catch(function(reason) {
        console.log('FAIL!');

        console.error(reason);
        ctx.fail(reason);
      });
  }
];


let returnedAssertionValuePopulate = {
  assertion:
    'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19',
  identity: 'user://google.com/testandthink123@gmail.com',
  idp: {
    domain: 'google.com',
    protocol: 'OIDC'
  },
  info: {
    accessToken:
      'ya29.GlvHBPvz5L_9BXW-Bur0qZT7PIcQTEHVqtVexuyy9nk6C…RDnHKbHMj209B26C4sHaa3Q89dbE5SOebteYb8o8mUxsjA5sF',
    idToken:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlY2I1NGNlNzFkNjE4Yj…PXZy9LZVOMM_DDhMZl1ULrRofuEOPLUq-XVYWyfQtLfpOFKaw',
    refreshToken: '1/mbg9sQp1fhrnH8IkglzzkGsl9nTgU__BTyp7lcdmBA4',
    tokenType: 'Bearer',
    infoToken: {
      sub: '117959105295761687889',
      name: 'test think',
      given_name: 'test',
      family_name: 'think',
      picture:
        'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
    },
    keyPair: {
      public: new Uint8Array(294),
      private: new Uint8Array(1218)
    },
    messageInfo: {
      userProfile: 'userProfile',
      idp: 'google.com',
      assertion: 'assertion_repeated',
      expires: '1505495342'
    }
  }
};

let sendGenerateMessageResponse =
{assertion: 'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltSmhOR1JsWkRkbU5XRTVNalF5T1dZeU16TTFOakZoTXpabVpqWXhNMlZrTXpnM05qSmpNMlFpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWpGemREbExibEZsZWxWMVVqSXRObVJEUTFseVFrRWlMQ0p1YjI1alpTSTZJbHMwT0N3eE16QXNNU3d6TkN3ME9Dd3hNeXcyTERrc05ESXNNVE0wTERjeUxERXpOQ3d5TkRjc01UTXNNU3d4TERFc05Td3dMRE1zTVRNd0xERXNNVFVzTUN3ME9Dd3hNekFzTVN3eE1Dd3lMREV6TUN3eExERXNNQ3d4T1RBc01qUTRMREl5TWl3eE1qWXNNVEk0TERFM015d3lNRElzTVRNNExERTVNeXd4T0RJc01UZ3hMRFV5TERFeE1Td3hOVFVzTWpBeUxEWTRMREl3TERReExERXlNU3cyTVN3MU1DdzROeXcxTWl3eE56a3NPVEVzTkRFc01qUTRMREU0Tml3eU16Y3NPREFzTWpBMkxEa3dMREUzTXl3eE9EWXNNVFEwTERFMk9Td3hORFFzTWpFMExESXhNaXd5TVRBc01UZzVMREV5TkN3NU1pd3lORElzTVRBNUxESXdNaXd4TkRBc01qRXNNVE0yTERFMU9Td3lMRFl6TERBc01UVXlMREUyTml3eE9EWXNNVFkwTERFNE55d3hNVFlzTmpBc01UTTBMREkwTWl3eE1Ua3NNakUzTERZd0xERTRNaXd4TmpFc01UZ3dMRE0xTERnNExEYzBMREUxTnl3NU1pd3lNVEFzTWpRMUxEWTVMREV6Tml3eE56TXNOamNzTVRJNUxEZzBMREl3TERFM01pdzBPQ3d4TlRVc01USTVMREUwTERJeU9Td3hORGdzT1RVc01URXpMREV4Tnl3eU1UQXNNemNzTVRJNExERTNNU3d4TnpVc05UQXNNVGd6TERJMU5DdzVPU3czT1N3eE5UZ3NNVEl6TERVMUxERTRNQ3d5T1N3NU15d3hPRGtzT1Rrc09UTXNNVGt3TERZekxERTFNaXcwTUN3eU1EVXNNVGN5TERFM01pd3hPRGNzTUN3eU5USXNNVEk0TERFMk5Dd3lORFFzT0RBc016WXNPVE1zTVRnekxEUTVMREl3TVN3eE1Td3pPU3d4TWl3eE5UZ3NNQ3d5TkN3eE5UY3NNVGd6TERJeU5pd3lORElzTWpBekxERTJPU3d5TkRrc01UQTVMREV6T0N3eE1UQXNOakFzTVRjNUxERTVNQ3d4TWpVc01qUTFMREU1TERFMU9TdzBNaXd4TlRRc01qQTVMREUwTlN3eU5EQXNPVGdzTlRZc09USXNNakkzTERnc01UQTJMREV4TlN3eE1qY3NNalF4TERJMkxETXlMREUwTVN3eE9EZ3NOemtzTXpBc01UTXhMRFlzTVRZd0xESXpNaXczTlN3eU16TXNNalEwTERnd0xEVXhMREVzTlRJc01UTTNMREl3TUN3eU1URXNNemtzTVRVMkxERTBOaXd5TkRZc01qVXpMRFkxTERFeU5pdzVOQ3d4TVRjc01UVXhMREkxTWl3eU1qUXNNak0zTERZNUxERXdNQ3d4TURnc01qTXpMREl4TkN3eU1pd3lNakFzTVRNMkxERTBNU3d6Tnl3NU5pd3hOeXd5TVRJc01qQTJMREkxTERFeE9Dd3lNRGtzT1RZc01UUXlMREV4TERJeU1Dd3hPRFVzTWpFNExEUTJMREV5TlN3ek9DdzBPQ3d4TWpRc05EY3NNak1zTVRJNUxERXdPU3d5TURZc01UQTBMREl4TERJd05Dd3lNVGdzTWpBeUxERXpMREV6T0N3eE56VXNNVEUwTERFM05Td3lORGtzTlRRc05qWXNNVE16TERFMk55dzJOU3d4TkRJc05qZ3NNVFExTERFNE5Dd3hPU3d4Tnl3M015d3lMRE1zTVN3d0xERmRJaXdpWlhod0lqb3hOVEU0TVRBeU1qTXpMQ0pwYzNNaU9pSmhZMk52ZFc1MGN5NW5iMjluYkdVdVkyOXRJaXdpYW5ScElqb2laakE0WWpGa1pXVmpNbVEwWkdabE4yWXlNV1k0WkRjeE5ERmlOalZoTVROaFlUbGpNak0zTUNJc0ltbGhkQ0k2TVRVeE9EQTVPRFl6TTMwLlpSV1JXbkZTMmlkdHlKWnZYX0gyMHZkZ2FBYlllV3lQYzVIc2N0bzhrRVo3Z0VENDJDb1NjbS1WQ0l6SUF3R2J4V0F6ZG1xWFBFSDFNd1JfSWNJY2pZMGdRY0NKZVpkZy0xTFhZME5NWFVhZmNVQWdlcjdIeGJVNzU2b0tyQXZDQWdiRlJUenk3QW1qNDNPVkdYdDR5MXY4alpoWlRpLVU2cWJaOVBaOE1Ka1gwNExPUzMxQVRvZ1RnTURRWHRyV3N1dno3RHhKZ0U2djVBbkozemgyT0xCUHlJcWw0N0R4SGRhSURCcGsxQklMR19hRnJuc09oUTFRbWtqRDA2d0diUFNKVWtBdUVYbDNRYUFTY0QxLW9vTlNjREtxcDI2MkJ4Q2otVlFfMXpEY3NCd0s3UHp3TnBfVVpWVkVtRzYxcUVhMDZLdkJ6anllQzdiNjY0SUl0QSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiIxc3Q5S25RZXpVdVIyLTZkQ0NZckJBIiwibm9uY2UiOiJbNDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTkwLDI0OCwyMjIsMTI2LDEyOCwxNzMsMjAyLDEzOCwxOTMsMTgyLDE4MSw1MiwxMTEsMTU1LDIwMiw2OCwyMCw0MSwxMjEsNjEsNTAsODcsNTIsMTc5LDkxLDQxLDI0OCwxODYsMjM3LDgwLDIwNiw5MCwxNzMsMTg2LDE0NCwxNjksMTQ0LDIxNCwyMTIsMjEwLDE4OSwxMjQsOTIsMjQyLDEwOSwyMDIsMTQwLDIxLDEzNiwxNTksMiw2MywwLDE1MiwxNjYsMTg2LDE2NCwxODcsMTE2LDYwLDEzNCwyNDIsMTE5LDIxNyw2MCwxODIsMTYxLDE4MCwzNSw4OCw3NCwxNTcsOTIsMjEwLDI0NSw2OSwxMzYsMTczLDY3LDEyOSw4NCwyMCwxNzIsNDgsMTU1LDEyOSwxNCwyMjksMTQ4LDk1LDExMywxMTcsMjEwLDM3LDEyOCwxNzEsMTc1LDUwLDE4MywyNTQsOTksNzksMTU4LDEyMyw1NSwxODAsMjksOTMsMTg5LDk5LDkzLDE5MCw2MywxNTIsNDAsMjA1LDE3MiwxNzIsMTg3LDAsMjUyLDEyOCwxNjQsMjQ0LDgwLDM2LDkzLDE4Myw0OSwyMDEsMTEsMzksMTIsMTU4LDAsMjQsMTU3LDE4MywyMjYsMjQyLDIwMywxNjksMjQ5LDEwOSwxMzgsMTEwLDYwLDE3OSwxOTAsMTI1LDI0NSwxOSwxNTksNDIsMTU0LDIwOSwxNDUsMjQwLDk4LDU2LDkyLDIyNyw4LDEwNiwxMTUsMTI3LDI0MSwyNiwzMiwxNDEsMTg4LDc5LDMwLDEzMSw2LDE2MCwyMzIsNzUsMjMzLDI0NCw4MCw1MSwxLDUyLDEzNywyMDAsMjExLDM5LDE1NiwxNDYsMjQ2LDI1Myw2NSwxMjYsOTQsMTE3LDE1MSwyNTIsMjI0LDIzNyw2OSwxMDAsMTA4LDIzMywyMTQsMjIsMjIwLDEzNiwxNDEsMzcsOTYsMTcsMjEyLDIwNiwyNSwxMTgsMjA5LDk2LDE0MiwxMSwyMjAsMTg1LDIxOCw0NiwxMjUsMzgsNDgsMTI0LDQ3LDIzLDEyOSwxMDksMjA2LDEwNCwyMSwyMDQsMjE4LDIwMiwxMywxMzgsMTc1LDExNCwxNzUsMjQ5LDU0LDY2LDEzMywxNjcsNjUsMTQyLDY4LDE0NSwxODQsMTksMTcsNzMsMiwzLDEsMCwxXSIsImV4cCI6IjE1MTgxMDIyMzMiLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiZjA4YjFkZWVjMmQ0ZGZlN2YyMWY4ZDcxNDFiNjVhMTNhYTljMjM3MCIsImlhdCI6IjE1MTgwOTg2MzMiLCJhbGciOiJSUzI1NiIsImtpZCI6ImJhNGRlZDdmNWE5MjQyOWYyMzM1NjFhMzZmZjYxM2VkMzg3NjJjM2QifX0=',
  idp: {
    domain: 'google.com',
    protocol: 'OIDC'},
  expires: '1518102233',
  userProfile: {
    sub: '117959105295761687889',
    name: 'test think',
    given_name: 'test',
    family_name: 'think',
    picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    email: 'testandthink123@gmail.com',
    email_verified: true,
    locale: 'en',
    userURL: 'user://google.com/testandthink123@gmail.com',
    preferred_username: 'testandthink123'}};

let dataObjectPopulate = {
  url: 'hyperty://h1.domain/h1',
  data: { type: 'chat', content: 'hello world' },
  reporter: 'hyperty://h1.domain/h1',
  created: '2017-09-26T15:05:14.966Z',
  runtime: runtimeURL,
  schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',
  parent: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a'
};

let messageToBeHashedPopulate = {
  type: 'execute',
  from: hyperURL1,
  to: hyperURL2,
  body: {
    identity: hyperURL1,
    value: 'value',
    handshakePhase: 'handshake'
  }
};

let messageForNewChatCrypto = {
  from: 'hyperty://h1.domain/h1',
  to: 'hyperty://h2.domain/h2',
  body: { ignore: true },
  callback: undefined,
  dataObjectURL: 'comm://localhost/6c3b1310-28e2-43bf-bc1e-a4405a6733a2'
};


let encryptMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderHello',
    value:
      'NDgsNDksNTIsNTAsMzksMTEsMjM5LDIxMSwxODQsMTg1LDE4NSwxNjEsMTQzLDE0NSwyMDEsMTA4LDg2LDIxNSwyNTUsMTUwLDIyMiw1MSwxNDUsMTQzLDEzMCwxNiwxNTYsMTY5LDMyLDIyNywzNSwyNw==',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 12
};

let senderHelloMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderHello',
    value:
      'NDgsNDksNTIsNTAsMzksMTEsMjM5LDIxMSwxODQsMTg1LDE4NSwxNjEsMTQzLDE0NSwyMDEsMTA4LDg2LDIxNSwyNTUsMTUwLDIyMiw1MSwxNDUsMTQzLDEzMCwxNiwxNTYsMTY5LDMyLDIyNywzNSwyNw==',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 12
};

let receiverHelloMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  from: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  body: {
    handshakePhase: 'receiverHello',
    value:
      'NDgsNTAsNTIsNTEsMTUwLDI1MSwzNywxMjMsMzksMjgsNDgsMjksMTE1LDI0NSw5MSwxNDAsNTEsMTM3LDE3MSwyMDUsMTI0LDg3LDE1Myw0MSwyMDIsNzcsOTAsMTg2LDIwNSwxODUsMzMsODA=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWtWTGFrcG9URzUyUW5sS2IyZHdiVnB5TVZGQ01FRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVozbE1SRlY2VEVSSk1VNURkekpPZVhkNFRYcFJjMDFVYTNoTVJFVjVUbE4zTUU1cGQzbE9hWGQ0VFhwbmMwMVVUWHBNUkVWNVRFUkZNRTU1ZDNoUFJGbHpUVlJCZWt4RVdYcE1SR3N4VEVSVmMwMVVaM3BNUkVVd1RFUkZlVTVEZHpKUFEzZDRUbnBOYzAxNlFYTk9hbXR6VFZSQmQweEVSVEpOUTNkNFRtcE5jMDFVVlROTVJHc3hURVJGTkUxNWR6Uk9lWGQ0VDBSSmMwMVVXWGxNUkVVMFRXbDNlVTE2VFhOTlZFMHdURVJGZWs1NWQzcE9RM2Q0VFdwWmMwMVVXVEpNUkVVeFRXbDNlRTFxWTNOT1ZFbHpUVlJuTlV4RVNYcFBVM2Q1VFZSVmMwMXFRWGxNUkVsM1QxTjNlRTVFV1hOUFJGRnpUVlJGTUV4RVJYcE9RM2Q1VFVSWmMwNTZZM05OVkZGNFRFUkZkMDFEZHpOTmFYZDRUbnBKYzAxVVkzZE1SRVV6VDBOM2VFMUVRWE5OYWtFeFRFUlZlRXhFU1hoTlUzY3pUa04zZVUxNmEzTlBWR3R6VFZSbmVFeEVRWE5OZW1kelQxUlZjMDFVWXpWTVJFbHpUME4zZUU5RVkzTk5WRUYzVEVSRk0wMXBkM2xPUkdkelRWUm5lRXhFUlRCT1EzY3dUVk4zTTA1RGR6Sk9VM2Q2VDBOM2VVNVVVWE5OZWsxelRWUk5NRXhFUlRGUFUzY3pUa04zTWs5VGQzbE9SRlZ6VGtOM2VFMXFhM05QVkd0elRWUlpNa3hFU1RCUFEzY3dUMU4zZUU5RVRYTk5WRUV6VEVSRmVrMVRkM3BOVTNkNFRXcEJjMDFVWXpSTVJFVjNUV2wzZVUxcVJYTk5ha0V6VEVSSmVrNURkM2hQUkZselRWUlpORXhFUlRGT2FYYzBUVU4zTVU1NWQzcE5RM2Q0VDBSQmMwMXFTWGhNUkVrd1RXbDNlVTE2V1hOTlZFVjZURVJGTTAxcGQzbE9WRWx6VFZSUk1VeEVSWGxNUkZFeVRFUlpNa3hFUlhoT2FYZDVUVlJOYzAxcVJUQk1SRlV5VEVSSmQwMTVkM2xOYWtGelRWUkplVXhFVlRWTVJFazBURVJKTUV4RVozcE1SRkUwVEVSTk0weEVXWE5OVkd0elRWUlJkMHhFUlRST2VYZDRUbXBWYzAxVVNYTk5WR016VEVSSmVrNURkM2hPUkZselRWUmpORXhFUlROTmVYZDVUVlJWYzA5VWEzTk5WRWt4VEVSSk1VMXBkM2hOVkZWelRXcE5OVXhFU1hkT1EzZDVUa1JyYzAxNmEzTk9SRlZ6VFZSWmMwOVVVWE5OVkUxNVRFUm5NMHhFUlRWT1UzYzFUVk4zTUU1RGQzaFBWRlZ6VFZSSk1FeEVaekZNUkVsNFRsTjNlRTE2WjNOTmFsVjNURVJGZUU1VGQzaE5la0Z6VFZSRmMwMXFVVFJNUkVWNlRWTjNlRTVEZDNoTmFsRnpUbXBWYzAxVVl6Rk1SRWt4VFdsM2VVMXFVWE5OVkdzelRFUm5jMDFVVFhoTVJGVTBURVJGZDAxNWR6Qk5lWGQ1VGxSVmMwMVVhM2xNUkVsM1QxTjNlRTlVWjNOTmFrbDVURVJGTlUxcGQzbE5WR056VFdwVmVFeEVSVFJOYVhjeFQwTjNlRTFxVVhOTmVtZHpUVlJWZDB4RWF6Rk1SRUZ6VFZSUmMwNVVRWE5OZWtWelRWUnJkMHhFUlRKTVJFVXpUbE4zZUU1RGQzaE5lbXR6VFZSbmVFeEVSWE5OYWxFeVRFUm5ORXhFUlhkUFEzY3hUbmwzZVU1RVozTlBSRUZ6VFZSak1reEVSVFZPZVhkNFRsUk5jMDFxUlhkTVJFazFURVJGTlU1NWQzcE9VM2Q1VG1sM2VFMUVXWE5PVkVGelRWUnJjMDlFWTNOT2VtZHpUV3BKTWt4RVJYZE9VM2Q0VFdwRmMwOVVTWE5OYWtFeVRFUkZkMDVwZDNsTmFYZDRUMFJOYzA1cVdYTk5WRUV6VEVSWk1reEVaM05OVkdOM1RFUkZlVTU1ZDNsTmFtZHpUbnBaYzAxcVNUUk1SRWswVEVSSmVrMURkM3BOYVhkNVRXcGpjMDFVVVhwTVJFVTFUMU4zZVV4RVRYTk5VM2QzVEVSRlBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRjNE9Td2laWGh3SWpveE5UQTNPVEE1TXpnNWZRLm40cVdaOUxEMmo2RFJNempyMGZhaGt3YzUzN2tGbEl5bjFOaC1oc0htRGtQdUhFbzAyUnVabm5QX0R6Qzl4aW5abE5GaUo3OE5QNHd4S20zXzFMUzE1Q2VmVnJtY2VsVjd3bGotd21jU1JxR2hiRldZOWJ2eHVJQ0Rfc0VfV1B3djNRRFRZRDdsLVJiOW1MYVhzcF93eXc0Z0k0cFFMczNWd0xpeFJHM0xFY003QzJpQTMwUXFYTkJuQ3pISDBINGhKQ3dUWHQtYThxdlZxemlkU1d0bG1nNWFweDk4cnZOVGVvS1ZPZmNVdUtSVUpqWFVpeHpjbkhXMlcweUJPWXJ6WF93UEt6UzVIYmJJQVBFQmZfZlZqSnI4eEVGcEMzTnphZk1rU1ZETXlIbmt5d3g3U1ItNDRXRVNCekdqM3lCZWRfeW9Idnh3Y29sVU5ZTW1kamxFQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzE1NDQ5MTcxMTI3NTEyNjM0MiIsImVtYWlsIjoidGVzdGFuZHRoaW5rMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJFS2pKaExudkJ5Sm9ncG1acjFRQjBBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd5TERVekxESTFOQ3cyTnl3eE16UXNNVGt4TERFeU5TdzBOaXd5Tml3eE16Z3NNVE16TERFeUxERTBOeXd4T0RZc01UQXpMRFl6TERrMUxEVXNNVGd6TERFMExERXlOQ3cyT0N3eE56TXNNekFzTmprc01UQXdMREUyTUN3eE5qTXNNVFUzTERrMUxERTRNeXc0Tnl3eE9ESXNNVFl5TERFNE1pd3lNek1zTVRNMExERXpOeXd6TkN3eE1qWXNNVFkyTERFMU1pd3hNamNzTlRJc01UZzVMREl6T1N3eU1UVXNNakF5TERJd09Td3hORFlzT0RRc01URTBMREV6TkN3eU1EWXNOemNzTVRReExERXdNQ3czTWl3eE56SXNNVGN3TERFM09Dd3hNREFzTWpBMUxEVXhMREl4TVN3M05Dd3lNemtzT1Rrc01UZ3hMREFzTXpnc09UVXNNVGM1TERJc09Dd3hPRGNzTVRBd0xERTNNaXd5TkRnc01UZ3hMREUwTkN3ME1TdzNOQ3cyTlN3ek9Dd3lOVFFzTXpNc01UTTBMREUxT1N3M05DdzJPU3d5TkRVc05Dd3hNamtzT1Rrc01UWTJMREkwT0N3ME9Td3hPRE1zTVRBM0xERXpNU3d6TVN3eE1qQXNNVGM0TERFd01pd3lNakVzTWpBM0xESXpOQ3d4T0RZc01UWTRMREUxTml3NE1DdzFOeXd6TUN3eE9EQXNNakl4TERJME1pd3lNellzTVRFekxERTNNaXd5TlRJc01UUTFMREV5TERRMkxEWTJMREV4Tml3eU1UTXNNakUwTERVMkxESXdNeXd5TWpBc01USXlMRFU1TERJNExESTBMRGd6TERRNExETTNMRFlzTVRrc01UUXdMREU0Tnl3eE5qVXNNVElzTVRjM0xESXpOQ3d4TkRZc01UYzRMREUzTXl3eU1UVXNPVGtzTVRJMUxESTFNaXd4TVRVc01qTTVMREl3TkN3eU5Ea3NNemtzTkRVc01UWXNPVFFzTVRNeUxEZzNMREU1TlN3NU1TdzBOQ3d4T1RVc01USTBMRGcxTERJeE5Td3hNemdzTWpVd0xERXhOU3d4TXpBc01URXNNalE0TERFek1Td3hOQ3d4TWpRc05qVXNNVGMxTERJMU1pd3lNalFzTVRrM0xEZ3NNVE14TERVNExERXdNeXcwTXl3eU5UVXNNVGt5TERJd09Td3hPVGdzTWpJeUxERTVNaXd5TVRjc01qVXhMREU0TWl3MU9Dd3hNalFzTXpnc01UVXdMRGsxTERBc01UUXNOVEFzTXpFc01Ua3dMREUyTERFM05Td3hOQ3d4TXprc01UZ3hMREVzTWpRMkxEZzRMREV3T0N3MU55d3lORGdzT0RBc01UYzJMREU1Tnl3eE5UTXNNakV3TERJNUxERTVOeXd6TlN3eU5pd3hNRFlzTlRBc01Ua3NPRGNzTnpnc01qSTJMREV3TlN3eE1qRXNPVElzTWpBMkxERXdOaXd5TWl3eE9ETXNOallzTVRBM0xEWTJMRGdzTVRjd0xERXlOeXd5TWpnc056WXNNakk0TERJNExESXpNQ3d6TWl3eU1qY3NNVFF6TERFNU9Td3lMRE1zTVN3d0xERT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1Nzg5IiwiZXhwIjoiMTUwNzkwOTM4OSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909389'
    },
    auth: false,
    via: 'runtime://localhost/protostub/6697977f-9776-c8b8-ec3d-8269f0e65536'
  },
  id: 5
};

let senderCertificateMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderCertificate',
    value:
      'eyJpdiI6Ik1UZzBMREl6Tml3eU1EY3NNakVzTVRjM0xESXpOeXcwTXl3eE9EQXNNVE14TERZeUxESXdMREUxTERJMU5TdzNOeXd5TlRVc05UYz0iLCJoYXNoIjoiTVRVMExERTBNaXd5TkRNc05EUXNNVElzTVRrNUxETTVMREUwTml3eE1qY3NNVGsxTERJeE1pdzVNaXd6TUN3eE9UY3NNVGM1TERFM01Td3hORFVzTWpFNUxERXlNU3d5TlRNc01qVXlMREUyT0N3MU1pdzRNQ3c0TlN3eE1UQXNORGdzTnpNc05EQXNOekVzTXpBc09ETT0iLCJzeW1ldHJpY0VuY3J5cHRpb24iOiJOalFzTVRVM0xERXpNeXcyTERFMU1Td3hNak1zTVRZNUxERTFPU3czTlN3ek9Dd3hOallzTmpRc01qSXhMREU1TVN3ek9Td3hOems9IiwiYXNzeW1ldHJpY0VuY3J5cHRpb24iOiJPRElzTnpRc01UY3dMREk0TERJME55dzFOQ3d5TXpVc01UVTJMREV3T0N3eE5qQXNNVEF4TERFMk1pd3hNemNzTVRReUxERTJNaXd5TkN3eE5USXNNelFzTXpnc01qVXpMREUxTXl3eE1UWXNOVGNzTWpNMkxERTVPU3cxTkN3eE9Dd3pOaXczTml3eU1EUXNNelFzTWpJd0xERXlNQ3d4TWpJc01UZ3NNalV6TERFNU5pd3lNRFFzTVRVNUxEVTVMREUyTUN3eE1qZ3NNak0zTERneExEa3hMREU0TlN3eE9EZ3NNVGd4TERJeE1Dd3hOVFlzTkRJc01USXdMREkxTERFMk15dzNNeXcyT0N3MU15d3hOeklzTWpFMkxESTBNU3d4TURJc09ERXNPREFzTVRFc01URTFMREUzTXl3Mk1pd3lNamdzTWpJeUxEVXhMREl3TVN3NU5Dd3lOVE1zT0RFc01qa3NPU3d5TWpjc016TXNOelFzTWpNNUxESTFNU3d5TWpJc05qY3NOVFFzTWpBMUxERTBNQ3c0TVN3eE5EWXNORE1zTmpnc01qVXpMREV6TERFeE1Td3hNakFzTWpVc01UazJMRGd4TERNMUxEZzBMREl5Tnl3eU5EZ3NOREFzTVRRc01USTFMREl5TUN3eU1EVXNNVGMzTERFeExEa3dMREUwTnl3MUxESXlNaXd5TWpjc01UQTJMREUzTXl3eE5Ea3NNVEkzTERjeExERXpOU3d4T1Rrc01UUTVMREUzT1N3eE9USXNNakU0TERJeE9Td3hPRGdzTVRVc01qa3NNVGM0TERJd055dzFOQ3d5Tml3eU1qWXNNalE1TERFek5pd3hOVGdzTXpnc01qRTVMRGcyTERFd01TdzROaXd5TkRJc09UZ3NNVGc1TERZeExERTBNeXd5TXpZc01UWXNOaXczTkN3eU16RXNNVFF4TERFME1Dd3hORGNzTWpFM0xESXhNeXd5T1N3eE1pd3lNellzTVRJMUxERXlMRFFzTnpVc05TdzVPU3d4Tnl3eE1pd3hOak1zTVRRMkxERTFNU3d5TVRZc01qQTBMRFkyTERNc01qQXdMREU1Tml3eE16WXNNVEU1TERFeE5Td3lOVFFzTWpFeUxEUTJMREUyTERFNE9TdzBPU3d4TURNc01UYzVMREl5TlN3eU5EWXNNVGcxTERJME55d3hPRFFzTWpFekxESXhOU3czTkN3eE5EUXNNekFzTVRNeExESXlOU3d5TXpFc05qVXNNVFl4TERFNE1Td3lNVElzTVRVMUxEYzBMREU1TERFMU9Td3lNRE1zTVRjM0xERTJPQ3d3TERFeE5DdzVNaXd4T1Rnc01UUTFMREU0TkN3eU1UZ3NOalVzTnpVc09UVXNNVEV4TERFeE9Dd3hORGNzTWpVMUxEY3NNVGt3TERZM0xERTJNU3d4TlRjc01UVTRMREUzTkN3eU1USXNNalV6TERRNExEUTVMREUwTnl3eE9USXNPVFFzTWpFMkxESXdNeXc0T0N3eE1qZ3NOalFzTVRnd0xEZzJMREl6T0N3eE5qSXNPVFVzTVRNeUxEZzFMREUzTVN3ME9TdzJNaXcwT1N3eiIsInNpZ25hdHVyZSI6Ik9ETXNNak16TERjd0xEYzVMRGM0TERFMk1Td3hNRGdzTmpFc01UUXdMREl6T0N3NU5pd3pNQ3d4T1RFc01UQXhMREV3TkN3eE5qZ3NNVEkyTERFNU5Td3lNRGtzTVRVMkxERTVPQ3d4TVRZc01URXNNak13TERZekxERTJNU3d4TnpNc01qSXlMREU1TERFM05Td3lNak1zT0Rjc01qVXlMRFl3TERFNE9Dd3hORGNzTVRVeUxESXlOeXcxTWl3eU5pd3lPQ3d4TlRJc05Td3hOemdzTVRBNUxERXhOQ3d4TWpZc01UZ3pMREU0T0N3NU5Td3lNelVzTXpNc01UVXNPVElzTVRReUxERTRNeXd4TnpVc01qRTJMREVzTVRVMkxERTBPQ3c0T1N3ek5pd3lNemNzTWpFeExERXpNQ3d4Tnl3eU5ESXNNVGMyTERFM0xERTRNaXd5TWpjc01UTXNNVE0wTERJek1Td3hNekFzTVRNNExEVTRMRGtzTWpVd0xEVTNMREkxTkN3eE1qQXNNVFV6TERReUxESTBMREV6TVN3eU9Dd3lMREl4TUN3eU1qSXNOakFzTWpJM0xERTNNaXd5TXpFc056VXNNVEkwTERZNExESXlOaXd4TnpBc01qUTBMREV5TlN3eU5EUXNOek1zT1RVc01qUXhMREV5TVN3eE56Z3NNelVzTWpFMExEVTRMRE0xTERFM0xEYzJMRGM1TERFNE5TdzFNU3d6T1N3eU5ETXNNalV6TERFM09Td3hORGtzTWpNMkxESXhOeXd5TVRnc01USTNMRE13TERZekxERTJNU3d4TURJc01UYzJMREV4T0N3eE5Dd3lNelFzTXpBc01UZ3hMRGdzTXprc056RXNPRGdzTVRFeUxEUXlMRElzTVRNeExEa3lMRGsyTERFNU9Dd3hPRGdzTXpJc05EVXNNak00TERZMExERTJNQ3d4T0Rrc01USTJMREl6TkN3M015d3pPQ3d4TVRRc056a3NNVFU1TERJMExESXdOeXd5TURJc01qSXhMRGsyTERJd09Td3hPREVzT0RZc05UY3NNVE13TERFd05pd3lOVElzTVRBd0xEQXNNVE15TERReExEWXdMREV6TlN3eE5qSXNOemtzTWpRekxESXhOU3cyT1N3NE1Td3hOREVzTWpnc01qQTRMREUzTUN3eU5UUXNNVEkzTERJd01Td3hORE1zTVRVMExERXlOaXd4TkRRc05USXNNVEE1TERFek5Td3hNREVzTmprc01qSXpMRGMzTERFM055dzNPU3d4TlN3eE5EUXNOVFVzTWpNMkxERXpOaXd4TXpBc016RXNNVGt6TERJMU5TdzFOeXd4TkN3eU5EWXNNVEk1TERZMExETTNMREUxTkN3eE1qY3NNeXd4TlRRc01qQXhMREl4Tml3eU1qQXNNVGd3TERjM0xESTBPU3d4T0RVc01Td3pPQ3d4TURVc01qUTJMRGd6TERFMk15d3pNQ3d4TmpVc01UTTBMREV4Tml3eE1Dd3lOQ3d4T0RNc01UY3dMREV6TERVd0xERTBPQ3d5TlRBc056TXNNVGN6TERjNUxESXlNU3d4TVRBc01URXdMRFV6In0=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 14
};


let validateAssertionValuePopulate = {
  identity: 'testandthink321@gmail.com',
  contents: 'NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTU4LDE0NCwxNjEsOTcsMTU1LDIxNyw0MCw1MiwxMzgsMTQ3LDI4LDIwNiwxNTgsMjMyLDE0Miw1OSwxMTksNjEsMTE1LDYwLDIzMSwyMDMsNzksNTcsNTQsMTg3LDUyLDEyNCw2MSw3MCwyNywxOTIsNzgsMTYyLDExMywxMTIsMjksNTksMTg3LDQ2LDE3NSwxMDUsMTUsMTQwLDE1NCw2NCwxOTgsMTI5LDE0Myw1OSwyMjksMTA3LDk2LDExNiw3Myw2MywxNjAsMTUxLDE0MiwxMTIsOTUsMTIsMzUsMTE3LDI1MCw3MiwyMjEsMTc1LDU3LDIxNSwxMzksNDcsMTY5LDIzLDE3MywyMzIsMjAwLDE2NSwxNCwyMzcsNTYsMTUyLDIwMyw3LDEzOSwxMzQsMjQ5LDExMCwxNTMsMTYyLDY1LDIzNSw0MywxODIsMjIyLDE2NCwyMDcsNzQsMjQ5LDkwLDUxLDEzNiwyMjUsNTYsMTE5LDk1LDEzOCwxNjUsMjUsMTc3LDI1NCwyMjYsMjExLDg4LDI0MywxNiwxMDksODYsMTYxLDE0NywxNDQsMTM5LDE0NCw2LDcyLDQ0LDE2MywxMjAsNjEsMTk5LDk4LDEwNiwxMzMsMTg3LDEzMiwyMCwyNDQsMjcsMjM2LDIyOSwxOTcsMTE5LDE5NiwzNywxNDcsMTMwLDEzOSwyMzcsMTQ0LDE5MSwyMzMsMTY3LDEzMyw1MSwxNDYsMTEsMjA3LDYyLDE1NywxMzYsMzEsNzksMTYzLDQ4LDE4NCwxNTAsMjIyLDE1NCwyMCw3OCwyMzMsMjE2LDU1LDEzNCwxNzQsOTksMjIxLDgsOTQsMTQxLDE2Niw0NywxMzAsODksMjQ3LDIwMiwyMDMsMTIwLDk3LDEwMywyMTksMTA4LDQwLDUzLDEyNiwxODYsMywyMTksODYsODksMjM0LDE4Miw0Miw0OCwxNTIsMjAyLDYsMTMxLDE4NCwxMDUsNzIsOTMsMTA3LDIxNywxNzAsNzEsMTMwLDE4MywxMzYsMjU0LDEyMiw5OCwxNjQsNzUsMjM2LDE0NiwxMjcsMjcsMjYsMTQzLDExMiwxMTIsMjMyLDI0NCwxOSwxOTUsMjUzLDEwMywxODksNzgsMTI5LDIzMiwxNDcsMTg3LDk2LDQsMjMsMTQsMyw1MCwxMzMsOTMsMjMyLDI0NywyMDgsMjA1LDIsMywxLDAsMQ=='
};


let getHypertyOwnerPopulate = arg => {
  return 'user://google.com/testandthink123@gmail.com';
};

let coreDiscoveryPopulate = function(arg1, arg2) {
  return Promise.resolve({ dataObject: 'hyperty://h1.domain/h1' });
};


function log(x, y) {
  console.log(x, y);
}

let chatKeysPopulate = {
  hypertyFrom: {
    hyperty: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
    userID: 'testandthink123@gmail.com',
    privateKey: undefined,
    publicKey: undefined,
    assertion: 'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
    messageInfo: {
      userProfile: undefined,
      idp: 'google.com',
      assertion: 'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    }
  },
  hypertyTo: {
    hyperty: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
    userID: undefined,
    publicKey: undefined,
    assertion: undefined
  },
  keys: {
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
  initialMessage: { body: { value: 'Initial Message Value' } },
  callback: undefined,
  authenticated: true,
  dataObjectURL: 'comm://localhost/6c3b1310-28e2-43bf-bc1e-a4405a6733a2'
};
