var WebSocketServer = require("ws").Server;
var http = require("http");
var finalhandler = require("finalhandler");
var serveStatic = require("serve-static");
var uuid = require("node-uuid");

var port = process.env.PORT || 5000;

var serve = serveStatic('./', {'index': ['index.html']})
 
// Create server 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  serve(req, res, done)
});
 
// Listen 
server.listen(port);

var wss = new WebSocketServer({server: server});

var clients = {};

wss.on('connection', function(ws) {
  var clientId = uuid.v4();

  clients[clientId] = ws;

  console.log('connected', clientId);

  sendMessage('connected', {clientId: clientId});

  ws.on('close', function (ws) {
    console.log('disconnected', clientId);

    sendMessage('disconnected', {clientId: clientId});
    delete clients[clientId];
  });

  ws.on('message', function (data) {
    data = JSON.parse(data);

    if (data.clientType) {
      console.log('set '+clientId+' as '+data.clientType);
      clients[clientId].clientType = data.clientType;
    } else {
      sendMessage('motion', {value: data, clientId: clientId});
    }
  });
});

function sendMessage (event, data) {
  var response = {
    event: event,
    data: data
  };

  for (var clientId in clients) {
    if (clients[clientId].clientType === 'renderer') {
      clients[clientId].send(JSON.stringify(response));
    }
  }
}