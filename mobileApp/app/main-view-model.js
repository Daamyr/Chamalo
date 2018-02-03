var SocketIO = require('nativescript-socket.io');
var Observable = require("data/observable").Observable;
var geolocation = require("nativescript-geolocation");

let socketio = null;

function connect() {
    console.log("Connection request");
    try {
      if (socketio != null) {
        console.log("not null");
        socketio.emit("forceDisconnect");
        socketio = null;
      }

      socketio = SocketIO.connect('http://138.197.172.107:8081');

    } catch (e) {
      console.log(e);
    } finally {
        
    }
}

exports.connect = connect;

function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function sendCoord(coords) {
    socketio.emit("test", {connection : coords});
}

function createViewModel() {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.onTapConnect = function() {
        connect();
    }

    viewModel.onTapSendMsg = function() {
        geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function (data){
            console.log(require('util').inspect(data, { depth: null }));
            let newData = {Latitude : data.latitude, Longitude : data.longitude, Speed : data.speed, Directon : data.directon, TimeStamp : data.timestamp};
            console.dir(newData);
            //sendCoord();
        });       
    }

    return viewModel;
}

exports.createViewModel = createViewModel;