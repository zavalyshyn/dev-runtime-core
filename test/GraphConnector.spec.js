import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

// dependencies
import BloomFilter from '../src/graphconnector/BloomFilter';
import GraphConnector from '../src/graphconnector/GraphConnector';
import GraphConnectorContactData from '../src/graphconnector/GraphConnectorContactData';
import bip39 from 'bip39';
import jsrsasign from 'jsrsasign';
import Registry from '../src/registry/Registry';
import MessageBus from '../src/bus/MessageBus';
import SandboxFactory from '../resources/sandboxes/SandboxFactory';

// variables
let runtimeURL = 'hyperty-runtime://ua.pt/123';
let sandboxFactory = new SandboxFactory();
let appSandbox = sandboxFactory.createAppSandbox();

let identityModule = {
  getIdentities: () => {
    let identities = [];
    let identityBundle = {identity: 'user://gmail.com/openidtest10', token: 'idToken'};
    identities.push(identityBundle);
    return identities;
  }
};

let getRegistry = new Promise(function(resolve, reject) {
  var registry = new Registry(runtimeURL, appSandbox, identityModule);
  resolve(registry);
});

getRegistry.then(function(registry) {
  describe('Graph Connector', function() {

    describe('construction', function() {
      it('create new GraphConnector instance with zero contacts', function() {
        let msgbus = new MessageBus(registry);
        registry.messageBus = msgbus;
        let graphConnector = new GraphConnector(runtimeURL, msgbus);
        expect(graphConnector.contacts.length).to.equal(0);
      });
    });

    describe('create mock address book', function() {
      let msgbus = new MessageBus(registry);
      registry.messageBus = msgbus;
      var graphConnector = new GraphConnector(runtimeURL, msgbus);
      let guid;
      let firstName;
      let lastName;
      let remGUIDArr = [];
      for (let j = 0; j < 299; j++) {

        // to mock GUIDs for now
        guid = Math.floor(Math.random() * 9999999999999999999999999999999999) + 1000000000000000000000000000000000;

        firstName = randomName();
        lastName = randomName();
        graphConnector.addContact(guid, firstName, lastName);
        if (j % 10 === 0) {
          remGUIDArr.push(guid);
        }
      }
      graphConnector.addContact('123', 'Alice', 'Wonderland');
      var expected = new GraphConnectorContactData('123', 'Alice', 'Wonderland');

      it('create new GraphConnector with random contacts', function() {
        expect(graphConnector.contacts.length).to.equal(300);
      });

      it('remove some contacts from GraphConnector', function() {
        for (let j = 0; j < remGUIDArr.length; j++) {
          graphConnector.removeContact(remGUIDArr[j]);
        }
        expect(graphConnector.contacts.length).to.equal(270);
      });

      it('get contact by first name', function() {
        let result = graphConnector.getContact('Alice');
        expect(result.length).to.equal(1);
        expect(result[0]).to.eql(expected);
      });

      it('get contact by last name', function() {
        let result = graphConnector.getContact('Wonderland');
        expect(result.length).to.equal(1);
        expect(result[0]).to.eql(expected);
      });

      it('check GUID when in direct contacts', function() {

        // Format is: RelatedContacts<Direct<GraphConnectorContactData>,FoF<GraphConnectorContactData>>
        let result = graphConnector.checkGUID('123');
        let directContacts = result[0];
        let fofs = result [1];
        expect(result.length).to.equal(2);
        expect(directContacts.length).to.equal(1);
        expect(fofs.length).to.equal(0);
        expect(directContacts[0]).to.eql(expected);
      });

      it('test direct contacts bloom filter', function() {

        graphConnector.calculateBloomFilter1Hop();

        for (let i = 0; i < remGUIDArr.length; i++) {
          let result = graphConnector.contactsBloomFilter1Hop.test(remGUIDArr[i]);
          expect(result).to.equal(false);
        }

        let resultAlice = graphConnector.contactsBloomFilter1Hop.test('123');
        expect(resultAlice).to.equal(true);
        expect(graphConnector.contactsBloomFilter1Hop.test('absdgdghdftgh')).to.equal(false);
        graphConnector.removeContact('123');
        expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(false);

      });

      it('test privacy setting for contacts', function() {

        graphConnector.addContact('123', 'Alice', 'Wonderland');
        graphConnector.calculateBloomFilter1Hop();
        expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(true);

        // set private
        graphConnector.getContact('Alice')[0].privateContact = true;
        graphConnector.calculateBloomFilter1Hop();
        expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(false);

      });

      it('check GUID when in friend-of-friend connection', function() {

        let bf = new BloomFilter(
          431328,   // number of bits to allocate.
          10        // number of hash functions.
        );

        bf.add('george');
        bf.add('jerry');
        bf.add('elaine');
        graphConnector.getContact('Alice')[0].contactsBloomFilter1Hop = bf;

        let result = graphConnector.checkGUID('george');
        let directContacts = result[0];
        let fofs = result [1];
        expect(result.length).to.equal(2);
        expect(directContacts.length).to.equal(0);
        expect(fofs.length).to.equal(1);

        // connection through Alice
        expect(fofs[0].firstName).to.eql('Alice');
        expect(fofs[0].lastName).to.eql('Wonderland');
        expect(fofs[0].guid).to.eql('123');

      });

      it('bloom filter tests', function() {

        let jabberwocky = '`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe:\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.\n\n\"Beware the Jabberwock, my son!\n  The jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\n  The frumious Bandersnatch!\"\n\nHe took his vorpal sword in hand:\n  Long time the manxome foe he sought --\nSo rested he by the Tumtum tree,\n  And stood awhile in thought.\n\nAnd, as in uffish thought he stood,\n  The Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\n  And burbled as it came!\n\nOne, two! One, two! And through and through\n  The vorpal blade went snicker-snack!\nHe left it dead, and with its head\n  He went galumphing back.\n\n\"And, has thou slain the Jabberwock?\n  Come to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!\n  He chortled in his joy.\n\n`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe;\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.';

        let f = new BloomFilter(1000, 4);
        let n1 = 'Bess';
        let n2 = 'Jane';
        f.add(n1);
        expect(f.test(n1)).to.equal(true);
        expect(f.test(n2)).to.equal(false);

        f = new BloomFilter(1000, 4);
        n1 = jabberwocky;
        n2 = jabberwocky + '\n';
        f.add(n1);
        expect(f.test(n1)).to.equal(true);
        expect(f.test(n2)).to.equal(false);

        f = new BloomFilter(1000, 4);
        n1 = '\u0100';
        n2 = '\u0101';
        let n3 = '\u0103';
        f.add(n1);
        expect(f.test(n1)).to.equal(true);
        expect(f.test(n2)).to.equal(false);
        expect(f.test(n3)).to.equal(false);

        f = new BloomFilter(20, 10);
        f.add('abc');
        expect(f.test('wtf')).to.equal(false);

        f = new BloomFilter(1000, 4);
        f.add(1);
        expect(f.test(1)).to.equal(true);
        expect(f.test(2)).to.equal(false);

        f = new BloomFilter(1000, 4);
        for (let i = 0; i < 100; ++i) {
          f.add(i);
        }
        expect(f.size()).to.be.closeTo(99.953102, 1e-6);
        for (let i = 0; i < 1000; ++i) {
          f.add(i);
        }
        expect(f.size()).to.be.closeTo(950.424571, 1e-6);

      });

    });

    describe('GUID', function() {
      let msgbus = new MessageBus(registry);
      registry.messageBus = msgbus;
      let graphConnector1 = new GraphConnector(runtimeURL, msgbus);
      let graphConnector2 = new GraphConnector(runtimeURL, msgbus);

      it('GUID generation', function() {

        this.timeout(30000);

        let mnemonic1 = graphConnector1.generateGUID();
        let res = mnemonic1.split(' ');

        expect(res.length).to.equal(16);

      });

      it('GUID re-generation', function(done) {

        this.timeout(15000);

        // create mnemonic and sign Global Regsitry record
        let mnemonic1 = graphConnector1.generateGUID();
        let jwt1 = graphConnector1.signGlobalRegistryRecord();

        // mock reply from Global Registry
        graphConnector2.messageBus.addListener('global://registry/', (msg) => {
          let message = {id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
          body: { message: 'request was performed successfully',
          responseCode: 200,
          data: jwt1,
          errorCode: 0 }};

          graphConnector2.messageBus.postMessage(message, (reply) => {
            console.log('Reply GUID re-generation: ', reply);
          });
        });

        expect(graphConnector2.useGUID(mnemonic1).then(function(response) {
          let publicKey2 = graphConnector2.globalRegistryRecord.publicKey;
          let publicKeyObject2 = jsrsasign.KEYUTIL.getKey(publicKey2);
          let isValid = KJUR.jws.JWS.verify(jwt1, publicKeyObject2, ['ES256']);
          return isValid;
        })).to.be.fulfilled.and.eventually.equal(true).and.notify(done);

      });
    });

    describe('Global Registry Connection - send', function() {
      let msgbus = new MessageBus(registry);
      registry.messageBus = msgbus;
      let graphConnector1 = new GraphConnector(runtimeURL, msgbus);
      let graphConnector2 = new GraphConnector(runtimeURL, msgbus);

      it('send Global Registry Record', function(done) {

        this.timeout(15000);

        // create mnemonic and sign Global Regsitry record
        let mnemonic1 = graphConnector1.generateGUID();
        let jwt1 = graphConnector1.signGlobalRegistryRecord();

        // mock reply from Global Registry 1
        graphConnector1.messageBus.addListener('global://registry/', (msg) => {
          let message = {id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
          body: { message: 'request was performed successfully',
          responseCode: 200,
          errorCode: 0 }};

          graphConnector1.messageBus.postMessage(message, (reply) => {
            console.log('Reply GRC - send: ', reply);
          });
        });

        expect(graphConnector1.sendGlobalRegistryRecord(jwt1).then(function(response) {
          return response;
        })).to.be.fulfilled.and.eventually.equal(200).and.notify(done);

      });
    });

    describe('Global Registry Connection - use GUID', function() {
      let msgbus = new MessageBus(registry);
      registry.messageBus = msgbus;
      let graphConnector1 = new GraphConnector(runtimeURL, msgbus);
      let graphConnector2 = new GraphConnector(runtimeURL, msgbus);

      it('re-use GUID and retrieve data from Global Registry', function(done) {

        this.timeout(15000);

        // create mnemonic and sign Global Regsitry record
        let mnemonic1 = graphConnector1.generateGUID();
        let jwt1 = graphConnector1.signGlobalRegistryRecord();
        let grr1 = graphConnector1.globalRegistryRecord;

        // mock reply from Global Registry 2
        graphConnector2.messageBus.addListener('global://registry/', (msg) => {
          let message = {id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
          body: { message: 'request was performed successfully',
          responseCode: 200,
          data: jwt1,
          errorCode: 0 }};

          graphConnector2.messageBus.postMessage(message, (reply) => {
            console.log('Reply GRC - use GUID: ', reply);
          });
        });

        expect(graphConnector2.useGUID(mnemonic1).then(function(response) {
          return graphConnector2.globalRegistryRecord;
        })).to.be.fulfilled.and.eventually.eql(grr1).and.notify(done);
      });

    });

    describe('Querying Global Registry', function() {
      let msgbus = new MessageBus(registry);
      registry.messageBus = msgbus;
      let graphConnector1 = new GraphConnector(runtimeURL, msgbus);
      let graphConnector2 = new GraphConnector(runtimeURL, msgbus);

      it('query Global Registry', function(done) {

        this.timeout(15000);

        // create mnemonic and sign Global Regsitry record
        let mnemonic1 = graphConnector1.generateGUID();
        let jwt1 = graphConnector1.signGlobalRegistryRecord();
        let guid1 = graphConnector1.globalRegistryRecord.guid;
        let result = new GraphConnectorContactData();

        // mock reply from Global Registry
        graphConnector2.messageBus.addListener('global://registry/', (msg) => {
          let message = {id: 1, type: 'response', from: 'global://registry/', to: msg.from,
          body: { message: 'request was performed successfully',
          responseCode: 200,
          data: jwt1,
          errorCode: 0 }};

          graphConnector2.messageBus.postMessage(message, (reply) => {
            console.log('Reply QGR - query: ', reply);
          });
        });

        expect(graphConnector2.queryGlobalRegistry(guid1).then(function(response) {
          return response.guid;
        })).to.be.fulfilled.and.eventually.equal(guid1).and.notify(done);

      });

    });

  });
});

function randomName() {
  let text = '';
  let firstLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let restLetters = 'abcdefghijklmnopqrstuvwxyz';

  text += firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));

  for (let i = 0; i < 4; i++) {
    text += restLetters.charAt(Math.floor(Math.random() * restLetters.length));
  }

  return text;
}