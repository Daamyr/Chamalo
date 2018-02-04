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
        title: "Alerte",
        message: "Nous avons détecté des comportements anormaux. Ètes-vous en sécurité? ",
        okButtonText: "Oui",
        cancelButtonText: "Non",
        }).then(function (result) {
            if(result == true){
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

timer2.id = setInterval(() => {
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

function onNavigatingTo(args) {
    var page = args.object;
    params = page.navigatingContext;

    
    //console.dir(params);
    page.bindingContext = createViewModel();
    console.log("page-1 ==> navigatingTo");
}

function isInDanger(){
    stopAccel();
    inactive = false;
    alreadyNotified = false;
    notif = false;
    inactive = true;
    inactivityCounter = 0;
    isDead = true;

    //timer.clearInterval();
    //timer2.clearInterval();

    console.log("Hello");
    var navigationOptions={
        moduleName:'./Pages/danger-page',
        context:{socket: socketio
           
            },
        animated: true,
        transition: {
            name: "slideRight",
            duration: 380,
            curve: "easeIn"
        },
        clearHistory: true
    }
    frameModule.topmost().navigate(navigationOptions);
}

function startAccel() {
    try {
        accelerometer.startAccelerometerUpdates(function(data) {
        let thresh = 0.9;
        if(((data.x < -thresh || data.x > thresh) || (data.y >= -thresh & data.y <= thresh)) && notif == false && isDead == false){
            phoneStatus = "notOkay";
        } else{
            phoneStatus = "ok";
        }
        }, { sensorDelay: "normal" });
    }
    catch(error) {
        console.log(error);
    }
}

function stopAccel() {
    try{
        accelerometer.stopAccelerometerUpdates();
    }
    catch(error){
        console.log(error);
    }
}

function sendCoord(coords) {
    socketio.emit("app:coords", coords);
}

function createViewModel(params) {
    var viewModel = new Observable();

    socketio = params.socket;

    console.log(params.token);

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

    startAccel();

    viewModel.onNavBtnTap = function() {
        dialogs.prompt({
        title: "Attention",
        message: "Entrez votre clé secrète pour vous déconecter",
        okButtonText: "Entrer",
        cancelButtonText: "Annuler",
        inputType: dialogs.inputType.password
        }).then(function (r) {
            if(r.result == true && r.text == params.token){
                stopAccel();
                socketio.emit("forceDisconnect");
                var navigationOptions={
                    moduleName:'./Pages/login-page',
                    context:{socket: socketio,
                        token : viewModel.token
                        },
                    animated: true,
                    transition: {
                        name: "slideRight",
                        duration: 380,
                        curve: "easeIn"
                    },
                    clearHistory: true
                }
                frameModule.topmost().navigate(navigationOptions);
            } else if(r.result == true && r.text != params.token){
                dialogs.alert({
                title: "Message",
                message: "La clé secrète est incorrecte",
                okButtonText: "Réessayer"
                }).then(function () {});
            } else{
                console.log("closed");
            }
        });
    }
    return viewModel;
}
exports.createViewModel = createViewModel;