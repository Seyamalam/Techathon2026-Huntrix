"use client"

import type { CSSProperties } from "react"

import type { Device, RoomId, RoomSummary } from "@/lib/energy-simulator"

type Point = {
  x: number
  y: number
}

type FanPosition = Point & {
  id: string
  label: string
}

type LightPosition = Point & {
  id: string
  label: string
}

const roomMeta: Record<
  RoomId,
  {
    x: number
    y: number
    width: number
    height: number
    label: string
    floor: string
    fans: FanPosition[]
    lights: LightPosition[]
  }
> = {
  "drawing-room": {
    x: 36,
    y: 48,
    width: 330,
    height: 418,
    label: "Drawing Room",
    floor: "#f4ead5",
    fans: [
      { id: "drawing-room-fan-1", label: "Fan 1", x: 206, y: 114 },
      { id: "drawing-room-fan-2", label: "Fan 2", x: 210, y: 356 },
    ],
    lights: [
      { id: "drawing-room-light-1", label: "Light 1", x: 118, y: 112 },
      { id: "drawing-room-light-2", label: "Light 2", x: 296, y: 112 },
      { id: "drawing-room-light-3", label: "Light 3", x: 202, y: 416 },
    ],
  },
  "work-room-1": {
    x: 376,
    y: 48,
    width: 300,
    height: 418,
    label: "Work Room 1",
    floor: "#eef0ed",
    fans: [
      { id: "work-room-1-fan-1", label: "Fan 1", x: 526, y: 114 },
      { id: "work-room-1-fan-2", label: "Fan 2", x: 526, y: 346 },
    ],
    lights: [
      { id: "work-room-1-light-1", label: "Light 1", x: 444, y: 112 },
      { id: "work-room-1-light-2", label: "Light 2", x: 610, y: 112 },
      { id: "work-room-1-light-3", label: "Light 3", x: 524, y: 414 },
    ],
  },
  "work-room-2": {
    x: 686,
    y: 48,
    width: 330,
    height: 418,
    label: "Work Room 2",
    floor: "#ead3b4",
    fans: [
      { id: "work-room-2-fan-1", label: "Fan 1", x: 850, y: 114 },
      { id: "work-room-2-fan-2", label: "Fan 2", x: 850, y: 346 },
    ],
    lights: [
      { id: "work-room-2-light-1", label: "Light 1", x: 760, y: 112 },
      { id: "work-room-2-light-2", label: "Light 2", x: 936, y: 112 },
      { id: "work-room-2-light-3", label: "Light 3", x: 850, y: 414 },
    ],
  },
}

function findDevice(rooms: RoomSummary[], id: string) {
  return rooms
    .flatMap((room) => room.devices)
    .find((device) => device.id === id)
}

function fanSpeed(device?: Device) {
  if (!device || device.status === "off") {
    return 0
  }

  const runtimeBoost = Math.min(device.minutesInCurrentState / 120, 0.45)
  const loadBoost = Math.min(device.watts / 120, 0.5)
  return Number((1.25 - runtimeBoost - loadBoost).toFixed(2))
}

export function OfficeLayoutSvg({ rooms }: { rooms: RoomSummary[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <svg
        role="img"
        aria-label="Live top-view office layout"
        viewBox="0 0 1120 660"
        className="h-auto w-full"
      >
        <defs>
          <pattern
            id="tile"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.6"
            />
          </pattern>
          <filter
            id="light-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="window-glass" x1="0" x2="1">
            <stop stopColor="#d5f7ff" />
            <stop offset="1" stopColor="#8cc8d8" />
          </linearGradient>
        </defs>

        <rect width="1120" height="660" rx="24" fill="hsl(var(--background))" />
        <rect
          x="24"
          y="36"
          width="1004"
          height="552"
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.72"
          strokeWidth="12"
        />
        <rect
          x="36"
          y="466"
          width="980"
          height="110"
          fill="#f0e8d8"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.55"
          strokeWidth="5"
        />
        <text
          x="518"
          y="632"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          ENTRY
        </text>
        <path
          d="M518 592v28m0-28-12 14m12-14 12 14"
          stroke="hsl(var(--foreground))"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {(Object.keys(roomMeta) as RoomId[]).map((roomId) => (
          <RoomSvg
            key={roomId}
            room={rooms.find((room) => room.id === roomId)}
            meta={roomMeta[roomId]}
            rooms={rooms}
          />
        ))}

        <Wall x={366} y={42} height={430} />
        <Wall x={676} y={42} height={430} />
        <Door x={284} y={466} flip />
        <Door x={392} y={466} />
        <Door x={706} y={466} />
        <Door x={492} y={576} rotate />
        <Window x={142} y={38} />
        <Window x={446} y={38} />
        <Window x={752} y={38} />
        <Window x={1018} y={276} vertical />
        <Window x={28} y={160} vertical />

        <Legend />
      </svg>
    </div>
  )
}

function RoomSvg({
  room,
  meta,
  rooms,
}: {
  room?: RoomSummary
  meta: (typeof roomMeta)[RoomId]
  rooms: RoomSummary[]
}) {
  return (
    <g>
      <rect
        x={meta.x}
        y={meta.y}
        width={meta.width}
        height={meta.height}
        fill={meta.floor}
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.65"
        strokeWidth="5"
      />
      <rect
        x={meta.x}
        y={meta.y}
        width={meta.width}
        height={meta.height}
        fill="url(#tile)"
        opacity="0.42"
      />
      <text
        x={meta.x + meta.width / 2}
        y={meta.y + meta.height / 2}
        textAnchor="middle"
        className="fill-foreground text-xl font-bold uppercase"
      >
        {meta.label}
      </text>
      <text
        x={meta.x + meta.width / 2}
        y={meta.y + meta.height / 2 + 28}
        textAnchor="middle"
        className="fill-muted-foreground text-sm font-medium"
      >
        {room?.activeDevices ?? 0} active · {room?.totalWatts ?? 0}W
      </text>

      {meta.lights.map((light) => (
        <LightSvg
          key={light.id}
          position={light}
          device={findDevice(rooms, light.id)}
        />
      ))}
      {meta.fans.map((fan) => (
        <FanSvg
          key={fan.id}
          position={fan}
          device={findDevice(rooms, fan.id)}
        />
      ))}

      {meta.label === "Drawing Room" ? (
        <DrawingRoomFurniture />
      ) : (
        <WorkRoomFurniture x={meta.x} y={meta.y} />
      )}
    </g>
  )
}

function LightSvg({
  position,
  device,
}: {
  position: LightPosition
  device?: Device
}) {
  const on = device?.status === "on"

  return (
    <g>
      {on ? (
        <circle
          cx={position.x}
          cy={position.y}
          r="38"
          fill="#ffe68a"
          opacity="0.4"
          filter="url(#light-glow)"
        />
      ) : null}
      <circle
        cx={position.x}
        cy={position.y}
        r="17"
        fill={on ? "#ffe66d" : "#31343a"}
        stroke={on ? "#9a7a19" : "#73777f"}
        strokeWidth="3"
        opacity={on ? 1 : 0.42}
      />
      <title>
        {position.label}: {device?.status ?? "unknown"}
      </title>
    </g>
  )
}

function FanSvg({
  position,
  device,
}: {
  position: FanPosition
  device?: Device
}) {
  const speed = fanSpeed(device)
  const spinning = speed > 0
  const style = {
    animation: spinning ? `office-fan-spin ${speed}s linear infinite` : "none",
    transformBox: "fill-box",
    transformOrigin: "center",
  } satisfies CSSProperties

  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      <g style={style}>
        <path
          d="M0 -8 C18 -42 46 -38 56 -24 C40 -15 23 -10 7 -4Z"
          fill={spinning ? "#6b4a22" : "#504338"}
          stroke="#2e2116"
          strokeWidth="3"
        />
        <path
          d="M7 4 C46 8 62 30 56 48 C36 46 18 30 2 9Z"
          fill={spinning ? "#6b4a22" : "#504338"}
          stroke="#2e2116"
          strokeWidth="3"
        />
        <path
          d="M-7 4 C-46 8 -62 30 -56 48 C-36 46 -18 30 -2 9Z"
          fill={spinning ? "#6b4a22" : "#504338"}
          stroke="#2e2116"
          strokeWidth="3"
          transform="rotate(120)"
        />
      </g>
      <circle r="14" fill="#5a3716" stroke="#2e2116" strokeWidth="3" />
      <line
        x1="0"
        y1="12"
        x2="0"
        y2="48"
        stroke="#5a3716"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <title>
        {position.label}: {device?.status ?? "unknown"}{" "}
        {spinning ? `· ${speed}s rotation` : ""}
      </title>
    </g>
  )
}

function Wall({ x, y, height }: { x: number; y: number; height: number }) {
  return (
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y + height}
      stroke="hsl(var(--foreground))"
      strokeOpacity="0.7"
      strokeWidth="10"
    />
  )
}

function Door({
  x,
  y,
  flip = false,
  rotate = false,
}: {
  x: number
  y: number
  flip?: boolean
  rotate?: boolean
}) {
  const transform = rotate
    ? `translate(${x} ${y}) rotate(90)`
    : `translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`

  return (
    <g
      transform={transform}
      stroke="hsl(var(--foreground))"
      strokeOpacity="0.55"
      strokeWidth="3"
      fill="none"
    >
      <path d="M0 0 V52 H52" />
      <path d="M0 52 A52 52 0 0 1 52 0" />
    </g>
  )
}

function Window({
  x,
  y,
  vertical = false,
}: {
  x: number
  y: number
  vertical?: boolean
}) {
  return (
    <rect
      x={x}
      y={y}
      width={vertical ? 14 : 72}
      height={vertical ? 72 : 14}
      rx="3"
      fill="url(#window-glass)"
      stroke="hsl(var(--foreground))"
      strokeOpacity="0.45"
      strokeWidth="2"
    />
  )
}

function DrawingRoomFurniture() {
  return (
    <g opacity="0.84">
      <rect
        x="66"
        y="204"
        width="44"
        height="164"
        rx="8"
        fill="#d6c4a8"
        stroke="#82735f"
        strokeWidth="3"
      />
      <rect
        x="138"
        y="248"
        width="128"
        height="126"
        fill="#d5c2a3"
        opacity="0.75"
      />
      <rect
        x="162"
        y="272"
        width="46"
        height="80"
        fill="#9b744a"
        stroke="#6e5133"
        strokeWidth="3"
      />
      <rect
        x="78"
        y="398"
        width="62"
        height="42"
        rx="10"
        fill="#d6c4a8"
        stroke="#82735f"
        strokeWidth="3"
        transform="rotate(24 108 419)"
      />
      <Plant x={70} y={82} />
      <Plant x={314} y={430} />
      <Plant x={70} y={516} />
    </g>
  )
}

function WorkRoomFurniture({ x, y }: { x: number; y: number }) {
  const desks = [
    [x + 42, y + 156],
    [x + 220, y + 156],
    [x + 42, y + 318],
    [x + 220, y + 318],
  ]

  return (
    <g opacity="0.86">
      {desks.map(([deskX, deskY], index) => (
        <g key={`${deskX}-${deskY}`}>
          <rect
            x={deskX}
            y={deskY}
            width="82"
            height="54"
            fill="#c99a5f"
            stroke="#815c34"
            strokeWidth="3"
          />
          <rect
            x={deskX + 20}
            y={deskY + 14}
            width="36"
            height="14"
            rx="2"
            fill="#30343a"
          />
          <rect
            x={deskX + 18}
            y={deskY + 34}
            width="42"
            height="10"
            rx="2"
            fill="#30343a"
          />
          <rect
            x={deskX + 26}
            y={deskY - 22}
            width="32"
            height="20"
            rx="5"
            fill="#34383d"
            opacity="0.8"
          />
          {index % 2 === 0 ? (
            <Plant x={deskX + 12} y={deskY + 36} small />
          ) : null}
        </g>
      ))}
    </g>
  )
}

function Plant({
  x,
  y,
  small = false,
}: {
  x: number
  y: number
  small?: boolean
}) {
  const scale = small ? 0.58 : 1

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ellipse
          key={index}
          cx="0"
          cy="-16"
          rx="7"
          ry="18"
          fill="#5e8b3e"
          stroke="#42642f"
          strokeWidth="2"
          transform={`rotate(${index * 45})`}
        />
      ))}
      <circle r="8" fill="#6b8f43" />
    </g>
  )
}

function Legend() {
  return (
    <g transform="translate(1048 58)">
      <rect
        x="0"
        y="0"
        width="58"
        height="246"
        rx="12"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
      />
      <text
        x="29"
        y="28"
        textAnchor="middle"
        className="fill-foreground text-xs font-bold"
      >
        LIVE
      </text>
      <FanSvg
        position={{ id: "legend-fan", label: "Fan", x: 28, y: 66 }}
        device={{
          id: "legend-fan",
          name: "Fan",
          type: "fan",
          roomId: "drawing-room",
          roomName: "Legend",
          status: "on",
          watts: 60,
          ratedWatts: 60,
          lastChanged: "",
          onSince: "",
          minutesInCurrentState: 45,
        }}
      />
      <text
        x="29"
        y="134"
        textAnchor="middle"
        className="fill-muted-foreground text-[10px]"
      >
        fan
      </text>
      <LightSvg
        position={{ id: "legend-light", label: "Light", x: 29, y: 170 }}
        device={{
          id: "legend-light",
          name: "Light",
          type: "light",
          roomId: "drawing-room",
          roomName: "Legend",
          status: "on",
          watts: 15,
          ratedWatts: 15,
          lastChanged: "",
          onSince: "",
          minutesInCurrentState: 20,
        }}
      />
      <text
        x="29"
        y="214"
        textAnchor="middle"
        className="fill-muted-foreground text-[10px]"
      >
        light
      </text>
    </g>
  )
}
