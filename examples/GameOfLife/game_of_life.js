var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

const fps = 4;
const MAX_AGE = 360;
const MAX_GENERATION = 5;

var isPaused = false;

var idleTimeout = function(board) {
	var temp = setTimeout(function() {
		if (board.isBarren()) {
			console.log("Board is idle. Germinating..");
			board.init();
		}
	}, 30000);

	return temp;
}

var Cell = function(x, y, board) {
	var self = this;
	self.x = x;
	self.y = y;
	self.board = board;
	self.dead = true;
	self.age = 0;
	self.generation = 0;

	self.getCoord = function() {
		return {x: self.x, y: self.y};
	};

	// Wrap around
	// Return an array of neighboring cells, clockwise from 12 o'clock starting from the top
	self.getNeighbors = function() {
		var x2 = self.x-1,
			x3 = self.x+1,
			y2 = self.y-1,
			y3 = self.y+1;

		if (x2 == -1) {x2 = self.board.length-1}
		if (x3 == (self.board.length)) {x3 = 0}
		if (y2 == -1) {y2 = self.board.height-1}
		if (y3 == (self.board.height)) {y3 = 0}

		return [self.board.getCell(self.x, y3),
				self.board.getCell(x3, y3),
				self.board.getCell(x3, self.y),
				self.board.getCell(x3, y2),
				self.board.getCell(self.x, y2),
				self.board.getCell(x2, y2),
				self.board.getCell(x2, self.y),
				self.board.getCell(x2, y3)]
	}

	self.getLiveNeighbors = function() {
		var sum = 0;
		self.getNeighbors().forEach((a) => sum += a.isAlive());
		return sum;
	}

	self.isAlive = function() {
		return !self.dead;
	};

	self.kill = function() {
		// console.log("Killed cell " + self.x);
		self.age = 0;
		self.generation = 0;
		return self.dead = true;
	}

	self.rise = function() {
		// console.log("Raised cell " + self.x);
		self.age = 1;
		self.generation = 1;
		return self.dead = false;
	}

	self.toggle = function() {
		self.dead = !self.dead;
		self.dead ? self.age = 0 : self.age = 1;
		self.dead ? self.generation = 0: self.generation = 1;

		return self.dead;
	}
}

var Board = function(length, height) {
	var self = this;
	self.length = length;
	self.height = height;

	// self.cells = new Array(self.length).fill(new Array(self.height).fill([]));
	self.cells = [];
	for (var i=0;i<self.length;i++) {
		var cols = [];
		for (var j=0;j<self.height;j++) {
			cols.push(new Cell(i, j, self));
		}
		self.cells.push(cols);
	}

	self.getCell = function(x, y) {
		return self.cells[x][y];
	}

	self.init = function() {
		for (var i=0;i<self.length;i++) {
			for (var j=0;j<self.height;j++) {
				Math.random() >= 0.5 ? self.cells[i][j].kill() : self.cells[i][j].rise();
			}
		}
	}

	self.tick = function() {
		var affected = [];
		self.deadCounter = 0;
		for (var i=0;i<self.length;i++) {
			for (var j=0;j<self.height;j++) {
				var currentCell = self.cells[i][j];
				var neighbors = currentCell.getNeighbors();
				if (currentCell.isAlive()) {
					self.deadCounter = 0;
					if (currentCell.getLiveNeighbors() > 3) {
						affected.unshift(currentCell);
					} else if (currentCell.getLiveNeighbors() < 2) {
						affected.unshift(currentCell);
					} else {
						if (currentCell.age > MAX_AGE) {
							currentCell.generation++;
							currentCell.age = 0;
						} else {
							currentCell.age++;
						}

						if (currentCell.generation > MAX_GENERATION) {
							affected.unshift(currentCell);
						}
					}
				} else {
					self.deadCounter++;
					if (currentCell.getLiveNeighbors() == 3) {
						affected.unshift(currentCell);
					}
				}
			}
		}
		affected.forEach(function(cell) {
			cell.toggle();
		})
	} //oh noes its a pyramid scheme

	self.isBarren = function() {
		console.log(self.deadCounter);
		return (self.deadCounter == 49);
	}

	// Binary representation of the world, printed out to console.
	self.print = function() {
		var results = "";
		for (var i=0;i<self.length;i++) {
			for (var j=0;j<self.height;j++) {
				if (self.cells[i][j].isAlive()) {
					results = results.concat("X ");
				} else {
					results = results.concat("O ");
				}
			}
			results = results.concat("\n");
		}

		console.log(results);
	}

	//Export world into RGB Buffer
	self.export = function() {
		for (var i=0;i<self.length;i++) {
			for (var j=0;j<self.height;j++) {
				if(self.cells[i][j].age == 0) {
					nopixel.setPixel(i, j, "black");
				} else if (self.cells[i][j].age == 1) {
					nopixel.setPixel(i, j, {h: 10, s: 1, l: 0.5});
				} else {
					nopixel.setPixel(i, j, colorFromAge(self.cells[i][j]));
				}
			}
		}
		// console.log("Sending frame...");
		nopixel.update();
	}
}

var world1 = new Board(7,7);
world1.init();
var timer1 = idleTimeout(world1);
console.log("initializing..")
var redraw = setInterval(function() {
	if (isPaused) {
		world1.export();
	} else {
		console.log("tick");
		//timer1 = idleTimeout(world1);
		world1.tick();
		world1.export();
	}
}, 1000/fps)

nopixel.on("clicked", function(eventDetail) {
	console.log("Clicked");
	world1.getCell(eventDetail.x, eventDetail.y).toggle();
})

nopixel.on("pressed", function(eventDetail) {
	isPaused = !isPaused;
})

//nopixel.on("idle", function(eventDetail) {
//	clearTimeout(timer1);
	// timer1 = idleTimeout(world1);
//})

function colorFromAge(cell) {
	return {h: cell.age%MAX_AGE, s:1, l: 0.5-(0.1*cell.generation)}
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

// Cleanup routine
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
    	console.log('clean');
    	clearInterval(redraw);
    	nopixel.close();
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}))