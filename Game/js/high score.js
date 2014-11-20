function HighScore(){
    //High Score
    var highScore;

    this.highScore = function(){
        if (localStorage.length == 0){
            name = prompt("Enter your name: ");
            score = {name: name, score: beersDrunk};
            localStorage.setItem('score', JSON.stringify(score));
        } else {
            storage = JSON.parse(localStorage.getItem('score'));
            currentBest = storage.score;

            if (currentBest < beersDrunk){
                name = prompt("Enter your name: ");
                score = {name: name, score: beersDrunk};
                localStorage.setItem('score', JSON.stringify(score));
            }
        }
        //var p = JSON.parse(localStorage.getItem('score'))
        //console.log(p.name + " " + p.score);
    };
}