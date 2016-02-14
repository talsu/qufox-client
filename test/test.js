// is Node.js
if (typeof module !== 'undefined' && module.exports) {
  var Qufox = require('../qufox-client.js');
  var assert = require('chai').assert;
  var async = require('async');
} else {
  var assert = chai.assert;
}

describe('Qufox client Test', function(){
  function createClient(url, options, connectCallback){
    return Qufox(url, options, connectCallback);
  }

  var serverUrl = 'https://talk.talsu.net';
  var options = {
    'path': '/qufox.io',
    'sync disconnect on unload': true,
    'reconnection limit': 6000, //defaults Infinity
    'max reconnection attempts': Infinity, // defaults to 10
    'force new connection': true
  };

  it('Echo message', function (done){
    this.slow(1000);
    this.timeout(5000);
    var sessionName = 'echoSession';
    var testMessage = 'this is a test.';
    var client = createClient(serverUrl, options);
    client.join(sessionName, function (message){
      assert.strictEqual(message, testMessage);
      client.close();
      done();
    }, function (){
      client.send(sessionName, testMessage, true);
    });
  });

  it('Send message', function (done){
    this.slow(1000);
    this.timeout(5000);
    var sessionName = 'SendMessageSession';
    var testMessage = 'this is a test.';
    var readyCount = 0;
    var receiver = createClient(serverUrl, options);

    receiver.join(sessionName, function (message) {
      assert.strictEqual(message, testMessage);
      receiver.close();
      done();
    }, function (){
      var sender = createClient(serverUrl, options, function (){
        sender.send(sessionName, testMessage);
        sender.close();
      });
    });
  });

  it('Multiple client communication', function (done){
    var numberOfClients = 10;
    this.slow(numberOfClients * 500);
    this.timeout(numberOfClients * 1000);
    var indexs = [];
    var clients = [];
    for (var i = 0; i < numberOfClients; ++i) indexs.push(i);

    async.each(indexs, function (index, next){
      clients[index] = createClient(serverUrl, options, next);
    }, function (err){
      clientsCommunicationTest(clients, function(){
        for (var i = 0; i < numberOfClients; ++i){
          clients[i].close();
        }
        done();
      });
    });
  });

  function clientsCommunicationTest(clients, callback){
    var sessionName = 'testSession';
    var resultsArray = [];
    for (var i = 0; i < clients.length; ++i){
      clients[i].index = i;
      resultsArray[i] = new Array(clients.length);
      for (var j = 0; j < clients.length; ++j) {
        resultsArray[i][j] = false;
      }
      resultsArray[i][i] = true;
    }

    checkResults(false);
    var intervalJob = setInterval(function(){checkResults(false);}, 1000);

    async.each(clients, function (client, next){
      client.join(sessionName, function(clientIndex){
        resultsArray[client.index][clientIndex] = true;
        if (checkResults()){
          checkResults(false);
          clearInterval(intervalJob);
          callback();
        }
      }, function (){ next(); });
    }, function (err){
      clients.forEach(function (client){
        setTimeout(function(){
          client.send(sessionName, client.index);
        }, 500 * client.index);
      });
    });

    function checkResults(isPrint){
      if (isPrint) console.log('---- result array ----');
      resultsArray.forEach(function(results){
        var printArray = results.map(function(result){ return result ? 1 : 0; });
        if (isPrint) console.log(printArray);
      });

      var allDone = resultsArray.every(function (results){
        return results.every(function (result){ return result; });
      });

      if (isPrint) console.log(allDone);

      return allDone;
    }
  }
});
