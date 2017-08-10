#include "FastLED.h"
#include <Keypad.h>

#define NUM_LEDS 49
#define DATA_PIN PIN_F1
#define BAUD_RATE 115200

CRGB leds[NUM_LEDS];

const byte ROWS = 7; //four rows
const byte COLS = 7; //three columns
char keys[ROWS][COLS] = {
  {0, 7, 14, 21, 28, 35, 42},
  {1, 8, 15, 22, 29, 36, 43},
  {2, 9, 16, 23, 30, 37, 44},
  {3, 10, 17, 24, 31, 38, 45},
  {4, 11, 18, 25, 32, 39, 46},
  {5, 12, 19, 26, 33, 40, 47},
  {6, 13, 20, 27, 34, 41, 48}
};
byte colPins[COLS] = {PIN_D0, PIN_D1, PIN_D2, PIN_D3, PIN_D4, PIN_D5, PIN_D6}; //connect to the row pinouts of the keypad
byte rowPins[ROWS] = {PIN_B0, PIN_B1, PIN_B2, PIN_B3, PIN_B4, PIN_B5, PIN_B6}; //connect to the column pinouts of the keypad

Keypad kpd = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );

const byte numChars = 152;
char receivedChars[numChars];

boolean newData = false;

void setup() {
  Serial.begin(BAUD_RATE);
  kpd.setDebounceTime(1);
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
}

unsigned long loopCount = 0;
unsigned long startTime = millis();
byte msg = 99;

//int incomingByte;

void loop() {
  loopCount++;
  if ( (millis() - startTime) > 1000 ) {
    //      Serial.println(loopCount);
    startTime = millis();
    loopCount = 0;
  }

  // Fills kpd.key[ ] array with up-to 10 active keys.
  // Returns true if there are ANY active keys.
  if (kpd.getKeys()) {
    for (int i = 0; i < LIST_MAX; i++) // Scan the whole key list.
    {
      if ( kpd.key[i].stateChanged )   // Only find keys that have changed state.
      {
        switch (kpd.key[i].kstate) {  // Report active key state : IDLE, PRESSED, HOLD, or RELEASED
          case PRESSED:
            msg = 0;
//            leds[kpd.key[i].kchar] = CHSV(random8(), 255, 255);
            break;
          case HOLD:
            msg = 1;
//            leds[kpd.key[i].kchar] = CRGB::Black;
            break;
          case RELEASED:
            msg = 2;
            //                leds[kpd.key[i].kchar] = CRGB::Black;
            break;
          case IDLE:
            msg = 3;
        }
        //        Serial.print("Key ");
        byte message[] = {19, 3, 99, 99, 99};
        message[2] = kpd.key[i].kchar;
        message[3] = msg;
        message[4] = 256 - 19 - 3 - kpd.key[i].kchar - msg;
        Serial.write(message, 5);
      }
    }
  }

    recvWithStartEndMarkers();
    parseCommand();
}


void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = 128;
    char endMarker = 173;
    char rc;
 
 // This command is blocking - fix it???
 // Fixed it - haven't tested if any packets are lost this way..
    if (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void parseCommand() {
    if (newData) {
        // Command would be stored in receivedChars[]
        switch (receivedChars[0]) {
          case 104: //Set a specific pixel to a color. First bit is pixel address, next 3 bits are RGB values.
          leds[receivedChars[1]].r = receivedChars[2];
          leds[receivedChars[1]].g = receivedChars[3];
          leds[receivedChars[1]].b = receivedChars[4];
          break;

          case 105: //Refresh
          FastLED.show();
          break;

          case 106: //Clear
          fill_solid(leds, NUM_LEDS, CRGB::Black);
          break;

          case 107: //Set multiple LEDs
          // For crying out loud someone please implement a safety check please and thank you.
          for (int i=0; i<49; i++) {
            leds[i].r = receivedChars[i*3+3];
            leds[i].g = receivedChars[i*3+4];
            leds[i].b = receivedChars[i*3+5];
          Serial.print(receivedChars[i*3+3], DEC);
          Serial.print(" ");
          Serial.print(receivedChars[i*3+4], DEC);
          Serial.print(" ");
          Serial.print(receivedChars[i*3+5], DEC);
          Serial.println();            
          }
          break;
        }
        newData = false;
    }
}


