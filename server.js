#! /usr/bin/env node

var
    path = require('path'),
    settings = require('commander'),
    connect = require('connect'),
    http = require('http'),
    server = connect(),
    pjson = require(__dirname+'/package.json'),
    cjson = (function(){
      try{
        return require(path.resolve('./wserv.json'))
      }catch(e){
        return {};
      }
    })(),
    defaults = pjson.defaults||{},
    webroot = path.resolve('./'),
    webport = cjson.port||pjson.port||8080
    ;

settings
  .version('v'+pjson.version, '-v, --version')
  .option('-p, --port <int>', 'Set port to serve on, default '+webport, parseInt)
  .option('-f, --folder <int>', 'Set directory to serve from, default '+webroot)
  ;

settings.unknownOption = (function(){
  var cb = settings.unknownOption;
  return function(opt){
    switch(opt){
      case('-H'):
      case('-?'):
        settings.help();
        break;
      default:
        settings.outputHelp();
        cb(opt);
    }
  };
})();

settings.parse(process.argv);

if(settings.port && !isNaN(settings.port)){
  webport = settings.port
}

if(settings.folder){
  webroot = path.resolve('./', settings.folder);
}

server
  .use(connect.favicon())
  .use(connect.directory(webroot))
  .use(connect.static(webroot))
  .use(connect.logger('dev'))
  ;

http
  .createServer(server)
  .listen(webport, function(){
    console.log('Server running on port '+webport);
    console.log('Serving content from '+webroot);
  })
  ;
