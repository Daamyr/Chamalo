const http = require('http');
const _ = require('lodash');


var store = require('json-fs-store')();

// store.add({id: "data", content: [{token: "prod", name: "Paul", username: "user", password: "pass"}]}, function(err) {
//   // called when the file has been written
//   // to the /path/to/storage/location/12345.json
//   if (err) throw err; // err if the save failed
// });

store.load("data", function(err, object){
  if(err) throw err; // err if JSON parsing failed

  // do something with object here

});

store.list(function(err, objects) {
  // err if there was trouble reading the file system
  if (err) throw err;
  // objects is an array of JS objects sorted by name, one per JSON file
  console.log(objects);
});


function modifyObject(tokenToChange, keyToChange, value) {
  store.list(function(err, objects) {
    // err if there was trouble reading the file system
    if (err) throw err;
    // objects is an array of JS objects sorted by name, one per JSON file
    let content = objects[0].content;
    for (gestionnaire of content) {
      if(gestionnaire.token == tokenToChange) {
        console.log("yes");
        gestionnaire[keyToChange] = value;
      }
    }

    console.log(objects[0].content[0].name);

    store.remove('data', function(err) {});

    store.add(objects[0], function(err) {
      // called when the file has been written
      // to the /path/to/storage/location/12345.json
      if (err) throw err; // err if the save failed
    });
  });
}

// modifyObject("prod", "name", "Paul");

const server = http.createServer();
server.listen(8081);

console.log('Server started');

const io = require('socket.io').listen(server);
let gestionClients = [];
let mobileClients = [];

function verifyUserConnectRequest(token, username, password, socket) {
  store.list(function(err, objects) {
    // err if there was trouble reading the file system
    if (err) throw err;
    // objects is an array of JS objects sorted by name, one per JSON file
    console.log(objects);
    let content = objects[0].content;
    for (gestionnaire of content) {
      if(gestionnaire.token == token) {
        console.log("Check");
        if (gestionnaire.username === username && gestionnaire.password === password) {
          console.log("Added as gestion");
          socket.emit('connectack', {connection: "Connected"});
          gestionClients = [{id: socket}];
          console.log("Gestion connected");
          console.log("Client: " + socket.id);
        } else {
          socket.disconnect();
        }
      }
    }
  });
}

io.sockets.on('connection',
  function (socket) {
    let token = socket.handshake.query.token;
    let username = socket.handshake.query.username;
    let password = socket.handshake.query.password;
    let id = socket.handshake.query.id;
    if (id == 1) {
      console.log("Added as mobile");
      mobileClients.push({id: socket.id, name: username, token: token});
      socket.emit('connectack', {connection: "Connected"});
      console.log("Mobile connected");
      console.log("Client: " + socket.id);
    } else {
      verifyUserConnectRequest(token, username, password, socket);
    }
    socket.join(token);
    console.log(token + " | " + username + " | " + password + " | " + id);
    // console.log("Il y a "+allClients.length+" clients connectés");



    socket.on('test',
      function(data) {
        console.log("Received: 'test' " + data.connection + " " + socket.id);
    });

    socket.on('app:coords',
      function(data) {
        for (mobile of mobileClients) {
          if (mobile.id == socket.id) {
            mobile.coords = {};
            mobile.coords.lat = data.Latitude
            mobile.coords.lng = data.Longitude
            mobile.speed = data.Speed;
            mobile.direction = data.Direction;
            mobile.timestamp = data.TimeStamp;
            console.log("Received: 'test' " + mobile.coords.lat + " " + mobile.coords.lng + " " + mobile.speed + " " + mobile.direction + " " + mobile.timestamp + " " + socket.id);
          }
        }
        gestionClients[0].id.emit('gestion:coords', mobileClients);
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

// setInterval(sendCoord, 5000);

// function sendCoord() {
//   gestionClients[0];
//   console.log("Sending stuff");
//   for (client of gestionClients) {
//     for (mobile of mobileClients) {
//       if (mobile.token != client.token) {
//         delete mobile;
//       }
//     }
//     // io.to('prod').emit('gestion:coords', mobileClients);
//   }
//   gestionClients[0].id.emit('gestion:coords', mobileClients);
// }

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
      let lat = client.coords.lat;
      let lng = client.coords.lng;

      client.coords.lat = lng;
      client.coords.lng = lat;
      gestionClients[0].id.emit('gestion:coords', mobileClients);
      // allClients.splice(allClients.indexOf(client), 1);
    }
  }
  for (client of gestionClients) {
    if (client.id == id) {
      delete client;
      console.log("oui");
      // allClients.splice(allClients.indexOf(client), 1);
    }
  }
}
