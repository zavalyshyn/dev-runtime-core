// jshint browser:true, jquery: true

import {addLoader, removeLoader, documentReady, errorMessage} from './support';

import {MessageFactory} from 'service-framework';

import RuntimeUA from '../src/runtimeUA';
import SandboxFactory from '../resources/sandboxes/SandboxFactory';

let sandboxFactory = new SandboxFactory();
let avatar = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

// You can change this at your own domain
let domain = 'localhost';

let runtime = new RuntimeUA(sandboxFactory, domain);

// Check if the document is ready
if (document.readyState === 'complete') {
  documentReady();
} else {
  window.addEventListener('onload', documentReady, false);
  document.addEventListener('DOMContentLoaded', documentReady, false);
}

let loginBtn = document.querySelector('.login');
loginBtn.addEventListener('click', function(e) {

  let loginPanel = document.querySelector('.login-panel');
  let content = loginPanel.querySelector('.card-action');
  addLoader(content);

  runtime.identityModule.loginWithRP().then(function(result) {
    removeLoader(content);
    userLoged(result);
  }).catch(errorMessage);

  let btn = $(e.currentTarget);
  btn.addClass('hide');

});

function userLoged(result) {

  let hypertyHolder = $('.hyperties');
  hypertyHolder.removeClass('hide');

  let cardHolder = $('.card-content');
  let html = '<div class="row"><div class="col s12"><span class="card-title">Logged</span></div><div class="col s2"><img alt="" class="circle responsive-img" src=' + result.picture + ' ></div><div class="col s8"><p><b>id:</b> ' + result.id + '</p><p><b>email:</b> ' + result.email + '</p><p><b>name:</b> ' + result.name + '</p><p><b>locale:</b> ' + result.locale + '</p></div>';

  cardHolder.html(html);

  console.log(result);

  // let protocolStub = 'hyperty-catalogue://' + domain + '/.well-known/protocolstub/VertxProtoStub';
  //
  // runtime.loadStub(protocolStub).then(function(result) {
  //   console.log(result);
  // }).catch(function(reason) {
  //   errorMessage(reason);
  // });

  let hyperty = 'hyperty-catalogue://' + domain + '/.well-known/hyperty/HelloHyperty';

  // Load First Hyperty
  runtime.loadHyperty(hyperty).then(hypertyDeployed).catch(function(reason) {
    errorMessage(reason);
  });

}

function hypertyDeployed(result) {

  let loginPanel = $('.login-panel');
  let cardAction = loginPanel.find('.card-action');
  let hypertyInfo = '<span class="white-text"><p><b>hypertyURL:</b> ' + result.runtimeHypertyURL + '</br><b>status:</b> ' + result.status + '</p></span>';

  loginPanel.attr('data-url', result.runtimeHypertyURL);
  cardAction.append(hypertyInfo);

  // Prepare to discover email:
  discoverEmail();

  // Prepare the chat
  let messageChat = $('.hyperty-chat');
  messageChat.removeClass('hide');

  runtime.messageBus.addListener(result.runtimeHypertyURL, newMessageRecived);
}

function discoverEmail() {

  let section = $('.discover');
  let searchForm = section.find('.form');
  let inputField = searchForm.find('.friend-email');

  section.removeClass('hide');

  searchForm.on('submit', function(event) {
    event.preventDefault();

    let collection = section.find('.collection');
    let collectionItem = '<li class="collection-item"><div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></li>';

    collection.removeClass('hide');
    collection.addClass('center-align');
    collection.html(collectionItem);

    let email = inputField.val();
    console.log(email);
    runtime.registry.getUserHyperty(email).then(emailDiscovered).catch(emailDiscoveredError);

  });
}

function emailDiscovered(result) {
  // Email Discovered:  Object {id: "openidtest10@gmail.com", descriptor: "http://ua.pt/HelloHyperty", hypertyURL: "hyperty://ua.pt/27d080c8-22ef-445f-9f9a-f2c750fc6d5a"}

  console.log('Email Discovered: ', result);

  let section = $('.discover');
  let collection = section.find('.collection');
  let collectionItem = '<li class="collection-item avatar"><img src="' + avatar + '" alt="" class="circle"><span class="title">' + result.id + '</span><p>' + result.descriptor + '<br>' + result.hypertyURL + '</p><a href="#!" class="message-btn"><i class="material-icons left">message</i>Send Message</a></li>';

  collection.empty();
  collection.removeClass('center-align');
  collection.append(collectionItem);

  let messageChatBtn = collection.find('.message-btn');
  messageChatBtn.on('click', function(event) {
    event.preventDefault();
    openChat(result);
  });

}

function emailDiscoveredError(result) {

  // result = {
  //   id: 'openidtest10@gmail.com',
  //   descriptor: 'http://ua.pt/HelloHyperty',
  //   hypertyURL: 'hyperty://ua.pt/27d080c8-22ef-445f-9f9a-f2c750fc6d5a'
  // };
  //
  // emailDiscovered(result);

  console.error('Email Discovered Error: ', result);

  let section = $('.discover');
  let collection = section.find('.collection');

  let collectionItem = '<li class="collection-item orange lighten-3"><i class="material-icons left circle">error_outline</i>' + result + '</li>';

  collection.empty();
  collection.removeClass('center-align');
  collection.removeClass('hide');
  collection.append(collectionItem);
}

function openChat(result) {

  let messagesChat = $('.messages');
  let messageForm = messagesChat.find('.form');
  let loginPanel = $('.login-panel');
  let fromUser = loginPanel.attr('data-url');
  let toUserEl = messagesChat.find('.runtime-hyperty-url');
  let toUser = result.hypertyURL;

  toUserEl.html(toUser);

  messageForm.on('submit', function(e) {

    let messageText = messagesChat.find('.message-text').val();

    if (messageText) {
      sendMessage(fromUser, toUser, messageText);
    }

    messageForm[0].reset();

    e.preventDefault();
  });

  messagesChat.removeClass('hide');

}

function newMessageRecived(msg) {

  processMessage(msg, 'in');

}

function processMessage(msg, type) {

  let side = 'right';
  if (type === 'out') {
    side = 'left';
  }

  let messageCollection = $('.hyperty-chat .collection');
  let messageItem = '<li class="collection-item avatar ' + side + '"><img src="' + avatar + '" alt="" class="circle"><span class="title">' + msg.from + '</span><span class="text left">' + msg.body.value.replace(/\n/g, '<br>') + '</span></li>';

  messageCollection.append(messageItem);
}

function sendMessage(from, to, message) {

  let msgFactory = new MessageFactory();

  //from, to, contextId, idToken, accessToken, resource, signature, schema,assertedIdentity, value, policy
  let msg = msgFactory.createMessageRequest(from, to, '', '', '', '', '', '', '', message);

  processMessage(msg, 'out');
  runtime.messageBus.postMessage(msg);
}
