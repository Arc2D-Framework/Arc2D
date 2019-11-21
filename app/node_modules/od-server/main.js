var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
path = require("path");
var os = require('os');
var port = process.argv[2];
var zlib = require('zlib');

var certOptions = {
    // key: fs.readFileSync(__dirname+"/../.." + '/ssl/server.key'),
    // cert: fs.readFileSync(__dirname+"/../.." + '/ssl/server.crt')
}

mimetypes = {
    "css" : "text/css",
    "html": "text/html",
    "ico" : "image/ico",
    "jpg" : "image/jpeg",
    "js"  : "text/javascript",
    "json": "application/json",
    "png" : "image/png",
    "mjs" : "text/javascript"
};

http.createServer(certOptions,function(request, response){
  var pathName= url.parse(request.url).pathname;
  if (pathName == "" || pathName == "/") {
    request.url = "/index.html";
  }

  pathName = url.parse(request.url).pathname;
  var fp = __dirname+"/../.."+pathName;
  


  var readStream = fs.createReadStream(fp);
  readStream.on('open', function (res) {
    response.writeHead(200, { 'content-encoding': 'gzip' });
    readStream.pipe(zlib.createGzip()).pipe(response);
  });

  readStream.on('error', function(err) {
    response.writeHead(404, {'Content-type':'text/plan'});
    response.write('Page Was Not Found');
    response.end();
  });
}).listen(port);

/* WITHOUT GZIP
http.createServer(certOptions,function(request, response){
    if (request.url == "" || request.url == "/") {
        request.url = "index.html";
    }

   pathName = url.parse(request.url).pathname;
   var fp = __dirname+"/../.."+pathName;
   var mime="";
   if(pathName.indexOf(".mjs") >=0||pathName.indexOf(".js") >=0){
       mime = "text/javascript"
   } else {
       mime = ""
   }
   fs.readFile(fp, function(err, data){
       console.log("request for:", fp)
      if(err){
        response.writeHead(404, {'Content-type':'text/plan'});
        response.write('Page Was Not Found');
        response.end();
       } else {
        // response.writeHead(200,{'Content-type':mime});
        var mType = mimetypes[path.extname(request.url).split(".")[1]];
        // console.log("mimetype",mimetypes[path.extname(request.url).split(".")[1]]||"")
        response.writeHead(200, {'Content-Type':mType||""});
        response.write(data);
        response.end();
       }
   })
}).listen(port);*/


console.log("Server Running, Port: " + port);

try{//log IPv4 address, can be accessed from phone/tablet for testing only.
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }


  if(addresses && addresses.length > 0){
    console.log("\x1b[32m%s\x1b[0m", "IPv4: \t\thttp://" + addresses[0] + ":" + port + "/");
  }
} catch(e){}

console.log("\x1b[32m%s\x1b[0m", "Localhost: \thttp://localhost:" + port + "/");

// console.log("__dirname",path("../../"+__dirname))
