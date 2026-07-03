# Hardware Schematic

The preliminary round does not require real hardware. A representative circuit for one room is enough, but it must make physical sense.

## Deliverables

- Static schematic export: [docs/assets/one-room-hardware-schematic.svg](assets/one-room-hardware-schematic.svg)
- Wokwi concept project: [wokwi/diagram.json](../wokwi/diagram.json)
- Wokwi sketch: [wokwi/sketch.ino](../wokwi/sketch.ino)

## Representative Room

The circuit models one room with:

- 2 fans
- 3 lights
- 1 ESP32 microcontroller
- 5 relay channels
- 5 isolated/safe state inputs
- Optional aggregate current sensing

The full office uses the same pattern three times: Drawing Room, Work Room 1, and Work Room 2.

## Controller

The representative design uses an ESP32 because it maps well to a real IoT system:

- Built-in Wi-Fi for telemetry.
- Enough GPIO for five devices in one room.
- Analog input for a current sensor such as ACS712.
- Easy Wokwi simulation support.

## Conceptual Design

The Wokwi circuit uses LEDs as safe representative loads. In real hardware, fans and lights would be AC mains devices controlled through certified relay modules or contactors. State sensing should be isolated from mains using opto-isolators or safe low-voltage wall-switch feedback.

## Pin Mapping

| Device | Relay GPIO | Sense GPIO | Rated Watts |
| --- | ---: | ---: | ---: |
| Fan 1 | 16 | 32 | 60W |
| Fan 2 | 17 | 33 | 60W |
| Light 1 | 18 | 25 | 15W |
| Light 2 | 19 | 26 | 15W |
| Light 3 | 21 | 27 | 15W |
| Current sensor | - | 34 | aggregate analog input |

## Connection List

- Connect each relay input to an ESP32 output pin.
- Connect each isolated switch/state output to an ESP32 digital input pin.
- Use pull-up resistors so inputs do not float.
- Connect all grounds together.
- In Wokwi, LEDs represent the final loads.
- In real hardware, relay load-side wiring must be isolated from the ESP32 side.
- Optionally route the room supply through an ACS712-style current sensor for aggregate current draw.

## Electrical Reasoning

GPIO pins should only sense or control low-current signals. Motors, relays, and real AC appliances should never be powered directly from a microcontroller pin. A practical real-world version would use isolated sensing or relay modules, proper protection, and qualified electrical review for mains wiring.
