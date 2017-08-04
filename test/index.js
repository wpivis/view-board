var SerialPort = require('serialport');
const MANUFACTURER = 'Teensyduino';
var comPort = '/dev/ttyACM0'; 
var port = new SerialPort(comPort, {baudrate: 9600});

//Parsing button events
port.on('data', function(data) {
	// Split data into event buffers
	// Since multiple button presses can be sent in one data chunk
	// console.log("=========\n Received data: \n", data);
	// console.log(parsePackets(data));
	var packets = parsePackets(data);
	if (packets.length != 0) {
		packets.forEach(function(el) {
			switch(el[1]) {
				case 0: //Pressed
					setPixel(el[0], 255,255,255);
					break;
				case 1:
					setPixel(el[0], 0,255,0);
					break;
				case 2:
					setPixel(el[0], 0,0,0);
					break;
			}
		})
	} else console.log("Not meaningful data, discarding..");

});

function parsePackets(data) {
	var packetArray = [];
	for (i=0;i<data.length-1;i++) {
		if (data[i] == 0x13) {
			var packetLength = data[i+1] + 2;
			console.log("Found a command, " + packetLength + " bits long");

			//Checksum
			var sum = 0;
			// this gonna hurt performance on large data streams..
			// but prob not that significant
			for(j=i;j<i+packetLength-1;j++) {
				sum += data[j];
			}
			
			//If valid, add to array
			if (sum + data[i+packetLength-1] == 256) {
				console.log("Valid packet, adding to packet array.");
				var tempBuffer = new Buffer(packetLength-3);
				// Strip header, n-bytes and checksum since we don't need them anymore
				data.copy(tempBuffer, 0, i+2, i+packetLength-1);
				console.log(tempBuffer);
				packetArray.push(tempBuffer);
			} else console.log("Invalid/Corrupted packet. Discarding..");
		}
	}

	//Array of packets, each starts with a header and ends with checksum 
	return packetArray;
}

function setPixel(pixelAddress, R, G, B) {
	// !TODO: Replace RGB values with a color object	
	port.write(new Buffer.from([128,104,pixelAddress,R,G,B,173]), function(err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
	});

}

/* THOUGHTS AND DESIGN DECISIONS 
=================================

- Use of commands (send to Teensy)
	- setPixel(color, pixel #) 	// set one pixel, refresh board
	- getPixels()				// ask Teensy to send back LED status
	- setBoard(color) 			// set the whole board, refresh
	- refresh()					// refresh for no reasons whatsoever
	- reset() 					// full reset everything
	- changeBaudRate(baudRate) 	// change baud rate from default (necessary???)
	- preset(PRESET_MACRO) 		// switch to auto/idle mode

- Information sent to NodeJS
	- Button events
		- Pressed
		- Released
		- Hold
		- Idle (?)
	- getPixels()
		- Buffer containing LEDs status
*/