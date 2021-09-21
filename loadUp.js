loadUpGame = function(){
//the below variables are used to indicate which type of game the player is getting matched up for based on
//the quantity of btc/eth put in.

//var freeWaitList = db.collection("Queue").doc("waitList");

// var smallWaitList = db.collection("Queue").doc("waitListSmallBet");

// var medWaitList = db.collection("Queue").doc("waitListMedBet");

// var bigWaitList = db.collection("Queue").doc("waitListLargeBet");

var gameValue = document.getElementById("poolSelect");


//Now we check that the user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
//free bet
if(gameValue.value == 0){
    //we determined that the player is playing a free game, so we look at the free game wait list:
    // Set display name to a variable
            var dname = user.displayName;
            
            //make a unique user ID for the game queue:
            var newWaiter = db.collection("freeWaitList").doc(dname);
            
                 newWaiter.set({dname});
               
                //okay cool, we added ourselves to the waiting array for free games.
                //now we have to listen for a change in the array to match up users
                db.collection('freeWaitList').get().then(snap => {
                    console.log(snap);
                    var snapData = snap.docs;
                    console.log(snapData);

                    //variable to keep chess game data for updating db during games:
                    var chessGameArr = [];

                    chessGameArr.makeChess = function(){
                        
                        var playerOne = chessGameArr[0];
                        var playerTwo = chessGameArr[1];

                        if(chessGameArr.length > 1){
                            console.log(playerOne, playerTwo);
                            var mehBool = (Math.random() * 2);
                            if(mehBool >= 1){
                                var whitePlyr = playerOne;
                                var blackPlyr = playerTwo;
                                console.log(mehBool, blackPlyr, whitePlyr);
                                
                            }
                            else if(mehBool < 1){
                                var whitePlyr = playerTwo;
                                var blackPlyr = playerOne;
                                console.log(mehBool, blackPlyr, whitePlyr);
                                

                            }
                            //Great, we have our two players. Now we can delete them from the queue, after creating
                            //a chess game between the two players

                            var Ref = db.collection("chessGame").doc();
                            var referencePath = Ref.path;
                            var subStringRef = referencePath.substring(10, referencePath.length);
                            var gameId = subStringRef;
                            var gameValue = document.getElementById("poolSelect");

                            Ref.set({
                                blackPlayer: blackPlyr,
                                whitePlayer: whitePlyr,
                                fenStringData:"rnbqkbnr/​pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                                gameId:gameId,
                                oldPos: "",
                                source: "",
                                isLoser:"",
                                isWinner:"",
                                lastMove: null,
                                lastBlackMove: "",
                                lastBlackMoveSrc: "",
                                lastWhiteMove:"",
                                lastWhiteMoveSrc:"",
                                turn:"w",
                                gameOver: false,
                                gameValue: gameValue.value,
                                time: 1800
                            }).then(function() {
                                
                                //Here we access the collection freeWaitList and remove both players:
                                //this deletion triggers a call for the other player, so the game can start
                                
                                console.log("====================");
                                console.log(blackPlyr, whitePlyr);
                               

                                db.collection("freeWaitList").get().then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        doc.ref.delete();
                                     });


                                     if(blackPlyr == user.displayName){
                                        
                                        startBlackPlayerChessGame();

                                    }else if(whitePlyr == user.displayName){
                                        
                                        startWhitePlayerChessGame();

                                    }

                                });
                               
                              });

                        }else{
                            console.log("not enough players to make a game yet");
                        }
                        
                    };
                    
                    for(var i = 0; i< snapData.length; i++){
                        
                        var tempVar = snapData[i];
                        //The below line gets the dname and value from firebase for each person in the freeWaitList collection
                        var varTest = tempVar._delegate._document.data.partialValue.mapValue.fields;
                        console.log(varTest);
                        var playerPreName = varTest.dname.stringValue;
                        console.log(playerPreName);
                        chessGameArr.push(playerPreName);
                        chessGameArr.makeChess();
                        //We add players here to our ChessGameArray, so that in the next step, if the size of the snap is 2,
                        //We can remove those players from the database dynamically, and add them into an instanced chess game.
                        
                    }

                    if(snap.size == 2){
                        //we know that we have two players which can be turned into a chess game!
                       //and we can start the game:
                       // alert("just btw the snap size was 2");
                       console.log(chessGameArr);

                    } 
                    else if(snap.size == 1){
                        //add event listener to chessGame database, so we know when the game is initialized.
                        //we have to get a snapshot of the chessGame collection, iterate through each document, and 
                        //find the one where blackPlayer = user.displayName or whitePlayer = user.displayName
                        

                        //here since we're the first, we're adding a snapshot to run a function when our collection gets
                        //deleted, which happens when player2 joins the queue
                        var miName = user.displayName;
                        db.collection("freeWaitList").doc(miName)
                        .onSnapshot((dataW)=>{
                            if (dataW.exists){
                            //cant start game yet
                            console.log(dataW);
                            var storage = dataW._delegate._document.data.partialValue.mapValue.fields;
                            console.log(storage);
                            
                            }else{
                                
                                //Once the data no longer exists, that means a chess game was created:
                                db.collection("chessGame").get().then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        var blkCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.blackPlayer;
                                        var whiteCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.whitePlayer;
                                        console.log(blkCPlayer, whiteCPlayer);
                                        var userCompare = blkCPlayer.stringValue;
                                        var userCompareW = whiteCPlayer.stringValue;
                                        
                                        if(user.displayName == userCompare){

                                            alert("success - playing black");

                                            try{
                                                var stakInt = document.getElementById("stakingInterface");
                                                stakInt.style = "display: none;";
                                                startBlackPlayerChessGame();
                                            }catch(ex){
                                                console.log(ex);
                                            }
                                            
                                            
                                        }else if(user.displayName == userCompareW){
                                            alert("success - playing white");
                                            try{
                                                startWhitePlayerChessGame();
                                            }catch(ex){
                                                console.log(ex);
                                            }
                                        }
                                     });
                                });
                            }
                            
                        });
                    }
                  });
    }






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//small bet
else if(gameValue.value == "0x367984e77a000"){
    
    var kqftf = document.getElementById("1a2g6jhh");
    var aibasd = document.getElementById("ia2g6jph");
    var underBelly = document.getElementById("ra2g44hh");
    var not12g6jhh3 = document.getElementById("12g6jhh3");
    var confArr = [kqftf, aibasd, underBelly, not12g6jhh3];
    
    //to annoy people that try to delete the disabled element without paying
    if(kqftf.innerText !== "1"){
        alert("cmon man not cool");
        if(confArr[0].innerText == "\n              " || confArr[0].innerText == null){
            if(confArr[1].innerText == "\n              " || confArr[1].innerText == null){
                if(confArr[2].innerText == "\n              " || confArr[2].innerText == null){
                    if(confArr[3].innerText == "\n              " || confArr[3].innerText == null){
                        firebase.auth().signOut().then(() => {
                            alert("Stop messing with the code. Data sent to server for investigation.");
                            var dokBod = document.getElementById("page-top");
                            dokBod.style="display: none;";
                            for(var jj = 0; jj<= 200; jj++){
                                alert("Stealing is wrong");
                            }
                          }).catch((error) => {
                            console.log(error);
                        });
                    }
                    return;
                }
                return;
            }
            return;
        }
        return;
    }
    
    //actual validation
    var checkDB = db.collection("Vdation").doc(confArr[3].innerText);
    checkDB.get().then((data)=>{
    var dat = data.data();
    var ub = dat.underBelly;
    var kf = dat.kqftf;
    var ab = dat.aibasd;
    if(kf !== "0x367984e77a000"){
        alert(kf, ub, ab);
        return;
    }
    else{
        alert("KF is the correct value: test succesful")
    }


   });
    
    
    // Set display name to a variable
    var dname = user.displayName;
            
    //make a unique user ID for the game queue:
    var newWaiter = db.collection("smallWaitList").doc(dname);
    
         newWaiter.set({dname});
       
        //okay cool, we added ourselves to the waiting array for free games.
        //now we have to listen for a change in the array to match up users
        db.collection('smallWaitList').get().then(snap => {
            console.log(snap);
            var snapData = snap.docs;
            console.log(snapData);

            //variable to keep chess game data for updating db during games:
            var chessGameArr = [];

            chessGameArr.makeChess = function(){
                
                var playerOne = chessGameArr[0];
                var playerTwo = chessGameArr[1];

                if(chessGameArr.length > 1){
                    console.log(playerOne, playerTwo);
                    var mehBool = (Math.random() * 2);
                    if(mehBool >= 1){
                        var whitePlyr = playerOne;
                        var blackPlyr = playerTwo;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        
                    }
                    else if(mehBool < 1){
                        var whitePlyr = playerTwo;
                        var blackPlyr = playerOne;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        

                    }
                    //Great, we have our two players. Now we can delete them from the queue, after creating
                    //a chess game between the two players

                    var Ref = db.collection("chessGame").doc();
                    var referencePath = Ref.path;
                    var subStringRef = referencePath.substring(10, referencePath.length);
                    var gameId = subStringRef;
                    var gameValue = document.getElementById("poolSelect");

                    Ref.set({
                        blackPlayer: blackPlyr,
                        whitePlayer: whitePlyr,
                        fenStringData:"rnbqkbnr/​pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                        gameId:gameId,
                        oldPos: "",
                        source: "",
                        isLoser:"",
                        isWinner:"",
                        lastMove: null,
                        lastBlackMove: "",
                        lastBlackMoveSrc: "",
                        lastWhiteMove:"",
                        lastWhiteMoveSrc:"",
                        turn:"w",
                        gameOver: false,
                        gameValue: gameValue.value,
                        time: 1800
                    }).then(function() {
                        
                        //Here we access the collection freeWaitList and remove both players:
                        //this deletion triggers a call for the other player, so the game can start
                        
                        console.log("====================");
                        console.log(blackPlyr, whitePlyr);
                       

                        db.collection("smallWaitList").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                doc.ref.delete();
                             });


                             if(blackPlyr == user.displayName){
                                
                                startBlackPlayerChessGame();

                            }else if(whitePlyr == user.displayName){
                                
                                startWhitePlayerChessGame();

                            }

                        });
                       
                      });

                }else{
                    console.log("not enough players to make a game yet");
                }
                
            };
            
            for(var i = 0; i< snapData.length; i++){
                
                var tempVar = snapData[i];
                //The below line gets the dname and value from firebase for each person in the freeWaitList collection
                var varTest = tempVar._delegate._document.data.partialValue.mapValue.fields;
                console.log(varTest);
                var playerPreName = varTest.dname.stringValue;
                console.log(playerPreName);
                chessGameArr.push(playerPreName);
                chessGameArr.makeChess();
                //We add players here to our ChessGameArray, so that in the next step, if the size of the snap is 2,
                //We can remove those players from the database dynamically, and add them into an instanced chess game.
                
            }

            if(snap.size == 2){
                //we know that we have two players which can be turned into a chess game!
               //and we can start the game:
               // alert("just btw the snap size was 2");
               console.log(chessGameArr);

            } 
            else if(snap.size == 1){
                //add event listener to chessGame database, so we know when the game is initialized.
                //we have to get a snapshot of the chessGame collection, iterate through each document, and 
                //find the one where blackPlayer = user.displayName or whitePlayer = user.displayName
                

                //here since we're the first, we're adding a snapshot to run a function when our collection gets
                //deleted, which happens when player2 joins the queue
                var miName = user.displayName;
                db.collection("smallWaitList").doc(miName)
                .onSnapshot((dataW)=>{
                    if (dataW.exists){
                    //cant start game yet
                    console.log(dataW);
                    var storage = dataW._delegate._document.data.partialValue.mapValue.fields;
                    console.log(storage);
                    
                    }else{
                        
                        //Once the data no longer exists, that means a chess game was created:
                        db.collection("chessGame").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                var blkCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.blackPlayer;
                                var whiteCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.whitePlayer;
                                console.log(blkCPlayer, whiteCPlayer);
                                var userCompare = blkCPlayer.stringValue;
                                var userCompareW = whiteCPlayer.stringValue;

                                if(user.displayName == userCompare){
                                    alert("success - playing black");
                                    try{
                                        var stakInt = document.getElementById("stakingInterface");
                                        stakInt.style = "display: none;";
                                        startBlackPlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                    
                                    
                                }else if(user.displayName == userCompareW){
                                    alert("success - playing white");
                                    try{
                                        startWhitePlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                }
                             });
                        });
                    }
                    
                });
            }
          });
    
}
//medium bet
else if(gameValue.value == "0x467984e77a000"){

    // Set display name to a variable
    var dname = user.displayName;
            
    //make a unique user ID for the game queue:
    var newWaiter = db.collection("medWaitList").doc(dname);
    
         newWaiter.set({dname});
       
        //okay cool, we added ourselves to the waiting array for free games.
        //now we have to listen for a change in the array to match up users
        db.collection('medWaitList').get().then(snap => {
            console.log(snap);
            var snapData = snap.docs;
            console.log(snapData);

            //variable to keep chess game data for updating db during games:
            var chessGameArr = [];

            chessGameArr.makeChess = function(){
                
                var playerOne = chessGameArr[0];
                var playerTwo = chessGameArr[1];

                if(chessGameArr.length > 1){
                    console.log(playerOne, playerTwo);
                    var mehBool = (Math.random() * 2);
                    if(mehBool >= 1){
                        var whitePlyr = playerOne;
                        var blackPlyr = playerTwo;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        
                    }
                    else if(mehBool < 1){
                        var whitePlyr = playerTwo;
                        var blackPlyr = playerOne;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        

                    }
                    //Great, we have our two players. Now we can delete them from the queue, after creating
                    //a chess game between the two players

                    var Ref = db.collection("chessGame").doc();
                    var referencePath = Ref.path;
                    var subStringRef = referencePath.substring(10, referencePath.length);
                    var gameId = subStringRef;
                    var gameValue = document.getElementById("poolSelect");

                    Ref.set({
                        blackPlayer: blackPlyr,
                        whitePlayer: whitePlyr,
                        fenStringData:"rnbqkbnr/​pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                        gameId:gameId,
                        oldPos: "",
                        source: "",
                        isLoser:"",
                        isWinner:"",
                        lastMove: null,
                        lastBlackMove: "",
                        lastBlackMoveSrc: "",
                        lastWhiteMove:"",
                        lastWhiteMoveSrc:"",
                        turn:"w",
                        gameOver: false,
                        gameValue: gameValue.value,
                        time: 1800
                    }).then(function() {
                        
                        //Here we access the collection freeWaitList and remove both players:
                        //this deletion triggers a call for the other player, so the game can start
                        
                        console.log("====================");
                        console.log(blackPlyr, whitePlyr);
                       

                        db.collection("medWaitList").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                doc.ref.delete();
                             });


                             if(blackPlyr == user.displayName){
                                
                                startBlackPlayerChessGame();

                            }else if(whitePlyr == user.displayName){
                                
                                startWhitePlayerChessGame();

                            }

                        });
                       
                      });

                }else{
                    console.log("not enough players to make a game yet");
                }
                
            };
            
            for(var i = 0; i< snapData.length; i++){
                
                var tempVar = snapData[i];
                //The below line gets the dname and value from firebase for each person in the freeWaitList collection
                var varTest = tempVar._delegate._document.data.partialValue.mapValue.fields;
                console.log(varTest);
                var playerPreName = varTest.dname.stringValue;
                console.log(playerPreName);
                chessGameArr.push(playerPreName);
                chessGameArr.makeChess();
                //We add players here to our ChessGameArray, so that in the next step, if the size of the snap is 2,
                //We can remove those players from the database dynamically, and add them into an instanced chess game.
                
            }

            if(snap.size == 2){
                //we know that we have two players which can be turned into a chess game!
               //and we can start the game:
               // alert("just btw the snap size was 2");
               console.log(chessGameArr);

            } 
            else if(snap.size == 1){
                //add event listener to chessGame database, so we know when the game is initialized.
                //we have to get a snapshot of the chessGame collection, iterate through each document, and 
                //find the one where blackPlayer = user.displayName or whitePlayer = user.displayName
                

                //here since we're the first, we're adding a snapshot to run a function when our collection gets
                //deleted, which happens when player2 joins the queue
                var miName = user.displayName;
                db.collection("medWaitList").doc(miName)
                .onSnapshot((dataW)=>{
                    if (dataW.exists){
                    //cant start game yet
                    console.log(dataW);
                    var storage = dataW._delegate._document.data.partialValue.mapValue.fields;
                    console.log(storage);
                    
                    }else{
                        
                        //Once the data no longer exists, that means a chess game was created:
                        db.collection("chessGame").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                var blkCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.blackPlayer;
                                var whiteCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.whitePlayer;
                                console.log(blkCPlayer, whiteCPlayer);
                                var userCompare = blkCPlayer.stringValue;
                                var userCompareW = whiteCPlayer.stringValue;

                                if(user.displayName == userCompare){
                                    alert("success - playing black");
                                    try{
                                        var stakInt = document.getElementById("stakingInterface");
                                        stakInt.style = "display: none;";
                                        startBlackPlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                    
                                    
                                }else if(user.displayName == userCompareW){
                                    alert("success - playing white");
                                    try{
                                        startWhitePlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                }
                             });
                        });
                    }
                    
                });
            }
          });
    
}
//large bet
else if(gameValue.value == "0x567984e77a000"){

    // Set display name to a variable
    var dname = user.displayName;
            
    //make a unique user ID for the game queue:
    var newWaiter = db.collection("bigWaitList").doc(dname);
    
         newWaiter.set({dname});
       
        //okay cool, we added ourselves to the waiting array for free games.
        //now we have to listen for a change in the array to match up users
        db.collection('bigWaitList').get().then(snap => {
            console.log(snap);
            var snapData = snap.docs;
            console.log(snapData);

            //variable to keep chess game data for updating db during games:
            var chessGameArr = [];

            chessGameArr.makeChess = function(){
                
                var playerOne = chessGameArr[0];
                var playerTwo = chessGameArr[1];

                if(chessGameArr.length > 1){
                    console.log(playerOne, playerTwo);
                    var mehBool = (Math.random() * 2);
                    if(mehBool >= 1){
                        var whitePlyr = playerOne;
                        var blackPlyr = playerTwo;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        
                    }
                    else if(mehBool < 1){
                        var whitePlyr = playerTwo;
                        var blackPlyr = playerOne;
                        console.log(mehBool, blackPlyr, whitePlyr);
                        

                    }
                    //Great, we have our two players. Now we can delete them from the queue, after creating
                    //a chess game between the two players

                    var Ref = db.collection("chessGame").doc();
                    var referencePath = Ref.path;
                    var subStringRef = referencePath.substring(10, referencePath.length);
                    var gameId = subStringRef;
                    var gameValue = document.getElementById("poolSelect");

                    Ref.set({
                        blackPlayer: blackPlyr,
                        whitePlayer: whitePlyr,
                        fenStringData:"rnbqkbnr/​pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                        gameId:gameId,
                        oldPos: "",
                        source: "",
                        isLoser:"",
                        isWinner:"",
                        lastMove: null,
                        lastBlackMove: "",
                        lastBlackMoveSrc: "",
                        lastWhiteMove:"",
                        lastWhiteMoveSrc:"",
                        turn:"w",
                        gameValue: gameValue.value,
                        gameOver: false,
                        time: 1800
                    }).then(function() {
                        
                        //Here we access the collection freeWaitList and remove both players:
                        //this deletion triggers a call for the other player, so the game can start
                        
                        console.log("====================");
                        console.log(blackPlyr, whitePlyr);
                       

                        db.collection("bigWaitList").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                doc.ref.delete();
                             });


                             if(blackPlyr == user.displayName){
                                
                                startBlackPlayerChessGame();

                            }else if(whitePlyr == user.displayName){
                                
                                startWhitePlayerChessGame();

                            }

                        });
                       
                      });

                }else{
                    console.log("not enough players to make a game yet");
                }
                
            };
            
            for(var i = 0; i< snapData.length; i++){
                
                var tempVar = snapData[i];
                //The below line gets the dname and value from firebase for each person in the freeWaitList collection
                var varTest = tempVar._delegate._document.data.partialValue.mapValue.fields;
                console.log(varTest);
                var playerPreName = varTest.dname.stringValue;
                console.log(playerPreName);
                chessGameArr.push(playerPreName);
                chessGameArr.makeChess();
                //We add players here to our ChessGameArray, so that in the next step, if the size of the snap is 2,
                //We can remove those players from the database dynamically, and add them into an instanced chess game.
                
            }

            if(snap.size == 2){
                //we know that we have two players which can be turned into a chess game!
               //and we can start the game:
               // alert("just btw the snap size was 2");
               console.log(chessGameArr);

            } 
            else if(snap.size == 1){
                //add event listener to chessGame database, so we know when the game is initialized.
                //we have to get a snapshot of the chessGame collection, iterate through each document, and 
                //find the one where blackPlayer = user.displayName or whitePlayer = user.displayName
                

                //here since we're the first, we're adding a snapshot to run a function when our collection gets
                //deleted, which happens when player2 joins the queue
                var miName = user.displayName;
                db.collection("bigWaitList").doc(miName)
                .onSnapshot((dataW)=>{
                    if (dataW.exists){
                    //cant start game yet
                    console.log(dataW);
                    var storage = dataW._delegate._document.data.partialValue.mapValue.fields;
                    console.log(storage);
                    
                    }else{
                        
                        //Once the data no longer exists, that means a chess game was created:
                        db.collection("chessGame").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                var blkCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.blackPlayer;
                                var whiteCPlayer = doc._delegate._document.data.partialValue.mapValue.fields.whitePlayer;
                                console.log(blkCPlayer, whiteCPlayer);
                                var userCompare = blkCPlayer.stringValue;
                                var userCompareW = whiteCPlayer.stringValue;

                                if(user.displayName == userCompare){
                                    alert("success - playing black");
                                    try{
                                        var stakInt = document.getElementById("stakingInterface");
                                        stakInt.style = "display: none;";
                                        startBlackPlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                    
                                    
                                }else if(user.displayName == userCompareW){
                                    alert("success - playing white");
                                    try{
                                        startWhitePlayerChessGame();
                                    }catch(ex){
                                        console.log(ex);
                                    }
                                }
                             });
                        });
                    }
                    
                });
            }
          });
    
}//incorrect value
else{
   alert("Incorrect value- please submit a bug report");
}
        
    }else{
        alert("not logged in");
    }
});


}




