var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 3000});

var clients = [];

wss.on('connection', function(ws) {
  clients.push(ws);

  ws.on('close', function (ws) {
    clients.splice(clients.indexOf(ws), 1);
  });

  ws.on('message', function incoming(data) {
    var rotation = JSON.parse(data);

    sendMessage('rightLeft.motion', {value: rotation.y});
    sendMessage('upDown.motion', {value: rotation.x});
  });
});


var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
 
// Serve up public/ftp folder 
var serve = serveStatic('./', {'index': ['index.html']})
 
// Create server 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  serve(req, res, done)
})
 
// Listen 
server.listen(process.env.PORT || 8000);

// var dualShock = require('dualshock-controller');

// var controller = dualShock({
//   config : "dualShock3",
//   accelerometerSmoothing : true,
//   analogStickSmoothing : true
// });

// controller.connect();

// // Joysticks
// // =========
// controller.on('left:move', function(data) {
//   // if ((position.x > 130 || position.x < 120) || (position.y > 130 || position.y < 120)) {
//     sendMessage('left.move', data);
//   // };
// });

// // Motion
// // ======
// // roll
// controller.on('rightLeft:motion', function(data) {
//   // console.log('rightLeft', data);
//   sendMessage('rightLeft.motion', data);
// });

// controller.on('upDown:motion', function(data) {
//   // console.log('upDown', data);
//   sendMessage('upDown.motion', data);
// });

// // pitch
// controller.on('forwardBackward:motion', function(data) {
//   // console.log('forwardBackward', data);
//   // sendMessage('forwardBackward.motion', data);
// });

// // Buttons
// // =======
// controller.on('x:press', function() {
//   sendMessage('x.press');
// });

// controller.on('x:release', function() {
//   sendMessage('x.release');
// });

function sendMessage (event, data) {
  var response = {
    event: event,
    data: data
  };

  // for (var i = 0; i < clients.length; i += 1) {
    clients[0].send(JSON.stringify(response));
  // }
}