/*
config.private.proxies
  from
  to
*/

var configstore = require('../lib/configstore');
var http = require('http');

var getForward = function(req, res, next){
  var path = req.params.id;
  configstore.getHostConfig(req, function(err, hostInfo){
    var route = false;
    var forward, i, l = (hostInfo.private.proxies||[]).length;
    for(i=0; i<l && !route; i++){
      forward = hostInfo.private.proxies[i];
      if(forward.from===path){
        route = forward;
      }
    }
    if(route){
      //res.jsonp(route);
      http.get(route.to+req.params[0], function(fres){
        fres.pause();
        res.writeHeader(fres.statusCode, fres.headers);
        fres.pipe(res);
        fres.resume();
      });
    }else{
      res.jsonp(404, {root: 'error', error: 'No forward route found for "'+path+'"'});
    }
  });
};

var Router = module.exports = function(server, config){
  server.get(config.route+'proxy/:id/*', getForward);
};
