# qufox-client
qufox javascript client.

## Installation

```bash
bower install qufox-client
```

## Usage

```html
<script src="bower_components/socket.io-client/socket.io.js"></script>
<script src="bower_components/qufox-client/qufox-client.js"></script>
<script>
  var qufox = new Qufox('https://talk.talsu.net');

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
