const http = require('http');
function createServer(port){
  const server = http.createServer(function(req, res){
    res.end('hello world!')
  })
  server.listen(port, function(){
    console.log('server.listen ' + port);
  })
}
// (ps -C 'node' -aux) | grep '/usr/local/bin/node /mnt/common/git/linux-remote/server/dev.js'
// console.log(path.relative('C:/Users/dw/common/git/watch-here/test', 'C:/Users/dw/common/git/watch-here/test/server.js'))
console.log(process.argv.join(' '))
createServer(9003)
module.exports = createServer;
