require("globals");
var SocketIO = require('nativescript-socket.io');
var Observable = require("data/observable").Observable;
var application = require("application");
var frameModule =require("ui/frame");

let socketio = null;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = createViewModel();
    console.log("page-1 ==> navigatingTo");
}



function connect(user, token) {
    console.log("Connection request");
    try {
      if (socketio != null) {
        console.log("not null");
        socketio.emit("forceDisconnect");
        socketio = null;
      }
      socketio = SocketIO.connect('http://138.197.172.107:8081?token=' + token + '&id=1&username=' + user);
      //socketio.emit("Id" , {Id : 1});
      /*socketio.on("reconnect", function(){
        socketio.emit("Id" , {Id : 1});
      });*/

    } catch (e) {
      console.log(e);
    } finally {
        
    }
}

exports.connect = connect;

function createViewModel() {
    var viewModel = new Observable();
    viewModel.message = "Welcome";

    viewModel.onTap  = function() {
        //console.log(viewModel.username)
        connect(viewModel.username, viewModel.token);
        var navigationOptions={
            moduleName:'./Pages/main-page',
            context:{socket: socketio,
                token : viewModel.token
                },
            animated: true,
            transition: {
                name: "slide",
                duration: 380,
                curve: "easeIn"
            },
            clearHistory: true
        }
        frameModule.topmost().navigate(navigationOptions);
    }

    return viewModel;
}
exports.createViewModel = createViewModel;