# Wokwi Representative Circuit

This folder contains a one-room concept simulation for the required hardware/electrical schematic.

It models the Drawing Room with:

- ESP32 controller
- Five relay channels
- Two fan loads
- Three light loads
- Five low-voltage switch/sense inputs
- Optional current-sensing concept documented in `docs/hardware-schematic.md`

## Pin Mapping

| Device | Relay GPIO | Sense GPIO | Rated Watts |
|---|---:|---:|---:|
| Fan 1 | 16 | 32 | 60W |
| Fan 2 | 17 | 33 | 60W |
| Light 1 | 18 | 25 | 15W |
| Light 2 | 19 | 26 | 15W |
| Light 3 | 21 | 27 | 15W |

## Notes

The Wokwi LEDs represent controlled AC loads. In real hardware, fans and lights would be mains loads controlled through certified relay/contactor modules with proper isolation, fusing, and enclosure safety. Sense inputs should use opto-isolation or a safe low-voltage wall-switch feedback circuit.
