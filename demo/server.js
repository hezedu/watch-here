const http = require('http');
function createServer(port){
  const server = http.createServer(function(req, res){
    res.end('hello world!')
  })
  server.listen(port, function(){
    console.log('server.listen ' + port);
  })
}

module.exports = createServer;
