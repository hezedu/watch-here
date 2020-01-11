const http = require('http');
function createServer(port){
  const server = http.createServer(function(req, res){
    res.end('hello world!')
  })
  server.listen(port, function(){
    console.log('server.listen ' + port);
  })
}

// console.log(path.relative('C:/Users/dw/common/git/watch-here/test', 'C:/Users/dw/common/git/watch-here/test/server.js'))
module.exports = createServer;
