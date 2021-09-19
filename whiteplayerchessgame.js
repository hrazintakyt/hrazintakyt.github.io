startWhitePlayerChessGame = function () {
  var pbtn = document.getElementById("Play-btn");

  var prbtn = document.getElementById("Profile-btn");

  pbtn.onclick = function (e) {
    e.preventDefault();
  }

  prbtn.onclick = function (e) {
    e.preventDefault();
  }

  //get all chess games in database
  db.collection("chessGame").get().then(function (querySnapshot) {
    //ensure user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {

        //find the chess game that was created where the username = logged in users name
        querySnapshot.forEach(function (doc) {
          var temp = doc.data();
          console.log(temp)
          console.log(temp.whitePlayer);


          //once we have a match, we can see whom we are matched up against, so we populate some fields.
          if (user.displayName == temp.whitePlayer) {
            var whtPlayerUsrNm = document.getElementById("whtPlayerUsrNm");
            var blkPlayerUsrNm = document.getElementById("blkPlayerUsrNm");
            whtPlayerUsrNm.innerText = temp.whitePlayer;
            blkPlayerUsrNm.innerText = temp.blackPlayer;



            //insert chess game logic below:

            var game = new Chess();


            //grab the id from the game where our name was found
            var gameId = temp.gameId;
            //pass the aforementioned id as a parameter to access the proper data
            db.collection("chessGame").doc(gameId)
              .onSnapshot((dataW) => {
                var dat = dataW.data();
                console.log(dat);
                var turn = dat.turn;
                console.log(turn);
                //now we listen to a change in the value of the database- if the last change was made
                //by the opponent, we want to update our game. If it was made by us, it will be blacks 
                //turn, in which case we want to return, until the game can be updated and the snapshot
                //gets called again.
                if (turn == "b") {
                  console.log("please wait while your opponent makes a move");
                  return;
                }
                //make sure its our turn
                console.log("turn : " + turn);
                var currentFenString = dat.fenStringData;
                console.log(currentFenString);
                //If we make sure that if it is our turn in the database, and the board FEN is different
                //from the database, this means that it is our turn, but we don't want to be able to
                //make a move until after the game syncs with the database. So here we update our
                //game with the opponents last move.
                if (game.fen() !== currentFenString) {
                  game.load(currentFenString);
                  board.position(currentFenString);
                  console.log("if this hit, the board should have succesfully updated");
                  //since the game.game_over() bool was hit on a turn where our game FEN was
                  //different from the databases FEN, this means that the game ends in either a 
                  //draw or a loss.
                  //So after game.game_over() we have to add logic to check for a draw
                  if (game.game_over()) {
                    alert("Game Over");
                    //insert game over logic here
                    
                  if(game.in_stalemate()){
                    alert("draw logic hit here");
                    if(gVal !== 0){
                      alert("you should get a refund minus the cost of the transaction")
                    }else{
                      alert("You played a free game, so no refund");

                        db.collection("chessGame").doc(temp.gameId).delete().then(() => {
                          alert("Document successfully deleted!");

                          //make a call to the stalemate database which will be created to refund players partially:



                        }).catch((error) => {
                          console.error("Error removing document: ", error);
                        });
                     

                    }
                  }
                    
                      db.collection("chessGame").doc(temp.gameId).delete().then(() => {
                        alert("Document successfully deleted!");

                        //after the chessGame is deleted, we make a call to the server to pay out the game winner:
                        
                      }).catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                    //End main Game Logic:

                    //Resetting Variables:
                    var profBtn = document.getElementById('Profile-btn');
                    profBtn.onclick = (function () {


                      firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {

                          //Create the users Profile to see
                          var userProf = document.getElementById('userProfile');
                          userProf.style = ("display: flex;");
                          var myBoard = document.getElementById("myBoard");
                          myBoard.style = ("display: none;");
                          var tableCont = document.getElementById("tableContainer");
                          tableCont.style = ("display: none;");
                          // var chessTab = document.getElementById('chessTable');
                          // chessTab.style= ( "display: none;" );
                          var stakingInterfaceD = document.getElementById("stakingInterface");
                          stakingInterfaceD.style = ("display: none;");


                          //now we populate the profile.
                          console.log(user);
                          var profileUserName = document.getElementById("profileUserName");
                          profileUserName.innerHTML = " " + user.displayName;


                          var profileEmail = document.getElementById("profileEmail");
                          profileEmail.innerHTML = " " + user.email;

                          //placeholders until we get games working for 2 players
                          var profileWins = document.getElementById("profileWins");
                          profileWins.innerHTML = 0 + " Wins";

                          var profileLosses = document.getElementById("profileLosses");
                          profileLosses.innerHTML = 0 + " Losses";

                          var profileDraws = document.getElementById("profileDraws");
                          profileDraws.innerHTML = 0 + " Draws";

                          var profileGames = document.getElementById("profileGames");
                          profileGames.innerHTML = "Total Games Played: " + (parseInt(profileWins.innerText[0]) + parseInt(profileLosses.innerText[0] + parseInt(profileDraws.innerText[0])));

                          var signOutBtn = document.getElementById("signOutBtn");
                          signOutBtn.onclick = function () {
                            firebase.auth().signOut().then(() => {
                              console.log("signed out");
                              var userPro = document.getElementById("userProfile");
                              userPro.style = ("display:none;");
                              var sup = document.getElementById("Signup");
                              sup.style = ("display: block; margin-left: 20vw; margin-top: 3vw;");

                            }).catch((error) => {
                              console.log(error);
                            });

                          }


                        } else {
                          var signU = document.getElementById("Signup");
                          signU.style = ("display: block; margin-top: 3vw; margin-left: 20vw;");
                          var meBoard = document.getElementById('myBoard');
                          meBoard.style = ("display: none;");
                          var tableC = document.getElementById("tableContainer");
                          tableC.style = ("display: none;");
                          var chessT = document.getElementById("chessTable");
                          chessT.style = ("display: none;");

                        }
                      });





                    });


                    //undoing prevent default for clicking on play during a game:
                    var playBtn = document.getElementById('Play-btn');
                    playBtn.onclick = (function () {
                      var mb = document.getElementById('myBoard');
                      mb.style = ("display: flex; margin-top: 8vh;");
                      var ct = document.getElementById('chessTable');
                      var lengthConst = ct.children.length;
                      for (var i = 0; i < lengthConst - 1; i++) {
                        ct.children[1].remove();
                      }

                      board.position("start");
                      game = new Chess();

                      var su = document.getElementById('Signup');
                      su.style = ("display: none");
                      var up = document.getElementById('userProfile');
                      up.style = ("display: none");

                      firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {

                          var stakingInterfaceD = document.getElementById("stakingInterface");
                          stakingInterfaceD.style = ("display: flex; position: absolute; background-color: rgb(61, 76, 83);top: 0.5vh; height: 99vh;width: 96vw; left: 2vw; right: 2vw; z-index: 50;");
                          //adding media query here
                          //other styles:
                          //  background-color: #3D4C53; top: 15vh; height: 65vh; width: 20vw; right: 75vw;

                        }
                        else {
                          alert("You must be logged in to seek games");
                        }

                      });
                    });
                  }
                }
              });






            //chess functions for configuration below:

            //pieceTheme
            //==============================================================================================================//

            function pieceTheme(piece) {
              // wikipedia theme for white pieces
              if (piece.search(/w/) !== -1) {
                return piece + ".png";
              }

              return piece + ".png";

            }

            //onDragStart
            //==============================================================================================================//

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


            //onDrop function
            //==============================================================================================================//



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

              //if the length of the pgn changed from before the move was made to when
              //after the move was made, we want to store the last move from the pgn
              //in the database to update the other players game
              if (previousPgn.length !== tempGamePgn.length) {
                var difference = (tempGamePgn.length - previousPgn.length);

                var differenceString = tempGamePgn.substr(previousPgn.length, difference);

                var lastMove = differenceString;

                var fenString = game.fen();

                var gameOverBool = game.game_over();

                var chessGame = db.collection("chessGame").doc(temp.gameId);
                chessGame.get();

                chessGame.update({
                  lastMove: lastMove,
                  fenStringData: fenString,
                  source: source,
                  turn: "b",
                  gameOver: gameOverBool
                })
                  .then(() => {
                    console.log("Document successfully updated!");
                    console.log("source of move : " + source);
                    console.log("game over = " + game.game_over());

                    if (game.game_over() == false) {
                      return;
                    }
                    if (game.game_over() == true) {
                      alert("game over");
                   

                      var playBtn = document.getElementById('Play-btn');
                      playBtn.onclick = (function () {
                        var mb = document.getElementById('myBoard');
                        mb.style = ("display: flex; margin-top: 8vh;");
                        var ct = document.getElementById('chessTable');
                        var lengthConst = ct.children.length;
                        for (var i = 0; i < lengthConst - 1; i++) {
                          ct.children[1].remove();
                        }

                        board.position("start");
                        game = new Chess();

                        var su = document.getElementById('Signup');
                        su.style = ("display: none");
                        var up = document.getElementById('userProfile');
                        up.style = ("display: none");

                        firebase.auth().onAuthStateChanged(function (user) {
                          if (user) {

                            var stakingInterfaceD = document.getElementById("stakingInterface");
                            stakingInterfaceD.style = ("display: flex; position: absolute; background-color: rgb(61, 76, 83);top: 0.5vh; height: 99vh;width: 96vw; left: 2vw; right: 2vw; z-index: 50;");
                            //adding media query here
                            //other styles:
                            //  background-color: #3D4C53; top: 15vh; height: 65vh; width: 20vw; right: 75vw;

                          }
                          else {
                            alert("You must be logged in to seek games");
                          }

                        });

                      });

                      var profBtn = document.getElementById('Profile-btn');
                      profBtn.onclick = (function () {


                        firebase.auth().onAuthStateChanged(function (user) {
                          if (user) {

                            //Create the users Profile to see
                            var userProf = document.getElementById('userProfile');
                            userProf.style = ("display: flex;");
                            var myBoard = document.getElementById("myBoard");
                            myBoard.style = ("display: none;");
                            var tableCont = document.getElementById("tableContainer");
                            tableCont.style = ("display: none;");
                            // var chessTab = document.getElementById('chessTable');
                            // chessTab.style= ( "display: none;" );
                            var stakingInterfaceD = document.getElementById("stakingInterface");
                            stakingInterfaceD.style = ("display: none;");


                            //now we populate the profile.
                            console.log(user);
                            var profileUserName = document.getElementById("profileUserName");
                            profileUserName.innerHTML = " " + user.displayName;


                            var profileEmail = document.getElementById("profileEmail");
                            profileEmail.innerHTML = " " + user.email;

                            //placeholders until we get games working for 2 players
                            var profileWins = document.getElementById("profileWins");
                            profileWins.innerHTML = 0 + " Wins";

                            var profileLosses = document.getElementById("profileLosses");
                            profileLosses.innerHTML = 0 + " Losses";

                            var profileDraws = document.getElementById("profileDraws");
                            profileDraws.innerHTML = 0 + " Draws";

                            var profileGames = document.getElementById("profileGames");
                            profileGames.innerHTML = "Total Games Played: " + (parseInt(profileWins.innerText[0]) + parseInt(profileLosses.innerText[0] + parseInt(profileDraws.innerText[0])));

                            var signOutBtn = document.getElementById("signOutBtn");
                            signOutBtn.onclick = function () {
                              firebase.auth().signOut().then(() => {
                                console.log("signed out");
                                var userPro = document.getElementById("userProfile");
                                userPro.style = ("display:none;");
                                var sup = document.getElementById("Signup");
                                sup.style = ("display: block; margin-left: 20vw; margin-top: 3vw;");

                              }).catch((error) => {
                                console.log(error);
                              });

                            }


                          } else {
                            var signU = document.getElementById("Signup");
                            signU.style = ("display: block; margin-top: 3vw; margin-left: 20vw;");
                            var meBoard = document.getElementById('myBoard');
                            meBoard.style = ("display: none;");
                            var tableC = document.getElementById("tableContainer");
                            tableC.style = ("display: none;");
                            var chessT = document.getElementById("chessTable");
                            chessT.style = ("display: none;");

                          }
                        });





                      });

                      //insert game over logic here
                    }

                  })
                  .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                  });


              }


            }

            //creating two variables for highlighting legal moves
            var whiteSquareGrey = "#a9a9a9";
            var blackSquareGrey = "#696969";

            //defining some functions for the mouseOut and mouseIn functions to call them later
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


            //OnMouseoutSquare Function
            //================================================================================
            function onMouseoutSquare(square, piece) {
              removeGreySquares();
            }


            //OnMouseoverSquare Function
            //================================================================================
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

            //OnSnapEnd Function
            //================================================================================
            // update the board position after the piece snap
            // for castling, en passant, pawn promotion
            function onSnapEnd(orientation) {

              if ((orientation === 'white' && piece.search(/^w/) === -1) ||
                (orientation === 'black' && piece.search(/^b/) === -1)) {
                return false
              }

            }

            //configuration for chessBoard
            var config = {
              pieceTheme: pieceTheme,
              draggable: true,
              position: "start",
              onDragStart: onDragStart,
              onDrop: onDrop,
              onMouseoutSquare: onMouseoutSquare,
              onMouseoverSquare: onMouseoverSquare,
              onSnapEnd: onSnapEnd,

            };


            //Instantiate chessBoard on element with id myBoard, passing in the configuration for the game.
            var board = Chessboard("myBoard", config);
            board.orientation('white');




          }

        }
        )
      }

    });
    //then


  });


};