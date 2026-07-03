"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { toast } from "sonner"
import {
  IconBulb,
  IconClockHour4,
  IconPlugConnected,
  IconPropeller,
  IconX,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatRelativeMinutes, formatTime } from "@/lib/format"
import type { Device, RoomId, RoomSummary } from "@/lib/energy-simulator"
import { cn } from "@/lib/utils"

type DevicePoint = {
  id: string
  label: string
  x: number
  y: number
}

type RoomBlueprint = {
  id: RoomId
  label: string
  centerX: number
  lights: DevicePoint[]
  fans: DevicePoint[]
}

const rooms: RoomBlueprint[] = [
  {
    id: "drawing-room",
    label: "Drawing Room",
    centerX: 160,
    lights: [
      { id: "drawing-room-light-1", label: "Light 1", x: 80, y: 90 },
      { id: "drawing-room-light-2", label: "Light 2", x: 240, y: 90 },
      { id: "drawing-room-light-3", label: "Light 3", x: 160, y: 330 },
    ],
    fans: [
      { id: "drawing-room-fan-1", label: "Fan 1", x: 160, y: 130 },
      { id: "drawing-room-fan-2", label: "Fan 2", x: 160, y: 250 },
    ],
  },
  {
    id: "work-room-1",
    label: "Work Room 1",
    centerX: 445,
    lights: [
      { id: "work-room-1-light-1", label: "Light 1", x: 350, y: 90 },
      { id: "work-room-1-light-2", label: "Light 2", x: 540, y: 90 },
      { id: "work-room-1-light-3", label: "Light 3", x: 445, y: 330 },
    ],
    fans: [
      { id: "work-room-1-fan-1", label: "Fan 1", x: 445, y: 130 },
      { id: "work-room-1-fan-2", label: "Fan 2", x: 445, y: 250 },
    ],
  },
  {
    id: "work-room-2",
    label: "Work Room 2",
    centerX: 735,
    lights: [
      { id: "work-room-2-light-1", label: "Light 1", x: 640, y: 90 },
      { id: "work-room-2-light-2", label: "Light 2", x: 830, y: 90 },
      { id: "work-room-2-light-3", label: "Light 3", x: 735, y: 330 },
    ],
    fans: [
      { id: "work-room-2-fan-1", label: "Fan 1", x: 735, y: 130 },
      { id: "work-room-2-fan-2", label: "Fan 2", x: 735, y: 250 },
    ],
  },
]

type DevicePlacement = {
  device: Device
  point: DevicePoint
  room: RoomBlueprint
}

function getDevice(allRooms: RoomSummary[], id: string) {
  return allRooms
    .flatMap((room) => room.devices)
    .find((device) => device.id === id)
}

function getFanDuration(device?: Device) {
  if (!device || device.status === "off") {
    return "0.9s"
  }

  const runtimeBoost = Math.min(device.minutesInCurrentState / 180, 0.35)
  const loadBoost = Math.min(device.watts / 180, 0.3)

  return `${Number((0.95 - runtimeBoost - loadBoost).toFixed(2))}s`
}

export function OfficeLayoutSvg({ rooms: liveRooms }: { rooms: RoomSummary[] }) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [hoveredDevice, setHoveredDevice] = useState<DevicePlacement | null>(
    null
  )
  const allDevices = useMemo(
    () => liveRooms.flatMap((room) => room.devices),
    [liveRooms]
  )

  function handleDeviceOpen(device: Device) {
    setSelectedDevice(device)
    toast(`${device.name} selected`, {
      description: `${device.roomName} is ${device.status.toUpperCase()} at ${device.watts}W.`,
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <svg
          role="img"
          aria-label="Live office IoT blueprint map"
          viewBox="0 0 900 480"
          className="h-auto w-full"
        >
          <defs>
            <radialGradient id="office-beam-glow" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor="var(--office-map-light-beam)"
                stopOpacity="0.36"
              />
              <stop
                offset="60%"
                stopColor="var(--office-map-light-beam)"
                stopOpacity="0.12"
              />
              <stop
                offset="100%"
                stopColor="var(--office-map-light-beam)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <rect width="900" height="480" fill="var(--office-map-bg)" />
          <BlueprintGrid />
          <Architecture />

          {rooms.map((room) => (
            <RoomLayer
              key={room.id}
              blueprint={room}
              liveRoom={liveRooms.find((item) => item.id === room.id)}
              liveRooms={liveRooms}
              selectedDeviceId={selectedDevice?.id}
              onDeviceOpen={handleDeviceOpen}
              onDeviceHover={setHoveredDevice}
            />
          ))}
          {hoveredDevice ? <DeviceHoverCard placement={hoveredDevice} /> : null}
        </svg>
      </div>
      <DeviceDetailSheet
        device={
          selectedDevice
            ? (allDevices.find((device) => device.id === selectedDevice.id) ??
              selectedDevice)
            : null
        }
        open={Boolean(selectedDevice)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDevice(null)
          }
        }}
      />
    </>
  )
}

function BlueprintGrid() {
  return (
    <g stroke="var(--office-map-grid)" strokeWidth="1">
      <path d="M0,60 H900 M0,120 H900 M0,180 H900 M0,240 H900 M0,300 H900 M0,360 H900 M0,420 H900" />
      <path d="M100,0 V480 M200,0 V480 M300,0 V480 M400,0 V480 M500,0 V480 M600,0 V480 M700,0 V480 M800,0 V480" />
    </g>
  )
}

function Architecture() {
  return (
    <>
      <g
        stroke="var(--office-map-wall)"
        strokeLinecap="round"
        strokeWidth="6"
        fill="none"
      >
        <path d="M 20 400 L 20 20 L 880 20 L 880 400 L 750 400 M 650 400 L 480 400 M 380 400 L 210 400 M 110 400 L 20 400" />
        <path d="M 300 20 L 300 400" />
        <path d="M 590 20 L 590 400" />
      </g>
      <g
        stroke="var(--office-map-detail)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      >
        <path d="M112 400 A88 88 0 0 1 200 312" />
        <path d="M382 400 A84 84 0 0 1 466 316" />
        <path d="M652 400 A84 84 0 0 1 736 316" />
        <path d="M480 400 A76 76 0 0 1 556 324" />
      </g>
      <g fill="var(--office-map-fixture)" stroke="var(--office-map-detail)">
        <rect x="40" y="120" width="30" height="140" rx="4" />
        <rect x="338" y="160" width="72" height="44" rx="4" />
        <rect x="482" y="160" width="72" height="44" rx="4" />
        <rect x="628" y="160" width="72" height="44" rx="4" />
        <rect x="772" y="160" width="72" height="44" rx="4" />
      </g>
    </>
  )
}

function RoomLayer({
  blueprint,
  liveRoom,
  liveRooms,
  selectedDeviceId,
  onDeviceOpen,
  onDeviceHover,
}: {
  blueprint: RoomBlueprint
  liveRoom?: RoomSummary
  liveRooms: RoomSummary[]
  selectedDeviceId?: string
  onDeviceOpen: (device: Device) => void
  onDeviceHover: (placement: DevicePlacement | null) => void
}) {
  return (
    <g>
      <text
        x={blueprint.centerX}
        y="50"
        fill="var(--office-map-label)"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2"
        textAnchor="middle"
      >
        {blueprint.label.toUpperCase()}
      </text>
      <text
        x={blueprint.centerX}
        y="72"
        fill="var(--office-map-muted)"
        fontSize="12"
        fontWeight="600"
        textAnchor="middle"
      >
        {liveRoom?.activeDevices ?? 0} active / {liveRoom?.totalWatts ?? 0}W
      </text>

      {blueprint.lights.map((light) => (
        <LightNode
          key={light.id}
          point={light}
          device={getDevice(liveRooms, light.id)}
          room={blueprint}
          selected={selectedDeviceId === light.id}
          onOpen={onDeviceOpen}
          onHover={onDeviceHover}
        />
      ))}
      {blueprint.fans.map((fan) => (
        <FanNode
          key={fan.id}
          point={fan}
          device={getDevice(liveRooms, fan.id)}
          room={blueprint}
          selected={selectedDeviceId === fan.id}
          onOpen={onDeviceOpen}
          onHover={onDeviceHover}
        />
      ))}
    </g>
  )
}

function LightNode({
  point,
  device,
  room,
  selected,
  onOpen,
  onHover,
}: {
  point: DevicePoint
  device?: Device
  room: RoomBlueprint
  selected: boolean
  onOpen: (device: Device) => void
  onHover: (placement: DevicePlacement | null) => void
}) {
  const active = device?.status === "on"
  const canInteract = Boolean(device)

  return (
    <g
      tabIndex={canInteract ? 0 : undefined}
      role={canInteract ? "button" : undefined}
      className={cn(
        "office-device-group",
        canInteract && "cursor-pointer outline-none",
        active && "active-light",
        selected && "selected-device"
      )}
      aria-label={`${point.label}: ${device?.status ?? "unknown"}`}
      onClick={() => {
        if (device) {
          onOpen(device)
        }
      }}
      onKeyDown={(event) => {
        if (device && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          onOpen(device)
        }
      }}
      onMouseEnter={() => {
        if (device) {
          onHover({ device, point, room })
        }
      }}
      onMouseLeave={() => onHover(null)}
      onFocus={() => {
        if (device) {
          onHover({ device, point, room })
        }
      }}
      onBlur={() => onHover(null)}
    >
      <circle
        cx={point.x}
        cy={point.y}
        r="24"
        fill="transparent"
        className="office-device-hit-area"
      />
      <circle
        cx={point.x}
        cy={point.y}
        r="55"
        fill="url(#office-beam-glow)"
        className="office-light-glow-cone"
      />
      <circle
        cx={point.x}
        cy={point.y}
        r="10"
        className="office-hardware-bulb"
      />
      <title>
        {point.label}: {device?.status ?? "unknown"}
      </title>
    </g>
  )
}

function FanNode({
  point,
  device,
  room,
  selected,
  onOpen,
  onHover,
}: {
  point: DevicePoint
  device?: Device
  room: RoomBlueprint
  selected: boolean
  onOpen: (device: Device) => void
  onHover: (placement: DevicePlacement | null) => void
}) {
  const active = device?.status === "on"
  const style = {
    animationDuration: getFanDuration(device),
  } satisfies CSSProperties
  const canInteract = Boolean(device)

  return (
    <g
      tabIndex={canInteract ? 0 : undefined}
      role={canInteract ? "button" : undefined}
      className={cn(
        "office-device-group",
        canInteract && "cursor-pointer outline-none",
        active && "active-fan",
        selected && "selected-device"
      )}
      transform={`translate(${point.x}, ${point.y})`}
      aria-label={`${point.label}: ${device?.status ?? "unknown"}`}
      onClick={() => {
        if (device) {
          onOpen(device)
        }
      }}
      onKeyDown={(event) => {
        if (device && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          onOpen(device)
        }
      }}
      onMouseEnter={() => {
        if (device) {
          onHover({ device, point, room })
        }
      }}
      onMouseLeave={() => onHover(null)}
      onFocus={() => {
        if (device) {
          onHover({ device, point, room })
        }
      }}
      onBlur={() => onHover(null)}
    >
      <circle r="31" fill="transparent" className="office-device-hit-area" />
      <g
        className="office-fan-blade-group"
        stroke={
          active
            ? "var(--office-map-fan-active)"
            : "var(--office-map-device-idle)"
        }
        strokeLinecap="round"
        strokeWidth="5"
        style={style}
      >
        <line x1="0" y1="0" x2="0" y2="-26" />
        <line x1="0" y1="0" x2="22" y2="13" />
        <line x1="0" y1="0" x2="-22" y2="13" />
      </g>
      <circle
        cx="0"
        cy="0"
        r="6"
        fill="var(--office-map-bg)"
        stroke="var(--office-map-muted)"
      />
      <title>
        {point.label}: {device?.status ?? "unknown"}
        {active ? `, ${getFanDuration(device)} rotation` : ""}
      </title>
    </g>
  )
}

function DeviceHoverCard({ placement }: { placement: DevicePlacement }) {
  const { device, point, room } = placement
  const width = 168
  const height = 92
  const x = Math.min(Math.max(point.x + 18, 10), 900 - width - 10)
  const y = Math.min(Math.max(point.y - 38, 10), 480 - height - 10)

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="pointer-events-none"
    >
      <div className="flex h-full flex-col gap-2 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold">{device.name}</div>
          <Badge variant={device.status === "on" ? "default" : "secondary"}>
            {device.status.toUpperCase()}
          </Badge>
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {room.label} · {device.type}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Load</span>
          <span className="font-mono font-medium">{device.watts}W</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Runtime</span>
          <span className="font-mono font-medium">
            {device.status === "on"
              ? formatRelativeMinutes(device.minutesInCurrentState)
              : "off"}
          </span>
        </div>
      </div>
    </foreignObject>
  )
}

function DeviceDetailSheet({
  device,
  open,
  onOpenChange,
}: {
  device: Device | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!device) {
    return null
  }

  const activePercent = Math.round((device.watts / device.ratedWatts) * 100)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {device.type === "fan" ? (
              <IconPropeller data-icon="inline-start" />
            ) : (
              <IconBulb data-icon="inline-start" />
            )}
            {device.roomName} · {device.name}
          </SheetTitle>
          <SheetDescription>
            Live device state from the shared office backend.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant={device.status === "on" ? "default" : "secondary"}>
              {device.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{device.type}</Badge>
            <Badge variant="outline">{device.id}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailMetric
              icon={<IconPlugConnected />}
              label="Current draw"
              value={`${device.watts}W`}
            />
            <DetailMetric
              icon={<IconClockHour4 />}
              label="Current state"
              value={
                device.status === "on"
                  ? formatRelativeMinutes(device.minutesInCurrentState)
                  : "off"
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">Rated load usage</span>
              <span className="text-muted-foreground tabular-nums">
                {activePercent}%
              </span>
            </div>
            <Progress value={activePercent} />
          </div>

          <Separator />

          <div className="grid gap-3 text-sm">
            <DetailRow label="Rated watts" value={`${device.ratedWatts}W`} />
            <DetailRow
              label="Last changed"
              value={formatTime(device.lastChanged)}
            />
            <DetailRow
              label="On since"
              value={device.onSince ? formatTime(device.onSince) : "Not active"}
            />
            <DetailRow label="Room" value={device.roomName} />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <IconX data-icon="inline-start" />
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground [&_svg]:size-4">
        {icon}
        {label}
      </div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
