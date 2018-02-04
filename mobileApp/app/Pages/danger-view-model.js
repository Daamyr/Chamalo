require("globals");
var frameModule =require("ui/frame");
var SocketIO = require('nativescript-socket.io');
var accelerometer = require("nativescript-accelerometer");
var Observable = require("data/observable").Observable;
var geolocation = require("nativescript-geolocation");
var application = require("application");
var timer = require("globals");
var timer2 = require("globals");
var dialogs = require("ui/dialogs");
var Vibrate = require("nativescript-vibrate").Vibrate;
var vibrator = new Vibrate();

let socketio = null;
let params;


var activity = application.android.startActivity ||
        application.android.foregroundActivity ||
        frameModule.topmost().android.currentActivity ||
        frameModule.topmost().android.activity;
var lastPress;

activity.onBackPressed = function() {
    var timeDelay = 500
    if (lastPress + timeDelay > java.lang.System.currentTimeMillis()) {
        var startMain = new android.content.Intent(android.content.Intent.ACTION_MAIN);
        startMain.addCategory(android.content.Intent.CATEGORY_HOME);
        startMain.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(startMain);

        // If you want to kill the app totally, use these codes instead of above
        // activity.finish();
        // java.lang.System.exit(0);

    } else {
        frameModule.topmost().goBack();
    }
    lastPress = java.lang.System.currentTimeMillis();
}

timer.id = setInterval(() => {
    geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function (data){
            //console.log(require('util').inspect(data, { depth: null }));
            let newData = {Latitude : data.latitude, 
                           Longitude : data.longitude, 
                           Speed : data.speed, 
                           Directon : data.directon, 
                           TimeStamp : data.timestamp};
            //console.dir(newData);
            sendCoord(newData);
        });       
}, 2500);

timer2.id = setInterval(() => {
    vibrator.vibrate(500);      
}, 1000);

function onNavigatingTo(args) {
    var page = args.object;
    params = page.navigatingContext;

    
    //console.dir(params);
    page.bindingContext = createViewModel();
    console.log("page-1 ==> navigatingTo");
}

function createViewModel(params) {
    var viewModel = new Observable();

    socketio = params.socket;

    viewModel.onTapSendMsg = function() {
        geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function (data){
            //console.log(require('util').inspect(data, { depth: null }));
            let newData = {Latitude : data.latitude, 
                           Longitude : data.longitude, 
                           Speed : data.speed, 
                           Directon : data.directon, 
                           TimeStamp : data.timestamp};
            //console.dir(newData);
            sendCoord(newData);
        });       
    }

    socketio.emit("app:danger" , {danger : true});

    return viewModel;
}
exports.createViewModel = createViewModel;