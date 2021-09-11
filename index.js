var express = require('express');
var socket = require('socket.io');
var firebase = require("firebase");
require("firebase/firestore");






var firebaseConfig = {
  apiKey: "AIzaSyDYWOkstaJjlQl3921ha4rlxn-okivM7Os",
  authDomain: "gremchess.firebaseapp.com",
  databaseURL: "https://gremchess-default-rtdb.firebaseio.com",
  projectId: "gremchess",
  storageBucket: "gremchess.appspot.com",
  messagingSenderId: "775453383771",
  appId: "1:775453383771:web:c4495af2fade87b4ac337e",
  measurementId: "G-L0B8RVDQ7D"
};


var app = express();

var server = app.listen(2045, function(){
    console.log("server listening on port 2045");
    
});

//serve static files here
app.use(express.static('.'));

//adding socket functionality
var io = socket(server);

//trying this here
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// server-side
io.on("connection", (socket) => {
    console.log("socket id :" + socket.id);
    //trying onChange instead of onSnapEnd
    socket.on("onChange", (arg1, arg2, callback) => {
      
      callback({
        status: "ok",
        oldBoardPosition: arg1,
        newBoardPosition: arg2
      });
      console.log("Old Board Position: " + arg1);
      console.log("New Board Position: " + arg2);

      var currentGame = db.collection("gameFenData").doc("currentGame");
      currentGame.get().then((data) => {
        if(data.exists){

          if(data == arg2){
            //you have the most recent position
          }else if(data == arg1){
  
            
        db.collection("gameFenData").doc("currentGame").set({
          FenStringData: arg2
      }).then(() => {
        console.log("set");
        
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
    
        }
       

        }


      });

     
    });
  });



  ///=====================================================================
