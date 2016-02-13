
module.exports = function (url, option, connectedCallback){
  return new require('./qufox-client').Qufox(url, require('socket.io-client'), option, connectedCallback);
};
