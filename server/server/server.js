const http = require('http');
const _ = require('lodash');

var store = require('json-fs-store')();
let dataStored;

function modifyObject(tokenToChange, keyToChange, value) {
  for (gestionnaire of dataStored) {
    if(gestionnaire.token == tokenToChange) {
      gestionnaire.keyToChange = value;
    }
  }

  store.add(dataStored, function(err) {
    // called when the file has been written
    // to the /path/to/storage/location/12345.json
    if (err) throw err; // err if the save failed
  });
}

store.add({token: "prod", name: "Paul"}, function(err) {
  // called when the file has been written
  // to the /path/to/storage/location/12345.json
  if (err) throw err; // err if the save failed
});

store.load("data", function(err, object){
  if(err) throw err; // err if JSON parsing failed

  // do something with object here

});

store.list(function(err, objects) {
  // err if there was trouble reading the file system
  if (err) throw err;
  // objects is an array of JS objects sorted by name, one per JSON file
  dataStored = objects;
  console.log(objects);
});

// modifyObject()

const server = http.createServer();
server.listen(8081);

console.log('Server started');

const io = require('socket.io').listen(server);
let gestionClients = [];
let mobileClients = [];


io.sockets.on('connection',
  function (socket) {
    let token = socket.handshake.query.token;
    socket.join(token);
    console.log(token);
    // console.log("Il y a "+allClients.length+" clients connectés");
    console.log("Client: " + socket.id);
    socket.emit('connectack', {connection: "Connected"});

    socket.on('Id',
      function(data) {
        console.log("Received: 'Id' " + data.Id + " " + socket.id);
        if (data.Id == 1) {
          console.log("Added");
          mobileClients.push({id: socket.id});
        } else {
          gestionClients.push({id: socket.id});
        }
    });

    socket.on('test',
      function(data) {
        console.log("Received: 'test' " + data.connection + " " + socket.id);
    });

    socket.on('app:coords',
      function(data) {
        let latitude = data.Latitude;
        let longitude = data.Longitude;
        let speed = data.Speed;
        let direction = data.Direction;
        let timestamp = data.TimeStamp;
        console.log("Received: 'test' " + latitude + " " + longitude + " " + speed + " " + direction + " " + timestamp + " " + socket.id);
    });

    socket.on('forceDisconnect', function(){
      socket.disconnect();
    });

    socket.on('disconnect', function() {
      deleteMeFromAllClients(socket.id);
      socket.broadcast.emit('connectack', {connection: "Someone Disconnected"});
      console.log("Client has disconnected");
    });

  }
);

// setInterval(sendCoord, 2500);
function sendCoord() {
  console.log("Sending Coords");
  // socket.broadcast.to(token).emit('mouse', data);

}

function allClients2str() {
  let str = "";
  for (client of allClients) {
    str += client + " | ";
  }
  return str
}

function deleteMeFromAllClients(id) {
  for (client of mobileClients) {
    if (client.id == id) {
      console.log("yes");
      // allClients.splice(allClients.indexOf(client), 1);
    }
  }
  for (client of gestionClients) {
    if (client.id == id) {
      console.log("oui");
      // allClients.splice(allClients.indexOf(client), 1);
    }
  }
}
