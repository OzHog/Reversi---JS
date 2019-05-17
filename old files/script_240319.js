

function Cell (x, y, parent) {
	this.x = x;
	this.y = y;
	this.disc = null;
	this.element = document.createElement("DIV");
	this.element.classList.add("cell");
	
	parent.appendChild(this.element);
}
	Cell.prototype.addDisc = function (e) {
		this.element.desabled = true;
		this.disc = new Disc("black", e.target);
	}



function Disc (color, parent) {
		this.color = color;
		this.element = document.createElement("DIV");
		this.element.classList.add("disc");
		parent.appendChild(this.element);
	}



let cells = new Array(10);
let board = document.getElementsByClassName("board")[0];
let cell;
for (var i = 0 ; i < 10 ; i++) {
	cells[i] = new Array(10);
	for (var j = 0; j < 10; j++) {
		cells[i][j] = new Cell(i, j, board);
		cells[i][j].element.onclick = Cell.prototype.addDisc.bind(cells[i][j]);
	}
}
console.log(cells);




