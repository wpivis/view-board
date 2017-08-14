var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.1.10:1883');
var Color = require('tinycolor2');

const BOARD_SIZE = 49;

var colors = new Array(BOARD_SIZE).fill(Color.random().toRgb());

var counter = 0;
for (var i=0;i<7;i++) {
	for (var j=0;j<7;j++) {
		nopixel.setPixel(i,j,colors[counter])
		counter++;
	}
}

nopixel.on('click', function(event) {
	var color = colors[event.index];
	client.publish("/esp/strip", new Buffer.from([color.r, color.g, color.b]));	
})

