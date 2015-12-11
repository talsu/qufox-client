
module.exports = function (url, option){
  return new require('./qufox-client').Qufox(url, require('socket.io-client'), option);
};
