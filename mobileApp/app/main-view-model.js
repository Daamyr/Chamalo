var SocketIO = require('nativescript-socket.io');
var accelerometer = require("nativescript-accelerometer");
var Observable = require("data/observable").Observable;
var geolocation = require("nativescript-geolocation");
var timer = require("globals");
var youGood = require("ui/dialogs");

let socketio = null;

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

youGood.confirm({
    title: "Alert",
    message: "Are you alright? We noticed bizarre activity.",
    okButtonText: "I AM alright",
    cancelButtonText: "I am NOT alright",
}).then(function (result) {
    // result argument is boolean
        if(result == true){
            console.log("WE GOOD MATE");
        } else if(result == false){
            console.log("HELP ME IMMA DIE");
        }
    });

timer.id = setInterval(() => {
    if(phoneStatus == "notOkay"){
        console.log("FallCounter : " + fallCounter);
        if(fallCounter == fallTime){
            console.log("ARE YOU OKAY M8? IMMA CALL THE AMBULANCE IF NOT!");
            fallCounter = 0;
            notif = true;
        }else{
            fallCounter++;
        }
    }else if(notif == true && alreadyNotified == false){
        //console.log("NOTIFICATION IS POPPED");
        alreadyNotified = true;
        youGood.confirm({
            title: "Alert",
            message: "Are you alright? We noticed abnormal activity.",
            okButtonText: "I AM alright",
            cancelButtonText: "I am NOT alright",
        }).then(function (result) {
    // result argument is boolean
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
            youGood.result = false;
        } else{
            inactivityCounter++;
        }
    }
}, 1000);

function isInDanger(){
    console.log("HELP ME IMMA DIE");
    inactive = false;
    alreadyNotified = false;
    notif = false;
    inactive = true;
    inactivityCounter = 0;
    isDead = true; 
}

function connect() {
    console.log("Connection request");
    try {
      if (socketio != null) {
        console.log("not null");
        socketio.emit("forceDisconnect");
        socketio = null;
      }

      socketio = SocketIO.connect('http://138.197.172.107:8081?token=prod');
      socketio.emit("Id" , {Id : 1});
      socketio.on("reconnect", function(){
        socketio.emit("Id" , {Id : 1});
      });

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

function createViewModel() {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);

    viewModel.onTapConnect = function() {
        connect();
    }

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


    viewModel.onTapStopAccel = function() {
        stopAccel();
    }


    return viewModel;
}

exports.createViewModel = createViewModel;