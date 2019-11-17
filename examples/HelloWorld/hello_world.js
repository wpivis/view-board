var Nopixel = require('../../node_modules/nopixel');
var tinyColor = require("tinycolor2");
//Set the configuration
var nopixel = new Nopixel("../../config.json");

var FPS = 24;
var BOARD_SIZE = 49;
var Board = null;

// Color object, which tracks its own color, color transition & progress.
function Color(fps, duration) {
	this.duration = duration; //Duration in millisec
	this.fps = fps; 
	this.color = tinyColor.random().toHsv();
	this.targetColor = tinyColor.random().toHsv();
	this.pause = false;
	this.off = false;
	this.totalStep = parseInt(this.duration / this.fps);
	this.stepCount = 0;
	this.getNewTarget = function() {
		this.targetColor = tinyColor.random().toHsv();
	}
	this.export = function() {
		if(this.off) {
			this.pause = true;
			return tinyColor("black").toHsvString();
		}

		return tinyColor(this.color).toHsvString();
	}

	//Transition to this.targetColor
	this.step = function() {
		if(this.pause) {
			return;
		}

		var percent = this.stepCount / this.totalStep;
		if(this.stepCount == this.totalStep) {
			this.stepCount = 0;
			percent = 0;
			this.getNewTarget();
		}

		this.color.h = ((this.targetColor.h - this.color.h) * percent) + this.color.h;
		this.color.s = ((this.targetColor.s - this.color.s) * percent) + this.color.s;
		this.color.v = ((this.targetColor.v - this.color.v) * percent) + this.color.v;
		this.stepCount++;
	}
}

nopixel.on('ready', function() {
	//Clear the board
	nopixel.clear();
	nopixel.update();
	//Start everything
	Board = new Array(BOARD_SIZE);

	for(var i =0; i < BOARD_SIZE; i++) {
		Board[i] = new Color(FPS, parseInt(Math.random() * (10000 - 500) + 500));
		// Board[i] = new Color(FPS, 1000);
	}

	setInterval(function() {
	 	Board.forEach(function(el, i, array) {
	 		el.step();
	 		nopixel.setPixel(i%7, parseInt(i/7), el.export());
	 	})
	 	nopixel.update();
	}, 1000/FPS); 
})
	
nopixel.on('pressed', function(eventDetail) {
	if(Board[eventDetail.index].pause) {
		Board[eventDetail.index].pause = false;
	} else {
		Board[eventDetail.index].pause = true;
	}
})

nopixel.on('pressed', function(eventDetail) {
	if(Board[eventDetail.index].off) {
		Board[eventDetail.index].off = false;
		Board[eventDetail.index].pause = false;
	} else {
		Board[eventDetail.index].off = true;
	}
})