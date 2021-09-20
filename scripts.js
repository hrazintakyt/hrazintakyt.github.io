/*!
* Start Bootstrap - Creative v6.0.5 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
document.addEventListener('contextmenu', event => event.preventDefault());

var playBtn = document.getElementById('Play-btn');
    playBtn.onclick = (function(){
        var mb = document.getElementById('myBoard');
        mb.style = ( "display: flex; margin-top: 8vh;" );
        var ct = document.getElementById('chessTable');
        var lengthConst = ct.children.length;
            for (var i = 0; i<lengthConst-1; i++){
                ct.children[1].remove();
            }
    
        board.position("start");
        game = new Chess();

        var su = document.getElementById('Signup');
        su.style = ( "display: none" );
        var up = document.getElementById('userProfile');
        up.style = ( "display: none" );

            firebase.auth().onAuthStateChanged(function(user)
            {
                if(user){
        
                    var stakingInterfaceD = document.getElementById("stakingInterface");
                    stakingInterfaceD.style = ("display: flex; position: absolute; background-color: rgb(61, 76, 83);top: 0.5vh; height: 99vh;width: 96vw; left: 2vw; right: 2vw; z-index: 50;");
                    //adding media query here
                    //other styles:
                    //  background-color: #3D4C53; top: 15vh; height: 65vh; width: 20vw; right: 75vw;

                }
                else{
                    alert("You must be logged in to seek games");
                    }

            });

    });



var fOp = document.getElementById('findOpponent');
fOp.onclick = (function(){
    var gamblinInterface = document.getElementById('stakingInterface');
    gamblinInterface.style = "display: none;";
    var tc = document.getElementById('tableContainer');
    tc.style = ("display: block; margin-left: 70vw; overflow: auto;max-height: 80%;height: 692px;background: rgba(87, 75, 67, 60%);");
       
    loadUpGame();  
})





var profBtn = document.getElementById('Profile-btn');
profBtn.onclick = (function(){

    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          
            //Create the users Profile to see
            var userProf = document.getElementById('userProfile');
            userProf.style = ( "display: flex;" );
            var myBoard = document.getElementById("myBoard");
            myBoard.style = ( "display: none;" );
            var tableCont = document.getElementById("tableContainer");
            tableCont.style = ( "display: none;" );
            // var chessTab = document.getElementById('chessTable');
            // chessTab.style= ( "display: none;" );
            var stakingInterfaceD = document.getElementById("stakingInterface");
            stakingInterfaceD.style =("display: none;");


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
            signOutBtn.onclick = function(){
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
            var intViewportWidth = window.innerWidth;

            var styleObjLarge = ( "display: block; margin-top: 3vw; margin-left: 20vw;" );

            var styleObjSmall = ( "display: block; left: 0px; right: 0px; height: 97vh; margin-top: 2vh; width: 100vw; position: absolute;" );

            console.log(intViewportWidth);

            if(intViewportWidth > 880){
                signU.style = styleObjLarge;
            }else if(intViewportWidth <= 880){
                signU.style = styleObjSmall;
            }
            var meBoard = document.getElementById('myBoard');
            meBoard.style = ( "display: none;" );
            var tableC = document.getElementById("tableContainer");
            tableC.style = ( "display: none;" );
            var chessT = document.getElementById("chessTable");
            chessT.style = ( "display: none;" );
    
        }
      });

    

  

});



