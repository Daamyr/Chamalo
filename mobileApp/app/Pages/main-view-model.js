require("globals");
var frameModule =require("ui/frame");
var SocketIO = require('nativescript-socket.io');
var accelerometer = require("nativescript-accelerometer");
var Observable = require("data/observable").Observable;
var geolocation = require("nativescript-geolocation");
var application = require("application");
var timer = require("globals");
var dialogs = require("ui/dialogs");
var Vibrate = require("nativescript-vibrate").Vibrate;
var vibrator = new Vibrate();

let socketio = null;
let params;

let firstPopup = null;
let d;

let isDead = false;
//.. Variables for fall
let phoneStatus = "ok";
let notif = false;
let fallCounter = 0;
let fallTime = 3;

//.. Variables for inactivity
let alreadyNotified = false;
let inactive = false;
let inactivityCounter = 0;
let inactivityMaxTime = 3;

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
    if(phoneStatus == "notOkay"){
        console.log("FallCounter : " + fallCounter);
        if(fallCounter == fallTime){
            console.log("ARE YOU OKAY M8? IMMA CALL THE AMBULANCE IF NOT!");
            vibrator.vibrate(2000);
            fallCounter = 0;
            notif = true;
        }else{
            fallCounter++;
        }
    }else if(notif == true && alreadyNotified == false){
        //console.log("NOTIFICATION IS POPPED");
        alreadyNotified = true;

        d = dialogs.confirm({
        title: "Alert",
        message: "Are you alright? We noticed abnormal activity.",
        okButtonText: "I AM alright",
        cancelButtonText: "I am NOT alright",
        }).then(function (result) {
            if(result == true){
                console.log("WE GOOD MATE");
                notif = false;
                alreadyNotified = false;
            } else if(result == false || inactive == true){
                isInDanger();
            }
        });

    }else{
        fallCounter = 0;
    }

    if(alreadyNotified == true){
        console.log("InactivityCounter : " + inactivityCounter)
        if(inactivityCounter == inactivityMaxTime){
            isInDanger();
            dialogs.result = false;
        } else{
            inactivityCounter++;
        }
    }
}, 1000);

function onNavigatingTo(args) {
    var page = args.object;
    params = page.navigatingContext;
    console.log("PARAMS : " + params.socket);
    
    //console.dir(params);
    page.bindingContext = createViewModel();
    console.log("page-1 ==> navigatingTo");
}

function isInDanger(){
    console.log("HELP ME IMMA DIE");
    vibrator.vibrate(2000);
    inactive = false;
    alreadyNotified = false;
    notif = false;
    inactive = true;
    inactivityCounter = 0;
    isDead = true;
}



function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function startAccel() {
  accelerometer.startAccelerometerUpdates(function(data) {
    //console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
    /*vm.set("gyrox", "X:" + (data.x).toString());
    vm.set("gyroy", "Y:" + (data.y).toString());
    vm.set("gyroz", "Z:" + (data.z).toString());*/
    //let SVM = Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2));
    //console.log(SVM);
    let thresh = 0.7;
    if(((data.x < -thresh || data.x > thresh) || (data.y >= -thresh & data.y <= thresh)) && notif == false && isDead == false){
        phoneStatus = "notOkay";
    } else{
        phoneStatus = "ok";
    }
  }, { sensorDelay: "normal" });
}

function stopAccel() {
  accelerometer.stopAccelerometerUpdates();
  //vm.set("message", "Accel Off");
}

function sendCoord(coords) {
    socketio.emit("app:coords", coords);
}

function createViewModel(params) {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    console.log("CONNEXTION SOCKET : ")
    console.dir(params.socket);
    socketio = params.socket;

    firstPopup = null;
    isDead = false;
    // Variables for fall
    phoneStatus = "ok";
    notif = false;
    fallCounter = 0;
    fallTime = 3;
    // Variables for inactivi
    alreadyNotified = false
    inactive = false;
    inactivityCounter = 0;
    inactivityMaxTime = 3;

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

    viewModel.onTapStartAccel = function() {
        startAccel();
    }

    viewModel.onTapLogout = function() {
        
    }

    viewModel.onTapStopAccel = function() {
        stopAccel();
    }

    return viewModel;
}
exports.createViewModel = createViewModel;