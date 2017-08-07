var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");
const fps = 4;

var Snake = function(x, y, length) {

}

var Board = function(height, length) {
	var self = this;
	self.height = height;
	self.length = length;

	self.spawnDot = function() {
		// Spawn a new dot somewhere on the board
		return;
	}
	
}