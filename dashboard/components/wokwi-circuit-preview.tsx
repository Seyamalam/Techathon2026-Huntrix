"use client"

import type {} from "@wokwi/elements"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { useEnergyState } from "@/hooks/use-energy-state"
import type { Device } from "@/lib/energy-simulator"
import { hardwareDevices, type CircuitDevice } from "@/lib/hardware-circuit"
import { cn } from "@/lib/utils"

const wireStyles = {
  sense: "bg-sky-500 shadow-[0_0_10px_rgb(14_165_233/0.45)]",
  control: "bg-fuchsia-600 shadow-[0_0_10px_rgb(192_38_211/0.42)]",
  load: "bg-amber-500 shadow-[0_0_10px_rgb(245_158_11/0.42)]",
  return: "bg-muted-foreground/30",
}

const legend = [
  { label: "Sense input to ESP32", className: wireStyles.sense },
  { label: "ESP32 relay control", className: wireStyles.control },
  { label: "Switched load output", className: wireStyles.load },
  { label: "Common return / ground", className: wireStyles.return },
]

export function WokwiCircuitPreview() {
  const [ready, setReady] = useState(false)
  const { state } = useEnergyState()
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
      <div className="overflow-x-auto bg-background">
        <div className="min-w-[1320px] p-5">
          <div className="mb-5">
            <div className="text-xl font-semibold">
              ESP32 relay and state-sensing circuit
            </div>
            <div className="text-sm text-muted-foreground">
              Synced with the live backend, dashboard, and Discord bot.
            </div>
          </div>

          <div className="grid grid-cols-[250px_1fr] gap-5">
            <ControllerCard ready={ready} activeCount={activeCount} />

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[110px_110px_95px_70px_95px_70px_135px_minmax(150px,1fr)_95px] px-3 text-xs font-medium uppercase text-muted-foreground">
                <div>Device</div>
                <div>Switch</div>
                <div>Sense</div>
                <div>Input</div>
                <div>Output</div>
                <div>Drive</div>
                <div>Relay</div>
                <div>Line</div>
                <div>Indicator</div>
              </div>

              {hardwareDevices.map((device) => {
                const live = liveDevices.get(device.id)

                return (
                  <CircuitChannel
                    key={device.id}
                    ready={ready}
                    device={device}
                    active={live?.status === "on"}
                  />
                )
              })}
            </div>
          </div>

          <WireLegend />

          <div className="mt-4 rounded-lg border bg-card p-3 text-xs text-card-foreground shadow-sm">
            <div className="font-medium">Serial payload example</div>
            <code className="mt-1 block truncate text-muted-foreground">
              {"{\"id\":\"drawing-room-fan-1\",\"status\":\"on\",\"watts\":60,\"ratedWatts\":60}"}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControllerCard({
  ready,
  activeCount,
}: {
  ready: boolean
  activeCount: number
}) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center gap-5 rounded-lg border bg-card p-4 shadow-sm">
      {ready ? (
        <wokwi-esp32-devkit-v1 ledPower led1={activeCount > 0} />
      ) : (
        <Fallback label="ESP32" />
      )}
      <div className="text-center">
        <div className="text-base font-medium">ESP32 DevKit</div>
        <div className="text-xs text-muted-foreground">
          reads switches, drives relays
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 text-xs">
        <PinGroup title="Inputs" values={["32", "33", "25", "26", "27"]} />
        <PinGroup title="Outputs" values={["16", "17", "18", "19", "21"]} />
      </div>
    </div>
  )
}

function PinGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-md border bg-muted/40 p-2">
      <div className="mb-1 font-medium">{title}</div>
      <div className="flex flex-wrap gap-1">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-sm bg-background px-1.5 py-0.5 font-mono text-[10px]"
          >
            GPIO {value}
          </span>
        ))}
      </div>
    </div>
  )
}

function CircuitChannel({
  ready,
  device,
  active,
}: {
  ready: boolean
  device: CircuitDevice
  active: boolean
}) {
  return (
    <div
      className={cn(
        "grid min-h-[86px] grid-cols-[110px_110px_95px_70px_95px_70px_135px_minmax(150px,1fr)_95px] items-center gap-3 rounded-lg border bg-card p-3 shadow-sm",
        active && "border-primary/45"
      )}
    >
      <div>
        <div className="text-sm font-medium">{device.name}</div>
        <div className="text-xs text-muted-foreground">
          {device.ratedWatts}W
        </div>
        <Badge variant={active ? "default" : "outline"} className="mt-2">
          {active ? "on" : "off"}
        </Badge>
      </div>

      <PartBox active={active}>
        {ready ? (
          <wokwi-slide-switch value={active ? 1 : 0} />
        ) : (
          <Fallback label="SW" />
        )}
      </PartBox>

      <Wire active={active} tone="sense" />
      <PinNode label={device.sense} active={active} tone="sense" />
      <PinNode label={device.output} active={active} tone="control" />
      <Wire active={active} tone="control" />

      <PartBox active={active} className="gap-2">
        {ready ? <wokwi-ks2e-m-dc5 /> : <Fallback label="Relay" />}
        <div className="min-w-0">
          <div className="text-xs font-medium">{device.relay}</div>
          <div className="text-[10px] text-muted-foreground">relay</div>
        </div>
      </PartBox>

      <div className="flex flex-col gap-3">
        <Wire active={active} tone="load" />
        <Wire active={false} tone="return" />
      </div>

      <PartBox
        active={active}
        className={cn(
          "rounded-full",
          active && "shadow-[0_0_22px_hsl(var(--primary)/0.38)]"
        )}
      >
        {ready ? (
          <wokwi-led
            color={device.ledColor}
            value={active}
            brightness={active ? 1 : 0.08}
            label=""
          />
        ) : (
          <Fallback label="LED" />
        )}
      </PartBox>
    </div>
  )
}

function PinNode({
  label,
  active,
  tone,
}: {
  label: string
  active: boolean
  tone: "sense" | "control"
}) {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-center rounded-md border bg-muted/40 font-mono text-xs",
        active && tone === "sense" && "border-sky-500/70 bg-sky-500/10",
        active && tone === "control" && "border-fuchsia-600/70 bg-fuchsia-600/10"
      )}
    >
      {label}
    </div>
  )
}

function Wire({
  active,
  tone,
}: {
  active: boolean
  tone: keyof typeof wireStyles
}) {
  return (
    <div className="flex h-12 items-center">
      <div
        className={cn(
          "h-1.5 w-full rounded-full",
          active ? wireStyles[tone] : "bg-border",
          tone === "return" && wireStyles.return
        )}
      />
    </div>
  )
}

function PartBox({
  active,
  className,
  children,
}: {
  active: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-center rounded-md border bg-background p-2",
        active && "border-primary/50 bg-primary/5",
        className
      )}
    >
      {children}
    </div>
  )
}

function WireLegend() {
  return (
    <div className="mt-5 grid gap-2 rounded-lg border bg-card p-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={cn("h-1.5 w-10 rounded-full", item.className)} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
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
