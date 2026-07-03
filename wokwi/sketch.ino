struct DevicePin {
  const char* id;
  const char* room;
  const char* type;
  uint8_t relayPin;
  uint8_t sensePin;
  uint16_t ratedWatts;
};

DevicePin devices[] = {
  { "drawing-room-fan-1", "drawing-room", "fan", 16, 32, 60 },
  { "drawing-room-fan-2", "drawing-room", "fan", 17, 33, 60 },
  { "drawing-room-light-1", "drawing-room", "light", 18, 25, 15 },
  { "drawing-room-light-2", "drawing-room", "light", 19, 26, 15 },
  { "drawing-room-light-3", "drawing-room", "light", 21, 27, 15 },
};

void setup() {
  Serial.begin(115200);

  for (DevicePin device : devices) {
    pinMode(device.relayPin, OUTPUT);
    pinMode(device.sensePin, INPUT_PULLUP);
    digitalWrite(device.relayPin, LOW);
  }
}

void loop() {
  uint16_t totalWatts = 0;

  Serial.println("{\"room\":\"drawing-room\",\"devices\":[");

  for (size_t i = 0; i < sizeof(devices) / sizeof(devices[0]); i++) {
    DevicePin device = devices[i];
    bool isOn = digitalRead(device.sensePin) == LOW;
    digitalWrite(device.relayPin, isOn ? HIGH : LOW);

    uint16_t watts = isOn ? device.ratedWatts : 0;
    totalWatts += watts;

    Serial.print("  {\"id\":\"");
    Serial.print(device.id);
    Serial.print("\",\"type\":\"");
    Serial.print(device.type);
    Serial.print("\",\"status\":\"");
    Serial.print(isOn ? "on" : "off");
    Serial.print("\",\"watts\":");
    Serial.print(watts);
    Serial.print("}");
    Serial.println(i == 4 ? "" : ",");
  }

  Serial.print("],\"totalWatts\":");
  Serial.print(totalWatts);
  Serial.println("}");
  delay(2500);
}
