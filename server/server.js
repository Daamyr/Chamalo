const http = require('http');

const server = http.createServer();
server.listen(8081);

console.log('Server started');

const io = require('socket.io').listen(server);
let allClients = [];

io.sockets.on('connection',
  function (socket) {
    allClients.push(socket.id);
    console.log("Il y a "+allClients.length+" clients connectés");
    console.log("Client: " + socket.id);
    socket.emit('connectack', {connection: "Connected", content:"<h1>You: "+(socket.id).toString()+"</h1><h2>Others: "+allClients2str()+"</h2>"});

    socket.on('test',
      function(data) {
        console.log("Received: 'test' " + data.connection + " " + socket.id);
    });

    socket.on('forceDisconnect', function(){
      socket.disconnect();
    });

    socket.on('disconnect', function() {
      deleteMeFromAllClients(socket.id);
      socket.broadcast.emit('connectack', {connection: "Connected", content:"<h1>You: "+(socket.id).toString()+"</h1><h2>Others: "+allClients2str()+"</h2>"});
      console.log("Client has disconnected");
    });
  }
);

function allClients2str() {
  let str = "";
  for (client of allClients) {
    str += client + " | ";
  }
  return str
}

function deleteMeFromAllClients(id) {
  for (client of allClients) {
    if (client == id) {
        allClients.splice(allClients.indexOf(client), 1);
    }
  }
}
