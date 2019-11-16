var Nopixel = require('nopixel');
var tinyColor = require("tinycolor2");
//Set the configuration
var nopixel = new Nopixel("./config.json");

function Color(fps, duration) {
	this.duration = duration; //Duration in millisec
	this.fps = fps; 
	this.targetColor = undefined;
	this.color = undefined;
	this.pause = false;
	this.init = function() {
		this.color = tinyColor.random();
		getNewTarget();
	}

	this.getNewTarget = function() {
		while(targetColor == color && targetColor) {
			this.targetColor = tinyColor.random();
		}
	}

	//Transition to targetColor
	this.tick = function() {
		color.toRgb();
		targetColor.toRgb();

		if(pause) {
			return;
		}

		var distance = [];

	}
}

var color1 = new Color(60, 5000);

console.log(color1);

var i = 0;
nopixel.on('ready', function() {
	//Clear the board
	nopixel.clear();
	nopixel.update();
	//Start everything

	setInterval(function() {
		console.log(i);

		if(i == 49) {
			i = 0;
		}
		nopixel.clear();
		nopixel.update();	
		nopixel.setPixel(i%7, parseInt(i/7), "red");
		nopixel.update();
		i++;
	}, 50); 
})
	

nopixel.on('clicked', function() {
	i = 0;
})
