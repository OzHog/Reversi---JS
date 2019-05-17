class Cell {
   constructor (x, y, parent, playerClicked) {
       this.disc = null;
       this.text = null;
       this.parent = parent;
       this.x = x;
       this.y = y;
       this.playerClicked = playerClicked;
       this.element = null;
       this.inRisk = Array(24);
       this.render();

   }

   render() {
       this.element = document.createElement("DIV");
       this.element.classList.add("cell");
       this.element.classList.add("cellhover");
       this.parent.element.appendChild(this.element);

       /*
       this.element.onclick = function(){
           this.playerClicked.bind(this.parent.parent)(this.x, this.y);
       }.bind(this);
       */
   }

   addDisc(color) {
       this.disc = new Disc(color, this.element);
       this.element.onclick = false;
   }
}

class Disc {
   constructor(color, parentElement) {
       this.color = color;
       this.parentElement = parentElement;
       this.render();
   }

   render() {
       this.element = document.createElement("DIV");
       this.element.classList.add("disc");
       this.element.classList.add(this.color);
       this.parentElement.appendChild(this.element);
   }
}

class Text {

   constructor(text, parent) {
       this.text = text;
       this.parent = parent;
       this.changeText.bind(this);
       this.render();
   }

   render() {
       this.element = document.createElement("P");
       this.element.classList.add("text");
       this.element.innerHTML = this.text;
       this.parent.element.appendChild(this.element);
   }

   changeText(text){
       this.text = text;
       this.element.innerHTML = this.text;
   }
}

class Player {
   constructor (color) {
       this.color = color;
       this.score = 2;
       this.count2Discs = 1;
       this.countTurns = 0;
       this.avgTurn = 0;
       this.sumPlayTimes = 0;
   }
}

class Board {
   constructor(parent, playerClicked) {
       this.playerClicked = playerClicked;
       this.parent = parent;
       this.availableCells = new Array(0);
       this.render();
       return this;
   }

   render() {
       this.element = document.createElement("DIV");
       this.element.classList.add("board");
       this.parent.statAndBoardContainerElm.appendChild(this.element);
       this.playBoard = new Array(10);
       for (let i = 0; i < 10; i++) {
           this.playBoard[i] = new Array(10);
           for (let j = 0; j < 10; j++) {
               this.playBoard[i][j] = new Cell(j, i, this, this.playerClicked);
           }
       }

       this.init();
   }

   init() {
       this.playBoard[4][4].addDisc("white");
       this.playBoard[4][4].element.classList.remove("cellhover");

       this.playBoard[4][5].addDisc("black");
       this.playBoard[4][5].element.classList.remove("cellhover");

       this.playBoard[5][4].addDisc("black");
       this.playBoard[5][4].element.classList.remove("cellhover");

       this.playBoard[5][5].addDisc("white");
       this.playBoard[5][5].element.classList.remove("cellhover");

       this.setAvailable(4, 4);
       this.setAvailable(4, 5);
       this.setAvailable(5, 4);
       this.setAvailable(5, 5);

       this.setInRisk();
   }

   setAvailable(x, y) {

       for (let i = y - 1; i <= y + 1; i++)
           for (let j = x - 1; j <= x + 1; j++) {
               if ((i < 10 && i >= 0) && (j < 10 && j >= 0)) {
                   if (this.playBoard[i][j].disc === null) {
                        this.playBoard[i][j].element.classList.remove("cellhover");
                       if (!this.availableCells.includes(this.playBoard[i][j])) {
                           this.playBoard[i][j].element.onclick = function () {
                               this.playerClicked.bind(this.parent.parent)(this.x,this.y);
                           }.bind(this.playBoard[i][j]);
                           this.availableCells.push(this.playBoard[i][j]);
                       }
                   }

               }
           }
   }

   eat(x, y) {
       if (this.playBoard[y][x].inRisk.length > 0) {

           this.playBoard[y][x].inRisk.forEach(function (cell) {
               cell.disc.element.classList.remove(cell.disc.color);
               if (cell.disc.color === "black")
                   cell.disc.color = "white";
               else
                   cell.disc.color = "black";
               cell.disc.element.classList.add(cell.disc.color);
           });


           this.playBoard[y][x].inRisk = null;
       }
   }

   setInRisk() {
       this.availableCells.forEach(function (cell) {
            //cell.element .classList.remove("cellhover");
           cell.inRisk = [];
           this.scan(cell.x, cell.y);
       }.bind(this));
   }

   scan(targetX, targetY) {
       let i, j, k;
       let last = null;
       let x, y;
       for (i = -1; i <= 1; i++)
           for (j = -1; j <= 1; j++) {
               for (k = 0; k < 2; k++) {
                   x = targetX + j;
                   y = targetY + i;
                   if (k === 0) {
                       while ((x < 10 && x >= 0) && (y < 10 && y >= 0)) {
                           if (this.playBoard[y][x].disc) {
                               if (this.playBoard[y][x].disc.color === this.parent.turn)
                                   last = this.playBoard[y][x];
                               x += j;
                               y += i;

                           } else
                               x = 10;
                       }
                   } else if (last != null) {
                       while (this.playBoard[y][x].disc && (x != last.x || y != last.y)) {
                           if (this.playBoard[y][x].disc.color != this.parent.turn) {
                               this.playBoard[targetY][targetX].inRisk.push(this.playBoard[y][x]);
                           }
                           x += j;
                           y += i;
                       }
                   }
               }
               last = null;
           }
   }

   setLearningMode(checkBoxState) {

       console.log(" check box state : " , checkBoxState);
       this.availableCells.forEach(function (cell) {

           if (checkBoxState) {
               cell.text = new Text(cell.inRisk.length, cell);

           } else
               this.deleteCellText(cell.x, cell.y);

       }.bind(this));


   }

   upDateCellText() {
       this.availableCells.forEach(function (cell) {
           if (cell.text)
               cell.text.changeText(cell.inRisk.length);
           else
               cell.text = new Text(cell.inRisk.length, cell);
       });

   }

   deleteCellText(x, y) {
       this.playBoard[y][x].element.children[0].remove();
       this.playBoard[y][x].text = null;
   }
}


class Statistics {
   constructor(parent, p1SumAvg = 0, p1Avg = 0,  p2SumAvg = 0, p2Avg = 0) {
       this.parent = parent;
       this.containerElement = null;

       this.x= "X";

       this.player1Score = 2;
       this.player1ScoreElement = null;
       this.player12disCountElm = null;
       this.player1AvgElement = null;
       this.player1sumAvg = p1SumAvg;
       this.player1Avg = p1Avg;

       this.player2Score = 2;
       this.player2ScoreElement = null;
       this.player22disCountElm = null;
       this.player2AvgElement = null;
       this.player2sumAvg = p2SumAvg;
       this.player2Avg = p2Avg;

       this.checkBoxElement = null;

       this.turn = this.parent.turn;
       this.newGameButtonElemant = null;


       this.turnElement = null;
       this.turnsCounterElement = null;
       this.clock;
      this.starTime = 0;
      this.endTime = 0;


       this.globalContainerElement = null;

       this.render(p1Avg, p2Avg);


   }

   render(p1Avg, p2Avg) {

       /*============================player 1==============================*/

       /* score */
       let scoreContainerElement = document.createElement("div");
       scoreContainerElement.classList.add("scoreContainer");

       new Disc (this.parent.p1.color, scoreContainerElement);

       let xElement = document.createElement("div");
       xElement.classList.add("x");
       xElement.innerHTML = "X";

       this.player1ScoreElement = document.createElement("div");
       this.player1ScoreElement.classList.add("score");
       this.player1ScoreElement.innerHTML = this.parent.p1.score;

       scoreContainerElement.appendChild(xElement);
       scoreContainerElement.appendChild(this.player1ScoreElement);
/* count2discs */
       let count2discsContainerElement = document.createElement("div");
       count2discsContainerElement.classList.add("playerInfoContainer");
       let textElement = document.createElement("p");
       textElement.innerHTML = "Two Discs Counter: ";
       this.player12disCountElm =  document.createElement("div");
       this.player12disCountElm.innerHTML = this.parent.p1.count2Discs;

       count2discsContainerElement.appendChild(textElement);
       count2discsContainerElement.appendChild(this.player12disCountElm);

/*avg time to play */
      let avgContainerElement = document.createElement("div");
       avgContainerElement.classList.add("playerInfoContainer");

       textElement = document.createElement("p");
       textElement.innerHTML = "Average Play Time: ";

       this.player1AvgElement = document.createElement("p");
       this.player1AvgElement.innerHTML = p1Avg + " sec";
       avgContainerElement.appendChild(textElement);
       avgContainerElement.appendChild(this.player1AvgElement);

       let playerScoreContainerELM = document.createElement("div");
       playerScoreContainerELM.classList.add("playerScoreContainer");
       playerScoreContainerELM.appendChild(scoreContainerElement);
       playerScoreContainerELM.appendChild(count2discsContainerElement);
       playerScoreContainerELM.appendChild(avgContainerElement);


       let titleElement = document.createElement("h2");
       titleElement.classList.add("player-title");
       titleElement.innerHTML = this.parent.p1.color;

       let player1ContainerElement = document.createElement("div");
       player1ContainerElement.classList.add("playerContainer");
       player1ContainerElement.appendChild(titleElement);
       player1ContainerElement.appendChild(playerScoreContainerELM);

       /*============================player 2==============================*/

       /* score */
       scoreContainerElement = document.createElement("div");
       יייייייElement.classList.add("scoreContainer");

       new Disc (this.parent.p2.color, scoreContainerElement);

       xElement = document.createElement("div");
       xElement.classList.add("x");
       xElement.innerHTML = "X";

       this.player2ScoreElement = document.createElement("div");
       this.player2ScoreElement.classList.add("score");
       this.player2ScoreElement.innerHTML = this.parent.p2.score;

       scoreContainerElement.appendChild(xElement);
       scoreContainerElement.appendChild(this.player2ScoreElement);


       /* count2discs */
       count2discsContainerElement = document.createElement("div");
       count2discsContainerElement.classList.add("playerInfoContainer");
       textElement = document.createElement("p");
       textElement.innerHTML = "Two Discs Counter: ";
       this.player22disCountElm =  document.createElement("div");
       this.player22disCountElm.innerHTML = this.parent.p2.count2Discs;
       count2discsContainerElement.appendChild(textElement);
       count2discsContainerElement.appendChild(this.player22disCountElm);

       /*avg time to play */
       avgContainerElement = document.createElement("div");
       avgContainerElement.classList.add("playerInfoContainer");

       textElement = document.createElement("p");
       textElement.innerHTML = "Average Play Time: ";

       this.player2AvgElement = document.createElement("p");
       this.player2AvgElement.innerHTML = p2Avg + " sec";

       avgContainerElement.appendChild(textElement);
       avgContainerElement.appendChild(this.player2AvgElement);

       playerScoreContainerELM = document.createElement("div");
       playerScoreContainerELM.classList.add("playerScoreContainer");
       playerScoreContainerELM.appendChild(scoreContainerElement);
       playerScoreContainerELM.appendChild(count2discsContainerElement);
       playerScoreContainerELM.appendChild(avgContainerElement);


       titleElement = document.createElement("h2");
       titleElement.classList.add("player-title");
       titleElement.innerHTML = this.parent.p2.color;

       let player2ContainerElement = document.createElement("div");
       player2ContainerElement.classList.add("playerContainer");
       player2ContainerElement.appendChild(titleElement);
       player2ContainerElement.appendChild(playerScoreContainerELM);

       /*============================players container==============================*/

       let playersContainer = document.createElement("div");
       playersContainer.classList.add("playersContainer");

       playersContainer.appendChild(player1ContainerElement);
       playersContainer.appendChild(player2ContainerElement);


       /*============================general info==============================*/

/* Training Mode */

       let trainModeContainerElement = document.createElement("div");
       trainModeContainerElement.classList.add("infoContainer");

       textElement = document.createElement("p");
       textElement.innerHTML = "Training Mode";

       this.checkBoxElement = document.createElement("INPUT");
       this.checkBoxElement.setAttribute("type", "checkbox");
       this.checkBoxElement.classList.add("checkbox");

       this.checkBoxElement.onclick = ( function(){

           this.parent.gameBoard.setLearningMode(this.checkBoxElement.checked);

       }).bind(this);

       trainModeContainerElement.appendChild(textElement);
       trainModeContainerElement.appendChild(this.checkBoxElement);

   /* Turn */

       let turnContainer = document.createElement("div");
       turnContainer.classList.add("infoContainer");

       textElement = document.createElement("p");
       textElement.innerHTML = "Turn: ";

       this.turnElement = document.createElement("p");
       this.turnElement.classList.add("turn");
       this.turnElement.innerHTML = this.turn;

       turnContainer.appendChild(textElement);
       turnContainer.appendChild(this.turnElement);

       /* Time */

       let timeContainer = document.createElement("div");
       timeContainer.classList.add("timeContainer");

       this.clock = new Clock(this);
       timeContainer.appendChild(this.clock.element);

 /* count turns */

       let countTurnsContainer = document.createElement("div");
       countTurnsContainer.classList.add("infoContainer");

       textElement = document.createElement("p");
       textElement.innerHTML = "Total Turns: ";

       this.turnsCounterElement = document.createElement("p");
       this.turnsCounterElement.classList.add("countTurns");
       this.turnsCounterElement.innerHTML = "0";

       countTurnsContainer.appendChild(textElement);
       countTurnsContainer.appendChild(this.turnsCounterElement);

 /* new game button */
       let newGameButtonContainer = document.createElement("div");
       //newGameButtonContainer.classList.add("new-game-button");
       this.newGameButtonElemant = document.createElement("button");
       this.newGameButtonElemant.classList.add("new-game-button");
       this.newGameButtonElemant.innerHTML = "Quit Game";
       this.newGameButtonElemant.onclick = function () {
          if(this.parent.gameOver)
            {
                this.parent.setNewGame();
            }
            else {
                if(this.parent.turn === "black")
                  this.parent.turn = "white";
                  
                else
                  this.parent.turn = "black";
                  
                 this.parent.endGame(this.parent.turn);

            }
        }.bind(this);

       newGameButtonContainer.appendChild(this.newGameButtonElemant);

       /*============================general info container==============================*/

       let generalInfoContainer = document.createElement("div");
       generalInfoContainer.classList.add("generalInfoContainer");

       generalInfoContainer.appendChild(turnContainer);
       generalInfoContainer.appendChild(countTurnsContainer);
       generalInfoContainer.appendChild(trainModeContainerElement);
       generalInfoContainer.appendChild(timeContainer);
        generalInfoContainer.appendChild(this.newGameButtonElemant);

       /*============================statistic container==============================*/

       this.globalContainerElement = document.createElement("div");
       this.globalContainerElement.classList.add("container-statistics");
       this.parent.statAndBoardContainerElm.appendChild(this.globalContainerElement);
       this.globalContainerElement.appendChild(playersContainer);
       this.globalContainerElement.appendChild(generalInfoContainer);

   }

   updateValueByKey (key,value) {
       this[key] = value;
       this[`${key}Element`].innerHTML = value;
   }

  setAvg(turn) {
     this.endTime = (this.clock.m * 60) + this.clock.s;

    if(turn === "black") {
      this.player1sumAvg += this.endTime - this.starTime;
      this.player1Avg = parseInt(this.player1sumAvg / this.parent.p1.countTurns);
      this.player1AvgElement.innerHTML =  this.player1Avg + " sec";
    }
     else {
      this.player2sumAvg += this.endTime - this.starTime;
      this.player2Avg =  parseInt(this.player2sumAvg / this.parent.p2.countTurns);
      this.player2AvgElement.innerHTML = this.player2Avg + " sec";
    }
      this.starTime = this.endTime;
   }

printWinner(color) {

  let winnerContainerElement = document.createElement("div");
  let textElement = document.createElement("H1");
  textElement.innerHTML = "GAME OVER ! THE WINNER IS " + color;
  winnerContainerElement.appendChild(textElement);
  this.globalContainerElement.appendChild(winnerContainerElement);

}

}

class Clock {
   constructor() {
       this.element = null;
       this.interval = null;
       this.m = "0";
       this.s = "0";
       this.time = "Time: " + (this.m < 10 ? "0" + this.m : this.m) + ":" + (this.s < 10 ? "0" + this.s : this.s);
       this.render();
   }

   render() {
       this.element = document.createElement("DIV");
       this.element.innerHTML = this. time;
       this.interval = setInterval(this.showTime.bind(this), 1000);
   }

   showTime(){

       this.s++;

       if(this.s > 59){
           this.m++;
           this.s = 0;
       }

       this.time = "Time: " + (this.m < 10 ? "0" + this.m : this.m) + ":" + (this.s < 10 ? "0" + this.s : this.s);
       this.element.innerHTML = this.time;
   }

   stopClock() {
    clearInterval(this.interval);
   }
}


class Game {
   constructor() {

       this.turn = "black";
       this.containerElement = null;
       this.title = "Riversi";
       this.titleElement = null;
       this.titleContainerElm = null;
       this.p1 = new Player("black");
       this.p2 = new Player("white");
      this.turnsCounter = 0;
      this.statAndBoardContainerElm = null;
      this.gameOver = false;

       this.render();
       this.statistics = new Statistics(this);

       this.gameBoard = new Board(this, this.playerClicked);
    
   }

   render() {
       this.containerElement = document.createElement("div");
       this.containerElement.classList.add("global-container");
       this.statAndBoardContainerElm = document.createElement("div");
        this.statAndBoardContainerElm.classList.add("global-container");
       this.titleContainerElm = document.createElement("div");
       this.titleContainerElm.classList.add("title-container");
       this.titleElement = document.createElement("div");
       this.titleElement.classList.add("title");
       this.titleElement.innerHTML = this.title;
       document.getElementsByTagName("body")[0].appendChild(this.containerElement);
       this.containerElement.appendChild(this.titleContainerElm);
       this.titleContainerElm.appendChild(this.titleElement);
       this.containerElement.appendChild( this.statAndBoardContainerElm);


   }

   playerClicked(x,y) {



       /*current turn*/
       if(this.gameBoard.playBoard[y][x].text)
           this.gameBoard.deleteCellText(x, y);

       this.gameBoard.playBoard[y][x].addDisc(this.turn);

       if(this.turn === "black") {
           this.p1.score = this.p1.score + this.gameBoard.playBoard[y][x].inRisk.length + 1;
           this.p2.score =  this.p2.score - this.gameBoard.playBoard[y][x].inRisk.length;

           this.statistics.updateValueByKey('player1Score', this.p1.score);
           this.statistics.updateValueByKey('player2Score', this.p2.score);

           this.p1.countTurns++;

       }
       if(this.turn === "white") {
           this.p2.score = this.p2.score + this.gameBoard.playBoard[y][x].inRisk.length + 1;
           this.p1.score =  this.p1.score - this.gameBoard.playBoard[y][x].inRisk.length;

           this.statistics.updateValueByKey('player1Score', this.p1.score);
           this.statistics.updateValueByKey('player2Score', this.p2.score);

           this.p2.countTurns++;

       }

       this.gameBoard.eat(x, y);

      if(this.p1.score === 2) {
          this.p1.count2Discs++;
          this.statistics.player12disCountElm.innerHTML = this.p1.count2Discs;
        }

      if(this.p2.score === 2) {
           this.p2.count2Discs++;
           this.statistics.player22disCountElm.innerHTML = this.p2.count2Discs;

       }

      this.changeTurn();
    if((this.p1.score==0 || this.p2.score===0) || (this.p1.score + this.p2.score ===100))
    {
      if(this.p1.score > this.p2.score)
      {
        this.turn = this.p1.color;
      }
      else
        this.turn = this.p2.color;

       this.endGame(this.turn);
    }

      this.statistics.setAvg(this.turn);

       

       this.turnsCounter = this.p1.countTurns + this.p2.countTurns;
       this.statistics.turnsCounterElement.innerHTML = this.turnsCounter;
       this.statistics.updateValueByKey('turn', this.turn);

       /*for next turn*/

       //delete clicked cell from availableCelles
       this.gameBoard.availableCells = this.gameBoard.availableCells.filter(cell => (cell.x !=  this.gameBoard.playBoard[y][x].x || cell.y != this.gameBoard.playBoard[y][x].y ) );

       this.gameBoard.setAvailable(x, y);

       this.gameBoard.setInRisk(this.statistics.checkBoxElement.checked);//sends to scan the elements in the inRisk array

       if(this.statistics.checkBoxElement.checked)
       {
           this.gameBoard.upDateCellText();
       }



   }


   changeTurn() {
       if(this.turn == "white")
           this.turn = "black";
       else
           this.turn = "white";
   }

   endGame(winner) {
    this.gameOver = true;
    this.statistics.newGameButtonElemant.innerHTML = "New Game";
    this.statistics.clock.stopClock();
    this.gameBoard.element.style.pointerEvents = "none";
    this.statistics.checkBoxElement.disabled = true;
    this.statistics.printWinner(winner); 

   }

   setNewGame() {
        this.gameOver = false;
        this.turnsCounter = 0;

        while (this.statAndBoardContainerElm.firstChild)
            this.statAndBoardContainerElm.removeChild(this.statAndBoardContainerElm.firstChild);

        this.p1 = new Player("black");
        this.p2 = new Player("white");
        this.statistics = new Statistics(this,this.statistics.player1sumAvg, this.statistics.player1Avg,
          this.statistics.player2sumAvg, this.statistics.player2Avg);
        this.gameBoard = new Board(this, this.playerClicked);



    }

}

let game = new Game();