setGameTimer = function () {

    let gameTime = 300;

    var loadOnDom = document.getElementById("gameTime");
    

    setInterval(function(){ 
        gameTime --;
        loadOnDom.innerHTML = gameTime;
     }, 1000);

}