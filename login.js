var loginBtn = document.getElementById("loginToGrem");

loginBtn.onclick = (function(e){
e.preventDefault();
var userData = document.getElementsByClassName("form-control");
var userEmail = userData[0].value;
var passWord = userData[1].value;
console.log(userEmail, passWord);

// Make API call to database to login below:

firebase.auth().signInWithEmailAndPassword(userEmail, passWord)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    if(user){
        var LoginForm = document.getElementById("Login");
        LoginForm.innerHTML = "<h2 style='text-align: center;'>Welcome to CryptoKnight " + user.displayName +  " </h2>" + "<a href='index.html'> <button id='loginToGrem' class='btn btn-primary btn-lg' style='position: relative; margin-left: 25%; margin-right: 25%; width: 50%;'> Home </button> </a>";

    }
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Login Failed, Please re-enter your Email and Password and try again.")
  });

});