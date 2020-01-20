const watchHere = require('../index');
const createServer = require('./server');

watchHere({
  id: 'test',
  dir: __dirname,
  run(){
    createServer(9004);
  }
})

