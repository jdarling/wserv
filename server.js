#! /usr/bin/env node

var
    Liftoff = require('liftoff'),
    Server = new Liftoff({
      name: 'wserv',
      configName: 'wserv',
      addExtensions: ['.anything'],
      processTitle: 'wserv',
      cwdFlag: 'cwd',
      configPathFlag: 'config',
      preloadFlag: 'require'
    })
    path = require('path'),
    settings = require('commander'),
    connect = require('connect'),
    http = require('http'),
    server = connect()
    ;

var truncto = function(fn, len){
  var parts = fn.split(/[\\\/]/gi);
  var result = '';
  while(result.length<len && parts.length){
    result = path.sep + parts.pop() + result;
  }
  
  if(parts.length>1){
    result = parts.shift() + path.sep + '...' + result;
  }else if(parts.length==1){
    result = parts.shift() + result;
  }
  return result;
};
    
var startServer = function(env){
    var
      pjson = require(__dirname+'/package.json'),
      cjson = (function(){
        try{
          if(env.configPath){
            console.log('Loading config from: ', env.configPath);
            process.chdir(env.configBase);
            return require(env.configPath);
          }else{
            return {};
          }
        }catch(e){
          return {};
        }
      })(),
      defaults = pjson.defaults||{},
      webroot = path.resolve('./'),
      webport = cjson.port||pjson.port||8080
      ;

  if(cjson.name){
    process.title += ' - ' + cjson.name;
  }else if(env.configPath){
    process.title += ' - ' + truncto(env.configPath, 20);
  }else{
    process.title += ' - ' + truncto(path.resolve('./'), 20);
  }

  settings
    .version('v'+pjson.version, '-v, --version')
    .option('-p, --port <int>', 'Set port to serve on, default '+webport, parseInt)
    .option('-f, --folder <int>', 'Set directory to serve from, default '+webroot)
    .option('--config <file>', 'Force configuration file to use')
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
};

Server.launch(startServer);
