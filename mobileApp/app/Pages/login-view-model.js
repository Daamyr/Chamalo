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



function connect(vm) {
    console.log("Connection request");
    try {
      if (socketio != null) {
        console.log("not null");
        socketio.emit("forceDisconnect");
        socketio = null;
      }
      socketio = SocketIO.connect('http://138.197.172.107:8081?token=' + vm.token + '&id=1&username=' + vm.username);
      //socketio.emit("Id" , {Id : 1});
      socketio.on("connectack", function(){
        console.log("PASSED IN HERE COOL POUAIN EYSz");
         var navigationOptions={
            moduleName:'./Pages/main-page',
            context:{socket: socketio,
                token : vm.token
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
        //socketio.emit("Id" , {Id : 1});
      });

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
        connect(viewModel);
    }

    return viewModel;
}
exports.createViewModel = createViewModel;