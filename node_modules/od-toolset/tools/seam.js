var args = process.argv.slice(2);
var exec = require('child_process').exec;
dir = args[0] ?  args[0] : __dirname;

console.log("root dir: " + __dirname)
console.log("Compressing Dir:" + dir + "\n");
var child = exec('java -jar node_modules/od-toolset/tools/js.jar node_modules/od-toolset/tools/concat.js ' + dir,
  function (error, stdout, stderr){
    console.log('Output -> ' + stdout);
    if(error !== null){
      console.log("Error -> "+error);
    }
});
 
module.exports = child;