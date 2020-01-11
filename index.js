// watch file change and  restart server.

const { spawn, execSync } = require('child_process');
// https://github.com/nodejs/node/issues/14556
// WTF: parent process Terminated, child still alive. but not trigger 'exit';
// kill pid
const watch = require('watch');

// _console style like nodemon.
// "chalk" is can't work in `tail -f` on my computer. So..
let _COLOR_MAP = {red: 31, 
  green: 32, // 避免跟 nodemon 冲突.
  yellow: 33, 
  cyan: 96};
function _colorLog(style, str) {
  console.info('\u001b[' + _COLOR_MAP[style] + 'm' + str + '\u001b[39m');
}

function watchHere({dir, name, run}){
  if(process.env.WATCHED_HERE_NAME === name){
    run();
    return;
  } else {

    function _getWatchedProcess(){
      let psCmdPre = "ps -aux | grep ";
      let result = execSync(psCmdPre + "'" + process.argv.join(' ') + "'");
      result = result.toString();
      result = result.trim();
      console.log('\n');
      console.log(result);
      console.log('\n');
      result = result.split(/\n|\r\n/);
      let line;
      let pidArr = [];
      for(let i = 0, len = result.length; i < len; i++){
        line = result[i].trim();
        if(line && line.indexOf(psCmdPre) === -1){
          line = line.split(/\s+/);
          const pid = line[1];
          if(process.pid.toString() !== pid){
            pidArr.push(pid)
          } else {
            return pidArr;
          }
        } else {
          return pidArr;
        }
      }
      return pidArr;
    }

    let watchedPids = _getWatchedProcess();
    watchedPids.forEach(pid => {
      _colorLog('green', '[watch-here]: Rewatch. kill process ' + pid);
      execSync('kill ' + pid);
    })

    // console.log(result)
    // result = result.split(/\s+/);
    // console.log('result')
    // console.log(result)
  }
  let child, 
  fileIsChange = false,
  isWaitFileChange = false;

  function _watch(dir){
    watch.watchTree(dir, {
      interval: 1, 
      ignoreDotFiles: true,
      ignoreDirectoryPattern: /node_modules/
    }, function(f){
      if(typeof f !== 'object'){
        // console.info('[Watch-Here]: file changed:', `'./${path.relative(dir, f)}'`);
        console.info('[Watch-Here]: file changed:', `'${f}'`);
        if(f === process.mainModule.filename){
          return; // 此文件
        }
        fileIsChange = true;
        child.kill();
      }
    });
  }
  function handleChildCrash(){
    console.log('handleChildCrash')
    if(fileIsChange){
      isWaitFileChange = false;
      _colorLog('cyan', `[${name}]: Restarting due to changes...`);
      loop();
      fileIsChange = false;
    } else {
      if(!isWaitFileChange){
        _colorLog('red', `[${name}]: Process is crash! wait for File Change to restart...`);
        isWaitFileChange = true;
      }
      // setTimeout(handleChildCrash, 1000);
    }
  }

  function loop(){
    child = spawn(process.argv[0], process.argv.slice(1), {
      cwd: __dirname,
      env: {
        ...process.env,
        WATCHED_HERE_NAME: name
      },
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      //  || s !== 'SIGTERM'
      if(code !== 0){
        handleChildCrash();
      }else{
        _colorLog('cyan', `[${name}]: Child exit success! Watcher exit. \t ${new Date()}`);
        process.exit(); // 正常退出
      }
    });
  }

  _watch(dir);
  _colorLog('cyan', `[watch-here]: Watching '${dir}'. pid: ` + process.pid);
  loop();
}

module.exports = watchHere;
