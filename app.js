var Nopixel = require('nopixel');
//Set the configuration
var nopixel = new Nopixel("./config.json");
//Clear the board
nopixel.clear();
nopixel.update();
//Start everything
console.log("Quick sanity check");

// 16 Color wheel
var colors = ["white", "red", "lime", "blue", "yellow", "cyan", "magenta", "silver", "gray", "maroon", "olive", "green", "purple", "teal", "navy", "black"];
var counter = new Array(49).fill(0);

// For testing purposes: Every button press will assign a different button color.
nopixel.on('clicked', function (eventDetail) {
	console.log("Received button press: " + eventDetail.index);
	console.log("x: " + eventDetail.x + ", y: " + eventDetail.y);

	counter[eventDetail.index]++;
	if (counter[eventDetail.index] > 16) {
		counter[eventDetail.index]=0;
	}

	var count = counter[eventDetail.index];
	var color = colors[count];
	console.log("Counter: " + count + ", Color: " + color);

	nopixel.setPixel(eventDetail.x, eventDetail.y, color);
	nopixel.update();
})

nopixel.on('pressed', function (eventDetail) {
	counter[eventDetail.index] = 15;

	nopixel.setPixel(eventDetail.x, eventDetail.y, colors[counter[eventDetail.index]]);
	nopixel.update();
});