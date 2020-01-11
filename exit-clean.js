


const childProcesses = [];
let isListened = false;
function exitClean(childProcess){
  if(childProcess){
    childProcesses.push(childProcess);
  }
  if(!isListened){
    isListened = true;
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
}
module.exports = exitClean;
