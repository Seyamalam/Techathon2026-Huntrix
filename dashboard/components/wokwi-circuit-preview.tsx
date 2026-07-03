"use client"

import type {} from "@wokwi/elements"
import type React from "react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { useEnergyState } from "@/hooks/use-energy-state"
import type { Device } from "@/lib/energy-simulator"
import { hardwareDevices } from "@/lib/hardware-circuit"
import { cn } from "@/lib/utils"

export function WokwiCircuitPreview() {
  const [ready, setReady] = useState(false)
  const { state, connection } = useEnergyState()
  const drawingRoom = state.rooms.find((room) => room.id === "drawing-room")
  const liveDevices = useMemo(
    () =>
      new Map(
        drawingRoom?.devices.map((device) => [device.id, device]) ??
          ([] as Array<[string, Device]>)
      ),
    [drawingRoom?.devices]
  )
  const activeCount =
    drawingRoom?.devices.filter((device) => device.status === "on").length ?? 0
  const roomWatts = drawingRoom?.totalWatts ?? 0

  useEffect(() => {
    let active = true

    import("@wokwi/elements").then(() => {
      if (active) {
        setReady(true)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3">
        <div>
          <div className="text-sm font-medium">Drawing Room Wokwi preview</div>
          <div className="text-xs text-muted-foreground">
            Live state drives the switch positions, relay labels, and LEDs.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={connection === "live" ? "default" : "secondary"}>
            {connection}
          </Badge>
          <Badge variant="outline">{activeCount}/5 on</Badge>
          <Badge variant="outline">{roomWatts}W</Badge>
        </div>
      </div>

      <div className="relative aspect-[900/560] min-h-[360px] bg-background">
        <svg
          aria-hidden="true"
          viewBox="0 0 900 560"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <filter id="wireGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text x="28" y="46" className="fill-foreground text-lg font-semibold">
            ESP32 relay and state-sensing circuit
          </text>
          <text x="28" y="74" className="fill-muted-foreground text-sm">
            Same Drawing Room device IDs and wattages as the simulator
          </text>

          <ColumnLabel x={286} y={112} label="Sense inputs" />
          <ColumnLabel x={500} y={112} label="Relay board" />
          <ColumnLabel x={712} y={112} label="Loads" />

          {hardwareDevices.map((device) => {
            const live = liveDevices.get(device.id)
            const isOn = live?.status === "on"

            return (
              <g key={device.id}>
                <Wire d={`M175 ${device.y + 32} H282`} active={isOn} />
                <Wire d={`M402 ${device.y + 32} H500`} active={isOn} />
                <Wire d={`M612 ${device.y + 32} H702`} active={isOn} />
                <Wire d={`M760 ${device.y + 32} H830 V500 H175 V455`} />
              </g>
            )
          })}

          <path
            d="M175 455 V500 H830"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <text x="735" y="522" className="fill-muted-foreground text-xs">
            common ground return
          </text>
        </svg>

        <PartFrame className="left-[35px] top-[145px] w-[170px]">
          {ready ? (
            <wokwi-esp32-devkit-v1 ledPower led1={activeCount > 0} />
          ) : (
            <Fallback label="ESP32" />
          )}
        </PartFrame>

        {hardwareDevices.map((device) => {
          const live = liveDevices.get(device.id)
          const isOn = live?.status === "on"

          return (
            <div key={device.id}>
              <PartFrame
                className="w-[105px]"
                style={{ left: 290, top: device.y }}
              >
                {ready ? (
                  <wokwi-slide-switch value={isOn ? 1 : 0} />
                ) : (
                  <Fallback label="SW" />
                )}
              </PartFrame>
              <DeviceLabel
                className="left-[282px]"
                style={{ top: device.y + 56 }}
                primary={device.name}
                secondary={device.sense}
              />

              <PartFrame
                className="w-[68px]"
                style={{ left: 424, top: device.y + 19 }}
              >
                {ready ? <wokwi-resistor value="220" /> : <Fallback label="R" />}
              </PartFrame>

              <PartFrame
                className="w-[76px]"
                style={{ left: 520, top: device.y + 10 }}
              >
                {ready ? <wokwi-ks2e-m-dc5 /> : <Fallback label="Relay" />}
              </PartFrame>
              <DeviceLabel
                className="left-[505px]"
                style={{ top: device.y + 68 }}
                primary={`${device.relay} relay`}
                secondary={device.output}
              />

              <PartFrame
                className={cn(
                  "w-[58px] rounded-full",
                  isOn && "shadow-[0_0_28px_hsl(var(--primary)/0.55)]"
                )}
                style={{ left: 708, top: device.y + 12 }}
              >
                {ready ? (
                  <wokwi-led
                    color={device.ledColor}
                    value={isOn}
                    brightness={isOn ? 1 : 0.08}
                    label=""
                  />
                ) : (
                  <Fallback label="LED" />
                )}
              </PartFrame>
              <DeviceLabel
                className="left-[772px] w-[120px]"
                style={{ top: device.y + 15 }}
                primary={`${device.name} ${device.ratedWatts}W`}
                secondary={device.id}
              />
            </div>
          )
        })}

        <div className="absolute bottom-5 left-[292px] w-[420px] rounded-lg border bg-card p-3 text-xs text-card-foreground shadow-sm">
          <div className="font-medium">Serial payload example</div>
          <code className="mt-1 block truncate text-muted-foreground">
            {"{\"id\":\"drawing-room-fan-1\",\"status\":\"on\",\"watts\":60,\"ratedWatts\":60}"}
          </code>
        </div>
      </div>
    </div>
  )
}

function ColumnLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} className="fill-muted-foreground text-sm">
      {label}
    </text>
  )
}

function Wire({ d, active = false }: { d: string; active?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? "var(--primary)" : "var(--border)"}
      strokeWidth={active ? 4 : 3}
      filter={active ? "url(#wireGlow)" : undefined}
      opacity={active ? 1 : 0.72}
    />
  )
}

function PartFrame({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-md bg-card/80 p-1 shadow-sm",
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function DeviceLabel({
  className,
  style,
  primary,
  secondary,
}: {
  className?: string
  style?: React.CSSProperties
  primary: string
  secondary: string
}) {
  return (
    <div
      className={cn(
        "absolute w-[105px] rounded-md border bg-card/95 px-2 py-1 shadow-sm",
        className
      )}
      style={style}
    >
      <div className="truncate text-[11px] font-medium">{primary}</div>
      <div className="truncate font-mono text-[9px] text-muted-foreground">
        {secondary}
      </div>
    </div>
  )
}

function Fallback({ label }: { label: string }) {
  return (
    <div className="flex h-10 min-w-12 items-center justify-center rounded border bg-muted px-2 text-[10px] text-muted-foreground">
      {label}
    </div>
  )
}
