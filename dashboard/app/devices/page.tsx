"use client"

import { DeviceTable } from "@/components/live-energy-dashboard"
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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Registry</CardTitle>
          <CardDescription>
            Every light and fan currently exposed by the shared backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>{connection === "live" ? "Live API feed" : connection}</Badge>
          <Badge variant="secondary">{state.activeDevices} active</Badge>
          <Badge variant="outline">{state.deviceCount} total devices</Badge>
        </CardContent>
      </Card>
      <DeviceTable rooms={state.rooms} />
    </div>
  )
}
