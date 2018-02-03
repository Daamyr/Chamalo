var SocketIO = require('nativescript-socket.io');
var Observable = require("data/observable").Observable;

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

function createViewModel() {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.onTapConnect = function() {
        connect();
    }

    return viewModel;
}

exports.createViewModel = createViewModel;