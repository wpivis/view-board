var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

const Canvas = require('canvas');
const canvas = new Canvas(7, 7);
const ctx = canvas.getContext('2d');

var Board = function() {
    var self = this;
    self.length = 7;
    self.height = 6;
    self.isTurnA = true;

    self.pieces = [];

    

    self.setPoint = function(x, y) {
        // Check for collision

        self.isTurnA ? 
            self.pieces[a][b].isPlayerA = true : 
            self.pieces[a][b].isPlayerA = false;
    }

    self.nextTurn = function() {
        self.isTurnA = !self.isTurnA;
        // Calculate logic
    }

    self.print = function() {
        console.log(self.pieces);
    }

    self.getCellUnder = function(Cell) {
        return (Cell.y == 0) ? undefined : self.pieces[Piece.x][Piece.y-1];
    }

}

function Piece(x, y, color, isPlayerA) {
    this.width = 1;
    this.height = 1;
    this.x = x;
    this.y = y; 
    this.speedX = 0;
    this.speedY = 0; 
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.isPlayerA = isPlayerA || undefined;

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

var objects = [];
var colors = ["red", "green", "blue", "cyan", "purple"];

nopixel.on('clicked', function(eventDetail) {
	objects.push(new Piece(eventDetail.x, eventDetail.y, colors[Math.floor(Math.random() * colors.length)]));
})

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