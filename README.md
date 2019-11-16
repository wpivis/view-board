# view-board
For our very own [AnyPixel.js](http://googlecreativelab.github.io/anypixel/) board
=========

## Architecture

Project uses a Teensy 2.0 board to control the WS2812 LED strip and buttons, using serial data to communicate.

## Usage

- Flash the firmware found in `firmware/arduino_firmware` to the Teensy
- Create a `config.json` following this template
	```
	[{
		"comPort": "/name/of/comPort",
		"baudRate": BAUD_RATE
	}]
	```
- Run `node app.js` for the example app

### Canvas support

This module supports `node-canvas`. Simply create a 7x7 canvas, then export it to the board using 
```
	var data = ctx.getImageData(0,0,7,7);
	nopixel.fromCanvas(data);
	nopixel.update();
```
For a working example, look into examples/ConnectFour

### API

The button matrix can emit 4 different events: `clicked` (for quick button presses), `pressed` (for long presses), `released` (on release), and `idle` (not pressed). Each event will emit an `eventDetail` object that contains the x-y coordinates and index (0-48) of the corresponding button. 

To control the LEDs, users can use `setPixel(x, y, colorString)` where `(x,y)` represents the coordinates of the LED on the board, and `colorString` is a string that denotes color, based on the helpful `tinycolor2` library. 

Note that the LEDs are not updated automatically, but rather manually by calling `update()` which will push all changes to the board. This reduces the number of individual changes which can cause flickering and overcrowd the pipeline.

__Nopixel__ also supports canvas using the `node-canvas` library. Just create a valid canvas, make changes to it then use `fromCanvas(canvasData)`, with canvasData the canvas object. 

To clear all LEDs, call `clear()`.

### Commands Manual

See `commands.md`

## Future work

[ ] Emulator
[ ] Make an even bigger one!
[ ] Use pre-wired WS2812 instead of manually soldering wires
[ ] Utility buttons?
[ ] Flushed USB port
[ ] getPixelData() function