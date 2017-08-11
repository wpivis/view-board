# Serial Command Manual
=========

## To Teensy

- Start bit: 128
- End bit: 173
- [Start bit] [Header] [Data] [End bit] 
- No checksum (???)

### Setting Pixel
- Opcode: 104
- [Start bit] [104] [PixelIndex] [R] [G] [B] [End bit]

### Update LEDs
- Opcode: 105
- [Start bit] [105] [End bit]

### Clear LEDs
- Opcode: 106
- [Start bit] [106] [End bit]

### Setting multiple pixels
- Opcode: 107
- [Start bit] [107] [startPx] [endPx] [r1] [g1] [b1] .... [rn] [gn] [bn] [end bit]

## From Teensy

- [Start bit] [n-byte] [Data] [Checksum]
- [n-byte] = number of bytes from Data to Checksum, inclusively
- Checksum following Fletcher-8: Sum(Start bit, n-byte, data, checksum) & 0xFF = 1

### Button Events
- Opcode: 19 (0x13)
- [0x13] [3] [ButtonIndex] [ButtonStatus] [Checksum]
