# Serial Command manual

## To Teensy

- Start bit: 128
- End bit: 173
- [Start bit] [Header] [Data] [End bit] 
- No checksum (???)

### Setting Pixel
- Opcode: 104
- [Start bit] [104] [PixelIndex] [R] [G] [B] [End bit]

### Update LED
- Opcode: 105
- [Start bit] [105] [End bit]

## From Teensy

- [Start bit] [n-byte] [Data] [Checksum]
- [n-byte] = number of bytes from Data to Checksum, inclusively
- Checksum following Fletcher-8: Sum(Start bit, n-byte, data, checksum) & 0xFF = 1

### Button Events
- Opcode: 19 (0x13)
- [0x13] [3] [ButtonIndex] [ButtonStatus] [Checksum]
