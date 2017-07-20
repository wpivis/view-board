# view-board
For our very own [AnyPixel.js](http://googlecreativelab.github.io/anypixel/) board

## Architecture

Project use Arduino to control WS2812 LED strip(s) and buttons, using Firmata firmware, and [Johnny Five framework](http://johnny-five.io/). 

Currently the Johnny Five Framework is running on a Node server that continuously sends button data (currently to stdout), and enable setting LED status with a POST request.

## Roadmap

- Add configurations
- Fix the hacky part
- Test/Modify the code to work with 2x2 and 4x4 before moving on to 7x7
- Use Socket.IO