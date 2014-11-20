var player = JSON.parse(localStorage.getItem('result'));

var scoreTD = document.getElementById("scoreTD");
scoreTD.innerHTML = player.score;
var nameTD = document.getElementById("nameTD");
nameTD.innerHTML = player.name;