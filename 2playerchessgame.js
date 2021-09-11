loadTwoPlayerGame = function () {

  // //check the selected time control
  // var timeControl = document.getElementById("timeControl").selectedOptions[0].value;
  // var pool = document.getElementById("poolSelect").selectedOptions[0].value;
  // console.log(timeControl, pool);


  //when starting a new game, we reset the board FEN
  db.collection("gameFenData").doc("currentGame").set({
    FenStringData: "rnbqkbnr/​pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
  })

  db.collection("gameMoves").doc("lastMove").set({
    lastMove: null
  })



  var game = new Chess();

  var gameValue = document.getElementById("poolSelect");

  gameValue.disabled = true;
  

  //ensure the user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      
      
      
      

      var whiteChessPlayer = db.collection("playersWaitList").doc("whitePlayer");
      var blackChessPlayer = db.collection("playersWaitList").doc("blackPlayer");

      whiteChessPlayer.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          var player1 = doc.data();
          if (player1.email == user.email) {


            document.getElementById("whtPlayerUsrNm").innerHTML = player1.name;
            //now we set the black player to the opponent

            blackChessPlayer.get().then((doc) => {
              if (doc.exists) {
                var player2 = doc.data();

                document.getElementById("blkPlayerUsrNm").innerHTML = player2.name;

                //reset the board
                
                board.orientation('white');
              }

            });

          } else if (player1.email !== user.email) {
            db.collection("playersWaitList").doc("blackPlayer").set({
              email: user.email,
              name: user.displayName,
              playsWhite: false
            }, { merge: true }).then(() => {
              console.log("Black Player added to queue");
              //as black

              document.getElementById("whtPlayerUsrNm").innerHTML = player1.name;
              document.getElementById("blkPlayerUsrNm").innerHTML = user.displayName;

              //reset the board
              
              board.orientation('black');

            });

          }

        }

        else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

    };

    
   
   
    
    
     


    

      
   

        
        //when a move is made, update the games fen
        db.collection("gameFenData").doc("currentGame")
        .onSnapshot((fenString) => {
          var currentFenString = fenString.data();
          var positionAsFen = currentFenString.FenStringData;
          
          game.load(positionAsFen);
          console.log("real game fen set");

          board.position(positionAsFen);

          
          
          

        });


        //snapshot for updating the table when a new move is added to the database:
        db.collection("gameMoves").doc("lastMove")
        .onSnapshot((lastMove) => {
          var currentLastMove = lastMove.data();
          
          
          
          
          try{
            var indexZero = currentLastMove.lastmove[0];
            var indexOne = currentLastMove.lastmove[1];

           // console.log(indexOne);

            var parsedInteger = parseInt(indexZero);
            var parsedSecondInteger = parseInt(indexOne);

          // to prevent the first call getting 'undefined' from popping up in the game table
            if(parseInt(parsedInteger) || parseInt(parsedSecondInteger))

            

                //if white
         
            var chessTable = document.getElementById("chessTable");
            
            var tableBody = chessTable.children[0]

            var lastRow = tableBody.lastChild;

            var lastChildLength = lastRow.children.length;

            console.log(tableBody);
            console.log(lastRow);
            console.log(lastChildLength);

            
            
            if(lastChildLength == 2){

              var tData = document.createElement("td");

              tData.style="position: relative; height: 50px; width: 50%; background-color: gray;";

              tData.textContent = currentLastMove.lastmove;

              var tRow = document.createElement("tr");

              tRow.append(tData);

              tableBody.append(tRow);


            }else if(lastChildLength == 1){

              var tData = document.createElement("td");

              tData.style="position: relative; height: 50px; width: 50%; background-color: gray; padding-right: 10px;";

              tData.textContent = currentLastMove.lastmove;

              if(tData.textContent.includes(' ... ')){
                tData.textContent = tData.textContent.replace(' ... ', ' ');
                return;
              }

            

              var tRow = lastRow;
  
              tRow.append(tData);

              console.log(tRow.children);
  
            }else{
              alert("smth");
            }

           

            
         


          }
          catch(ex){
            console.log("no moves were made yet");
            return;
          }
         
          
          

      
         
        
          

        });
    

    //creating two variables for highlighting legal moves
    var whiteSquareGrey = "#a9a9a9";
    var blackSquareGrey = "#696969";

    function removeGreySquares() {
      $("#myBoard .square-55d63").css("background", "");
    }

    function greySquare(square) {
      var $square = $("#myBoard .square-" + square);

      var background = whiteSquareGrey;
      if ($square.hasClass("black-3c85d")) {
        background = blackSquareGrey;
      }

      $square.css("background", background);
    }





    function onDragStart(source, piece, position, orientation) {

      //only allow pieces to be moved if board is oriented correctly
       if ((orientation === 'white' && piece.search(/^w/) === -1) ||
         (orientation === 'black' && piece.search(/^b/) === -1)) {
         return false
       }

      // do not pick up pieces if the game is over
      if (game.game_over())
        return false;

      
    

      //only pick up pieces for the side to move
      if (
        (game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (game.turn() === "b" && piece.search(/^w/) !== -1)
      ) {
        return true;
      }
    }

    function onDrop(source, target) {
      //put previous pgn into a temporary variable so that we can later compare strings:
      var previousPgn = game.pgn();


      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: "q", // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) {
        return "snapback";
      }



      pngBox.innerText = game.pgn();

      var tempGamePgn = game.pgn();

      if (previousPgn.length !== tempGamePgn.length) {
        var difference = (tempGamePgn.length - previousPgn.length);

        var differenceString = tempGamePgn.substr(previousPgn.length, difference);

        var lastMove = differenceString;


        //we also have to send the move to the database so it aint an illegal game or smth:
        db.collection("gameMoves").doc("lastMove").set({
          lastmove: lastMove
        }).then(() => {
          console.log("sent move");
          console.log("sending src");
          //now we need a source as well
        db.collection("gameMoves").doc("moveSource").set({
          source: source
        }).then(() => {
          console.log("source of move : " + source);
          console.log("game over = " + game.game_over());

          if(game.game_over() == false){
            return;
          }

          if(game.game_over() == true){







            // game over function by pavlov
            var ethElem = document.getElementById('accounts');
            var ethAddy = ethElem.innerHTML;
            var whitePlayerName = document.getElementById('whtPlayerUsrNm');
            var blackPlayerName = document.getElementById('blkPlayerUsrNm');
            var gameValue = document.getElementById("poolSelect");
            var el = gameValue.selectedIndex;
            var elHt = gameValue.children[el];
            var payVal = elHt.value;

            if(game.turn() == "w"){
              alert("black won");
              alert("user display name " + user.displayName);
              if(blackPlayerName.innerHTML == user.displayName){
                alert("match");
                //payout black player
                if(payVal == 0){
                  alert("free game, no payout this time");
                }
                else 
                {
                  
            ethereum
            .request({
            method: 'eth_sendTransaction',
           params: [
           {
            from: '0x17f4212A49979e2F2f46d9c5CA0Ea489521d6458',
            to: ethAddy,
             //value: '0x29a2241af62c0000',
             value: payVal,
             //gasPrice: '0x09184e72a000',
            gas: '0x2710',
          },
         ],
      })
       .then((txHash) => function(txHash){
         console.log(txHash);
         console.log(payVal);
         seekGameButton.disabled = false;
         gameValue.disabled = false;
       })
      .catch((error) => function(error){
        console.log(error);
        
      });

                }

                
              
              }
              else{
                alert("no match");
              }
            }else if(game.turn() == "b"){
              alert("white won");
              if(whitePlayerName.innerHTML == user.displayName){
                alert("match");
                //payout white player

                if(payVal == 0){
                  alert("free game, no payout this time");
                  gameValue.disabled = false;
                  seekGameButton.disabled = false;
                }else 
                {
                  
            ethereum
            .request({
            method: 'eth_sendTransaction',
           params: [
           {
            from: '0x17f4212A49979e2F2f46d9c5CA0Ea489521d6458',
            to: ethAddy,
             //value: '0x29a2241af62c0000',
             value: payVal,
             //gasPrice: '0x09184e72a000',
            gas: '0x2710',
          },
         ],
      })
       .then((txHash) => function(txHash){
         console.log(txHash);
         console.log(payVal);
         gameValue.disabled = false;
         seekGameButton.disabled = false;
       })
      .catch((error) => function(error){
        console.log(error);
        
      });

                }

                
              }
              else{
                alert("no match");
                gameValue.disabled = false;
                seekGameButton.disabled = false;
              }

            }else{
              console.log("idk why but " + game.turn());
            }
            //black won





          }
        })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });


        })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });


      }

      

    }



    function onMouseoverSquare(square, piece) {
      // get list of possible moves for this square
      var moves = game.moves({
        square: square,
        verbose: true
      });
      
      // exit if there are no moves available for this square
      if (moves.length === 0) return;

      // highlight the square they moused over
      greySquare(square);

      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
      }
    }

    function onMouseoutSquare(square, piece) {
      removeGreySquares();
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd(orientation) {

      if ((orientation === 'white' && piece.search(/^w/) === -1) ||
        (orientation === 'black' && piece.search(/^b/) === -1)) {
        return false
      }

    }




    function pieceTheme(piece) {
      // wikipedia theme for white pieces
      if (piece.search(/w/) !== -1) {
        return piece + ".png";
      }

      return piece + ".png";

    }



   
   
    




    function onChange(oldPos, newPos) {
      console.log('Position changed:')
      console.log('Old position: ' + Chessboard.objToFen(oldPos))
      var oldPos = Chessboard.objToFen(oldPos);
      
      var newPos = game.fen();
      console.log('New position: ' + newPos);
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      socket.emit("onChange", oldPos, newPos, (newPos) => {
        console.log("old position " + oldPos);
        console.log("new position " + newPos);

        


      })

    }


  




    var config = {
      pieceTheme: pieceTheme,
      draggable: true,
      position: "start",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd,
      onChange: onChange
      
    };

    var board = Chessboard("myBoard", config);


  })


}