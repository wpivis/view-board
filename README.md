# view-board
For our very own [AnyPixel.js](http://googlecreativelab.github.io/anypixel/) board
=========

## Architecture

Project uses a Teensy 2.0 board to control the WS2812 LED strip and buttons, using serial data to communicate.

## Usage

- Flash the firmware found in `firmware/arduino_firmware` to the Teensy
- Create a `config.json` following this template
	[{
		"comPort": "/name/of/comPort",
		"baudRate": BAUD_RATE
	}]
- Run `node app.js` for the example app

### Canvas support

This module supports `node-canvas`. Simply create a 7x7 canvas, then export it to the board using 
```
	var data = ctx.getImageData(0,0,7,7);
	nopixel.fromCanvas(data);
	nopixel.update
```
For a working example, look into examples/ConnectFour

### Commands Manual

See `commands.md`

## Future work

- Emulator
- Make an even bigger one!
- Use pre-wired WS2812 instead of manually soldering wires
- Utility buttons?
- Flushed USB port
- getPixelData() function
- Hardware problem with Pixel #8
