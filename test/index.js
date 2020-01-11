const watchHere = require('../index');
const createServer = require('./server');
watchHere({
  dir: __dirname,
  name: 'test',
  run(){
    createServer(9004);
  }
})

