var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

const Canvas = require('canvas');
const canvas = new Canvas(7, 7);
const ctx = canvas.getContext('2d');

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    this.speedX = 0;
    this.speedY = 0; 
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.update = function() {
    	ctx.fillStyle = color;
    	ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom(); 
    }

    this.hitBottom = function() {
    	var rockbottom = canvas.height - this.height;
    	if (this.y > rockbottom) {
    		this.y = rockbottom;
    	}
    }
}

setTimeout(function(){nopixel.update()}, 500);

var objects = [new component(1,1,'red', 1,1)];
var colors = ["red", "green", "blue", "cyan", "purple"];

nopixel.on('clicked', function(eventDetail) {
	objects.push(new component(1,1, colors[Math.floor(Math.random() * colors.length)], eventDetail.x, eventDetail.y));
    console.log(objects);
})

var el = new component(1,1,"red", 3,3);

setInterval(function(){
	ctx.clearRect(0,0,7,7);

	if (objects.length > 0) {
		objects.forEach(function(el) {
			el.newPos();
			el.update();
		})
	}
    nopixel.fromCanvas(ctx.getImageData(0,0,7,7).data);
	nopixel.update();
}, 1000/60);

var fs = require('fs')
, out = fs.createWriteStream(__dirname + '/test.png')
, stream = canvas.pngStream();

stream.on('data', function(chunk){
	out.write(chunk);
});

stream.on('end', function(){
	console.log('saved png');
});


//======================================
// const velocity = 

// var Board = function() {
// 	var self = this;
// 	self.length = 7;
// 	self.height = 6;
// 	self.isTurnA = true;

// 	self.cells = [];

// 	self.reset = function() {
// 			for (var i=0;i<self.length;i++) {
// 				var cols = [];
// 				for (var j=0;j<self.height;j++) {
// 					cols.push(new Cell(i,j));
// 				}
// 			self.cells.push(cols);
// 		}
// 	}

// 	self.checkGravity = function() {

// 	}

// 	self.setPoint = function(x, y) {
// 		// Check for collision

// 		self.isTurnA ? 
// 			self.cells[a][b].isPlayerA = true : 
// 			self.cells[a][b].isPlayerA = false;
// 	}

// 	self.nextTurn = function() {
// 		self.isTurnA = !self.isTurnA;
// 		// Calculate logic
// 	}

// 	self.print = function() {
// 		console.log(self.cells);
// 	}

// 	self.getCellUnder = function(Cell) {
// 		return (Cell.y == 0) ? undefined : self.cells[Cell.x][Cell.y-1];
// 	}

// }

// var Cell = function(x, y, isPlayerA) {
// 	var self = this;
// 	self.x = x;
// 	self.y = y;
// 	self.isPlayerA = isPlayerA || undefined;
// }

// var board = new Board();
// board.reset();
// board.print();

// setInterval(function(){
// 	// Check for gravity

// }, 1000/60)

// nopixel.on('clicked', function (eventDetail) {
// 	board.setPoint(eventDetail.x, eventDetail.y);
// 	board.nextTurn();
// 	board.print();
// });