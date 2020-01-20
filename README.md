# watch-here
Watch file change and reload process.
# Feature
If repeat watch, It will kill old process and rewatch again.
# API
```js
const watchHere = require('watch-here');
watchHere({
  id: 'server', // String. Keep ID unique for different projects, otherwise it will cause confusion
  dir: __dirname, // Need watched directory. ignore node_modules and MainModule files.
  run(){
    // You server start.
  }
})
```
## Demo
https://github.com/hezedu/watch-here/tree/master/demo
