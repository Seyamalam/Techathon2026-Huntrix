"use client"

import { IconBrandDiscord, IconRobot } from "@tabler/icons-react"

import { PageHeading, LiveBadge } from "@/components/page-heading"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEnergyState } from "@/hooks/use-energy-state"

const commands = [
  {
    command: "!status",
    purpose: "Summarizes every room and current total watts.",
  },
  {
    command: "!room drawing",
    purpose: "Shows live Drawing Room device details.",
  },
  {
    command: "!room work1",
    purpose: "Shows live Work Room 1 device details.",
  },
  {
    command: "!room work2",
    purpose: "Shows live Work Room 2 device details.",
  },
  {
    command: "!usage",
    purpose: "Returns total watts, estimated kWh, and room breakdown.",
  },
  {
    command: "!alerts",
    purpose: "Lists active after-hours, runtime, or high-load alerts.",
  },
  {
    command: "!devices",
    purpose: "Prints the complete 15-device status board.",
  },
  {
    command: "!offhours",
    purpose: "Checks the 9 AM to 5 PM schedule rule.",
  },
]

export default function BotPage() {
  const { state, connection } = useEnergyState()
  const statusPreview = state.rooms
    .map(
      (room) =>
        `${room.name}: ${room.fansOn} fan${room.fansOn === 1 ? "" : "s"} ON, ${room.lightsOn} light${room.lightsOn === 1 ? "" : "s"} ON`
    )
    .join(". ")

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Discord bot"
        description="The bot reads the same backend state as the dashboard, so command replies and proactive alerts match the live UI."
      >
        <LiveBadge connection={connection} />
        <Badge variant="outline">Prefix !</Badge>
        <Badge variant="secondary">discord.js</Badge>
      </PageHeading>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBrandDiscord data-icon="inline-start" />
              Live command preview
            </CardTitle>
            <CardDescription>
              This mirrors the data used by `!status`.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-lg border bg-muted p-3 font-mono text-xs">
              !status
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {statusPreview || "Waiting for live room data."}. Total load is{" "}
              <span className="font-semibold text-foreground">
                {state.totalWatts}W
              </span>
              . {state.alerts.length} active alert
              {state.alerts.length === 1 ? "" : "s"}.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconRobot data-icon="inline-start" />
              Command set
            </CardTitle>
            <CardDescription>
              Commands are prefix-based, so no slash command registration is
              required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>Live behavior</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commands.map((item) => (
                  <TableRow key={item.command}>
                    <TableCell className="font-mono">{item.command}</TableCell>
                    <TableCell>{item.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
