var Nopixel = require('nopixel');
//Set the configuration
var nopixel = new Nopixel("./config.json");
//Start everything
console.log("Quick sanity check");

var colors = ['#F00', '#0F0', '#00F'];

// For testing purposes: Every button press will assign a different button color.
nopixel.on('clicked', function (eventDetail) {
	console.log("Received button press: " + eventDetail.index);
	var randomColor = colors[Math.floor(Math.random() * 3)];
	console.log(randomColor);
	console.log(eventDetail.x, eventDetail.y);
	nopixel.setPixel(eventDetail.x, eventDetail.y, randomColor);
})

nopixel.on('pressed', function (eventDetail) {
	nopixel.setPixel(eventDetail.x, eventDetail.y, "black");
});