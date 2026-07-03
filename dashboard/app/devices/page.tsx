"use client"

import { DeviceTable } from "@/components/live-energy-dashboard"
import { PageHeading, LiveBadge } from "@/components/page-heading"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEnergyState } from "@/hooks/use-energy-state"

export default function DevicesPage() {
  const { state, connection } = useEnergyState()

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Device registry"
        description="All monitored fans and lights, grouped by room with live relay state, wattage, runtime, and last-changed timestamp."
      >
        <LiveBadge connection={connection} />
        <Badge variant="secondary">{state.activeDevices} active</Badge>
        <Badge variant="outline">{state.deviceCount} total devices</Badge>
      </PageHeading>

      <section className="grid gap-4 md:grid-cols-3">
        {state.rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>
                {room.activeDevices}/{room.devices.length} devices active
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline">{room.fansOn} fans on</Badge>
              <Badge variant="outline">{room.lightsOn} lights on</Badge>
              <Badge>{room.totalWatts}W</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <DeviceTable rooms={state.rooms} />
    </main>
  )
}
