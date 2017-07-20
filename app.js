var Nopixel = require('nopixel');
//Set the configuration
var nopixel = new Nopixel("./config.json");
//Start everything
nopixel.start();
console.log("Quick sanity check");
//Test the first 14 lights
// nopixel.test(14) ;

// For testing purposes: Every button press will assign a different button color.
nopixel.on('buttonPressed', function (pressIndex) {
	console.log("Received button press: " + pressIndex);
	var randomColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	console.log(randomColor);
	nopixel.setPixel(pressIndex, randomColor);
})