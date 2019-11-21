# view-board


For our very own [AnyPixel.js](http://googlecreativelab.github.io/anypixel/) board
=========

## Architecture

Project uses a Teensy 3.2 board to control the WS2812 LED strip and buttons, using serial data to communicate. 


## Install

To install the library, simply type this into your nearest console: 
```js
npm install nopixel
```

At this point, depending on the distribution, you may note that your computer is slightly unhappy. This is due to the fact that `nopixel` relies on `serialport` to get access to, well, the serial port. `serialport` however, relies on `node-gyp` which is notoriously hard to build. Therefore I recommend you go to https://github.com/nodejs/node-gyp#installation for your troubleshooting needs.

If installation of `nopixel` still fails, please run 
```js
npm install serialport
```

## Usage

- Flash the firmware found in `firmware/arduino_firmware` to the Teensy. For this you will need to install [Teensyduino](https://www.pjrc.com/teensy/teensyduino.html)
- Create a `config.json` following this template
	```json
	[{
		"comPort": "/name/of/comPort",
		"baudRate": "BAUD_RATE"
	}]
	```
- Run `node app.js` for the example app

### Canvas support

This module supports `node-canvas`. Simply create a 7x7 canvas, then export it to the board using 
```js
	var data = ctx.getImageData(0,0,7,7);
	nopixel.fromCanvas(data);
	nopixel.update();
```
For a working example, look into examples/ConnectFour

### API

#### Events

All nopixel events, with the exception of `ready`, sends back an object `eventDetail` with the coordinates of the button press in the form of 

```js
var eventDetail = {
	x: 	X-coordinate of the button press (0-6),
	y: 	Y-coordinate of the button press (0-6),
	index: 	Index of the button press (0-48)
}
```

#### `.on('ready')`

Emits when established a connection with the board. Throws an error otherwise.

#### `.on('clicked')`

Emits when a button is pressed quickly - aka 'onButtonDown'. Pass an `eventDetail` object.

#### `.on('pressed')`

Emits when a button is held down. Pass an `eventDetail` object.

#### `.on('released')`

Emits when a button is released - aka 'onButtonUp'. Pass an `eventDetail` object.

#### `.on('idle')`

Emits the default state, when nothing is happening. Pass an `eventDetail` object.

#### Functions

#### `.setPixel()`

```js
nopixel.setPixel(x, y, colorObj)
```

Where x,y denotes the coordinates on the board (0-6), and colorString is a valid `tinyColor2` object. Examples includes string input (`"black"`, `"f0f0f6"`, `"rgb (255, 0, 0)"`, `"hsla(0, 100%, 50%, .5)"`), or RGB/RGBA/HSL/HSLA/HSV/HSVA objects (`{ h: 0, s: 1, l: .5 }`)

#### `.update()`

```js
nopixel.update()
```

aka `render`. Pushes and set all changes to LEDs at the same time. This prevents multiple refresh calls to the board and saves clock cycles.

#### `.clear()`

```js
nopixel.clear()
```

Sets all pixels to black, essentially turning them off.

#### `.fromCanvas()`

```js
nopixel.fromCanvas(canvasBuffer)
```

`node-canvas` integration. Takes in a Canvas buffer and send it to the LEDs.

#### `.write()`

```js
nopixel.write(string, colorObj, scrollSpeed)
```

One of the two text writing functions. `.write()` is used for anything more than a single letter, and will scroll the text in `string`, in color `colorObj`, looping indefinitely at a speed (delay between updates) `scrollSpeed`. 

Passes back a `setInterval` object. To stop scrolling use the built-in `clearInterval()`.

For more information check out the `TextDisplay` example.

#### `.writeLetter()`

```js
nopixel.writeLetter(letter, colorObj, x, y)
```

The other text writing function. As opposed to `.write()`, `.writeLetter()` as the name suggests, only prints one `letter` at a time, in color `colorObj`, starting at coordinates `x` `y`.

Fonts configuration is stored in `letters.json` as two-dimentional arrays, with 1 as filled, and 2 as unfilled - feel free to change them as you see fit.

### Opcodes

See `commands.md`

## Future work

[ ] Emulator

[ ] Make an even bigger one!

[ ] Use pre-wired WS2812 instead of manually soldering wires

[ ] Utility buttons?

[ ] Flushed USB port

[ ] getPixelData() function
