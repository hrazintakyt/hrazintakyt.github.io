
var signUpBtnGrem = document.getElementById("signUpForGrem");

signUpBtnGrem.onclick = (function(e){
e.preventDefault();

var userDataForSignUp = document.getElementsByClassName("form-group row");

var newUserName = userDataForSignUp[0].children[1].children[0].value;

var newEmailAddy = userDataForSignUp[1].children[1].children[0].value;

var newPassW = userDataForSignUp[2].children[1].children[0].value;

var newConfirmPass = userDataForSignUp[3].children[1].children[0].value;



if(newPassW === newConfirmPass){

//re add this if function doesnt work

firebase.auth().createUserWithEmailAndPassword(newEmailAddy, newPassW)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log("user " + user);
    console.log(userCredential);
    
    //lets try this
    user.updateProfile({
        displayName: newUserName
    }).then(function() {
        var signUpForm = document.getElementById("Signup");
        signUpForm.style = "display: none;";

        var userProf = document.getElementById("userProfile");
        userProf.style = "display: block; background-color: #3D4C53; position: absolute; top: 15vh; height: 60vh; width: 40vw; margin: auto;"
      
        var signUpUserName = document.getElementById("profileUserName");
        signUpUserName.innerText = "Username: " + user.displayName;

    });
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(error);
  });





}
else{
    alert("Passwords don't match");
}




});