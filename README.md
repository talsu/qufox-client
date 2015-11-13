# qufox-client

[![Bower version](https://badge.fury.io/bo/qufox-client.svg)](https://badge.fury.io/bo/qufox-client)

qufox javascript client.

## Installation

```bash
bower install qufox-client
```

## Usage

Create qufox instance with qufox server url.

Sample qufox server is running at http://qufox.com and https://talk.talsu.net

```html
<script src="bower_components/socket.io-client/socket.io.js"></script>
<script src="bower_components/qufox-client/qufox-client.js"></script>
<script>
  // Create qufox instance with qufox server url.
  var qufox = new Qufox('http://qufox.com');

  // Join session. (If session is not exist, auto create.)
  qufox.join('MySession', dataReceived, joinComplete);

  function dataReceived (data) {
    // Write on console.
    console.log(data);
  }

  function joinComplete (result) {
    // Send message on session.
    qufox.send('MySession', 'Hello world.', true);

    // Leave session.
    qufox.leave('MySession');
  }
</script>
```

## Server

qufox server code is in [qufox](https://github.com/talsu/qufox).
