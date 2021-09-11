/*!
* Start Bootstrap - Creative v6.0.5 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/

$("#Play-btn").click(function() {
    $("#myBoard").show();
    $("#tableContainer").show();
    $("#chessTable").show();
    $("#Signup").hide();
    $("#userProfile").hide();

    firebase.auth().onAuthStateChanged(function(user)
    {
    if(user){
        
        var stakingInterfaceD = document.getElementById("stakingInterface");
        stakingInterfaceD.style = "display: block; background-color: #3D4C53; position: absolute; top: 15vh; height: 65vh; width: 20vw; right: 75vw;";

        
       

    }
    else{
        console.log("You must be logged in to seek games");
    }
    

    });
});



$("#findOpponent").click(function(){
    loadTwoPlayerGame();
})




$("#Profile-btn").click(function() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          
            //Create the users Profile to see
            $("#userProfile").show();
            $("#myBoard").hide();
            $("#tableContainer").hide();
            $("#chessTable").hide();
            var stakingInterfaceD = document.getElementById("stakingInterface");
            stakingInterfaceD.style ="display: none";


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
                    $("#userProfile").hide();
                    $("#Signup").show();
                  }).catch((error) => {
                    console.log(error);
                  });
                
            }


        } else {
    $("#Signup").show();
    $("#myBoard").hide();
    $("#tableContainer").hide();
    $("#chessTable").hide();
        }
      });

    

  
   
});

(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using anime.js
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').on('click', function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ?
                target :
                $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                anime({
                    targets: 'html, body',
                    scrollTop: target.offset().top - 72,
                    duration: 1000,
                    easing: 'easeInOutExpo'
                });
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
        $('.navbar-collapse').collapse('hide');
    });

   // Activate scrollspy to add active class to navbar items on scroll
   //$('body').scrollspy({
   //  target: '#mainNav',
   //offset: 75
   // });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 1) {
            $("#mainNav").addClass("navbar-scrolled");
        } else {
            $("#mainNav").removeClass("navbar-scrolled");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Magnific popup calls
    // $('#portfolio').magnificPopup({
    //     delegate: 'a',
    //     type: 'image',
    //     tLoading: 'Loading image #%curr%...',
    //     mainClass: 'mfp-img-mobile',
    //     gallery: {
    //         enabled: true,
    //         navigateByImgClick: true,
    //         preload: [0, 1]
    //     },
    //     image: {
    //         tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    //     }
    // });

})(jQuery); // End of use strict
