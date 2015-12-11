
var serverUrl = process.argv[2] || 'https://talk.talsu.net';

var options = {
  'path': '/qufox.io',
  'sync disconnect on unload': true,
  'reconnection limit': 6000, //defaults Infinity
  'max reconnection attempts': Infinity, // defaults to 10
  'force new connection': true
};
var packetReceiveCount = 0;
var client1 = require('../index')(serverUrl, options);
setStatusChangedLog(client1, 'client1');
client1.join('testSession',
function (packet){
  ++packetReceiveCount;
  console.log(packetReceiveCount + ' : ' + packet);
  if (packetReceiveCount >= 2){
    console.log('test complete !.');
    process.exit(0);
  }
}, function (){
  console.log('join complete');
  client1.send('testSession', 'echo complete', true);

  var client2 = require('../index')(serverUrl, options);
  setStatusChangedLog(client2, 'client2');
  client2.send('testSession', 'send complete');
});


function setStatusChangedLog(client, name){
  client.onStatusChanged(function (status){
    console.log('[status] ' + name + ' - ' + status);
  });
}
