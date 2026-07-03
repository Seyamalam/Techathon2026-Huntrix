export type CircuitDevice = {
  id: string
  name: string
  type: "fan" | "light"
  output: string
  sense: string
  ratedWatts: number
  relay: string
  y: number
  ledColor: string
}

export const hardwareDevices: CircuitDevice[] = [
  {
    id: "drawing-room-fan-1",
    name: "Fan 1",
    type: "fan",
    output: "GPIO 16",
    sense: "GPIO 32",
    ratedWatts: 60,
    relay: "CH1",
    y: 82,
    ledColor: "cyan",
  },
  {
    id: "drawing-room-fan-2",
    name: "Fan 2",
    type: "fan",
    output: "GPIO 17",
    sense: "GPIO 33",
    ratedWatts: 60,
    relay: "CH2",
    y: 162,
    ledColor: "cyan",
  },
  {
    id: "drawing-room-light-1",
    name: "Light 1",
    type: "light",
    output: "GPIO 18",
    sense: "GPIO 25",
    ratedWatts: 15,
    relay: "CH3",
    y: 242,
    ledColor: "yellow",
  },
  {
    id: "drawing-room-light-2",
    name: "Light 2",
    type: "light",
    output: "GPIO 19",
    sense: "GPIO 26",
    ratedWatts: 15,
    relay: "CH4",
    y: 322,
    ledColor: "yellow",
  },
  {
    id: "drawing-room-light-3",
    name: "Light 3",
    type: "light",
    output: "GPIO 21",
    sense: "GPIO 27",
    ratedWatts: 15,
    relay: "CH5",
    y: 402,
    ledColor: "yellow",
  },
]
