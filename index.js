var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 3000});

var clients = [];

wss.on('connection', function(ws) {
    clients.push(ws);

    ws.on('close', function (ws) {
      clients.splice(clients.indexOf(ws), 1);
    });
});

var dualShock = require('dualshock-controller');

var controller = dualShock({
  config : "dualShock3",
  accelerometerSmoothing : true,
  analogStickSmoothing : true
});

controller.connect();

// Joysticks
// =========
controller.on('left:move', function(data) {
  // if ((position.x > 130 || position.x < 120) || (position.y > 130 || position.y < 120)) {
    sendMessage('left.move', data);
  // };
});

// Motion
// ======
controller.on('rightLeft:motion', function(data) {
  sendMessage('rightLeft.motion', data);
});

controller.on('upDown:motion', function(data) {
  sendMessage('upDown.motion', data);
});

controller.on('forwardBackward:motion', function(data) {
  sendMessage('forwardBackward.motion', data);
});

// Buttons
// =======
controller.on('x:press', function() {
  sendMessage('x.press');
});

controller.on('x:release', function() {
  sendMessage('x.release');
});

function sendMessage (event, data) {
  var response = {
    event: event,
    data: data
  };

  for (var i = 0; i < clients.length; i += 1) {
    clients[i].send(JSON.stringify(response));
  }
}