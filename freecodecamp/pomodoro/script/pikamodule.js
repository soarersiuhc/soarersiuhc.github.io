var Pika = function(){
  this.require = function(name){
    var code = new Function("exports", readFile(name));
    var exports = {};
    code(exports);
    return exports;
  }
}