var Nopixel = require('../../node_modules/nopixel');
var nopixel = new Nopixel("../../config.json");

nopixel.on('ready', function() {
	nopixel.clear();
	var count = 9;
	var countdown = undefined;
	var write1 = undefined;

	countdown = setInterval(function() {
		nopixel.clear();
		if(count == 0) {
			clearInterval(countdown);
			nopixel.clear();
			write1 = nopixel.write("Welcome to the nopixel board!", "cyan", 300);
			nopixel.update();
		}
		nopixel.writeLetter(count.toString(), "red", 2,1);
		nopixel.update();
		count--;
	},1000);

	setTimeout(function() {
		clearInterval(write1);
	}, 20000)

})