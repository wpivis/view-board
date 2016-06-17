var five = require('johnny-five');
var pixel = require('node-pixel');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var board = new five.Board({repl: false});
var buttonPins = [3];
var strip = null;
var p = null;

var fps = 2;

//Super hacky way of setting LED color with POST requests
app.post('/led', function(req, res) {
	var colorDirective = req.body.colors;
	for (var i=0;i<req.body.length;i++) {
		var p = strip.pixel(i);
		p.color(req.body.colors[i]);
	}
	strip.show();
	res.sendStatus(200);
});

board.on("ready", function() {
	strip = new pixel.Strip({
		board: this,
		controller: "FIRMATA",
		data: 6,
		length: 1,
	});
	p = strip.pixel(0);
	//Init WS2812 Strip
	strip.on("ready", function() {
		console.log("Strip ready");
		p.color("magenta"); //Ready
		strip.show();
	})

	//Init buttons 
	var buttons = new five.Buttons({
		pins: buttonPins,
		isPullup: true //Could change this
	});

	//Send button data on set interval
	setInterval(function() {
		var buttonState = [];
		buttons.forEach(function(button){
			buttonState.push(button.value);
		})
		console.log(buttonState); //Replace this with node server comp.
	}, 1000/fps);
	
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});