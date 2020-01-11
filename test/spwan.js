const { spawn, execSync } = require('child_process');

const child = spawn(process.argv[0], ['./server'],{
  stdio: 'inherit',
  cwd: __dirname
})
child.on('close', function(code, signal){
  console.log('close', code, signal)
})
child.on('error', function(err){
  console.log('error', err)
})
setTimeout(function(){
  child.kill();
}, 1000)
return;
process.on('exit', function(){
  console.log('process exit');
  child.kill();
})
process.on('SIGINT', handle('SIGINT'));
process.on('SIGTERM', handle('SIGTERM'));
process.on('SIGHUP', handle('SIGHUP'));
function handle(signal) {
  return function(signal2){
    console.log(`Received ${signal} ${signal2} `);
    process.exit();
    setTimeout(function(){
      console.log('pid', process.pid)
    }, 100)
    // process.exit();
  }
  
}
console.log('pid', process.pid)
const childProcesses = [];
function exitClean(){

// use cmd 'kill ${pid}' not trigger 'exit'
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(k => {
    process.on(k, () => {
      process.exit();
    })
  })

  // WTF: parent process Terminated, child still alive.;
  // https://github.com/nodejs/node/issues/14556
  process.on('exit', function(){
    childProcesses.forEach(childProcess => {
      childProcess.kill();
    })
  })
}

// setTimeout(function(){
//   console.log('kill')
//   execSync('kill ' + process.pid)
// }, 1000)