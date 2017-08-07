var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

var Board = function() {
	var self = this;
	self.length = 7;
	self.height = 6;
	self.isTurnA = true;

	self.cells = [];

	self.reset = function() {
			for (var i=0;i<self.length;i++) {
				var cols = [];
				for (var j=0;j<self.height;j++) {
					cols.push(new Cell(i,j));
				}
			self.cells.push(cols);
		}
	}

	self.checkGravity = function() {

	}

	self.setPoint = function(x, y) {
		// Check for collision

		self.isTurnA ? 
			self.cells[a][b].isPlayerA = true : 
			self.cells[a][b].isPlayerA = false;
	}

	self.nextTurn = function() {
		self.isTurnA = !self.isTurnA;
		// Calculate logic
	}

	self.print = function() {
		console.log(self.cells);
	}

	self.getCellUnder = function(Cell) {
		return (Cell.y == 0) ? undefined : self.cells[Cell.x][Cell.y-1];
	}

}

var Cell = function(x, y, isPlayerA) {
	var self = this;
	self.x = x;
	self.y = y;
	self.isPlayerA = isPlayerA || undefined;
}

var board = new Board();
board.reset();
board.print();

setInterval(function(){
	// Check for gravity
	
}, 1000/60)

nopixel.on('clicked', function (eventDetail) {
	board.setPoint(eventDetail.x, eventDetail.y);
	board.nextTurn();
	board.print();
});