"use client"

import { useMemo, type ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts"
import {
  IconAlertTriangle,
  IconBolt,
  IconClock,
  IconLayoutDashboard,
  IconPlugConnected,
  IconRefresh,
  IconRobot,
  IconSparkles,
} from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OfficeLayoutSvg } from "@/components/office-layout-svg"
import { initialEnergyState, useEnergyState } from "@/hooks/use-energy-state"
import type {
  EnergyAlert,
  EnergyState,
  RoomSummary,
} from "@/lib/energy-simulator"

const powerChartConfig = {
  watts: {
    label: "Watts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const deviceChartConfig = {
  active: {
    label: "Active",
    color: "var(--chart-2)",
  },
  idle: {
    label: "Idle",
    color: "var(--muted)",
  },
} satisfies ChartConfig

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value))
}

export function LiveEnergyDashboard() {
  const { state, connection } = useEnergyState()
  const activeRatio = state.deviceCount
    ? Math.round((state.activeDevices / state.deviceCount) * 100)
    : 0
  const powerData = state.rooms.map((room) => ({
    room: room.name.replace(" Room", ""),
    watts: room.totalWatts,
  }))
  const deviceData = [
    {
      name: "Active",
      value: state.activeDevices,
      fill: "var(--color-active)",
    },
    {
      name: "Idle",
      value: Math.max(0, state.deviceCount - state.activeDevices),
      fill: "var(--color-idle)",
    },
  ]

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
        <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">
              <IconSparkles data-icon="inline-start" />
              Techathon energy command center
            </Badge>
            <div className="flex flex-col gap-2">
              <h1 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-5xl">
                Live Office Energy Monitor
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                A single simulated IoT backend feeds this dashboard and the
                Discord bot, so room status, alerts, and power readings stay in
                sync.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[620px]">
            <MetricCard
              icon={<IconBolt />}
              label="Current Load"
              value={`${state.totalWatts}W`}
            />
            <MetricCard
              icon={<IconPlugConnected />}
              label="Active Devices"
              value={`${state.activeDevices}/${state.deviceCount}`}
            />
            <MetricCard
              icon={<IconAlertTriangle />}
              label="Alerts"
              value={`${state.alerts.length}`}
            />
            <MetricCard
              icon={<IconClock />}
              label="Live Clock"
              value={state.simulatedClock}
            />
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1fr_410px]">
          <div className="flex flex-col gap-5">
            <ControlCard
              activeRatio={activeRatio}
              connection={connection}
              estimatedTodayKwh={state.estimatedTodayKwh}
              generatedAt={state.generatedAt}
              isAfterHours={state.isAfterHours}
            />

            <Tabs defaultValue="layout" className="gap-4">
              <TabsList>
                <TabsTrigger value="layout">
                  <IconLayoutDashboard data-icon="inline-start" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="devices">
                  <IconPlugConnected data-icon="inline-start" />
                  Devices
                </TabsTrigger>
              </TabsList>

              <TabsContent value="layout">
                <OfficeMap rooms={state.rooms} />
              </TabsContent>

              <TabsContent value="devices">
                <DeviceTable rooms={state.rooms} />
              </TabsContent>
            </Tabs>
          </div>

          <aside className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Room power draw</CardTitle>
                <CardDescription>Live wattage by office area</CardDescription>
              </CardHeader>
              <CardContent>
                {state.rooms.length ? (
                  <ChartContainer
                    config={powerChartConfig}
                    className="min-h-[220px] w-full"
                  >
                    <BarChart accessibilityLayer data={powerData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="room"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="watts"
                        fill="var(--color-watts)"
                        radius={8}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <Skeleton className="h-[220px] w-full" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device mix</CardTitle>
                <CardDescription>Active versus idle devices</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={deviceChartConfig}
                  className="mx-auto aspect-square max-h-[230px]"
                >
                  <PieChart accessibilityLayer>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={deviceData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      strokeWidth={5}
                    >
                      {deviceData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <AlertsPanel alerts={state.alerts} />
            <DiscordPreview state={state} />
          </aside>
        </section>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}

function ControlCard({
  activeRatio,
  connection,
  estimatedTodayKwh,
  generatedAt,
  isAfterHours,
}: {
  activeRatio: number
  connection: "connecting" | "live" | "offline"
  estimatedTodayKwh: number
  generatedAt: string
  isAfterHours: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live system status</CardTitle>
        <CardDescription>
          Polling the shared backend every 2.5 seconds for demo-safe real-time
          updates.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <IconRefresh data-icon="inline-start" />
            Refresh
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ConnectionBadge connection={connection} />
            <Badge variant={isAfterHours ? "destructive" : "secondary"}>
              {isAfterHours ? "After-hours monitoring" : "Inside office hours"}
            </Badge>
          </div>
          <Progress value={activeRatio}>
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <span className="font-medium">Active device ratio</span>
              <span className="text-muted-foreground tabular-nums">
                {activeRatio}%
              </span>
            </div>
          </Progress>
          <p className="text-xs text-muted-foreground">
            Last sync{" "}
            {generatedAt === initialEnergyState.generatedAt
              ? "pending"
              : formatTimestamp(generatedAt)}
            .
          </p>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <div className="text-xs text-muted-foreground">Estimated today</div>
          <div className="text-2xl font-semibold tabular-nums">
            {estimatedTodayKwh.toFixed(2)} kWh
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConnectionBadge({
  connection,
}: {
  connection: "connecting" | "live" | "offline"
}) {
  if (connection === "live") {
    return <Badge>Live API feed</Badge>
  }

  if (connection === "offline") {
    return <Badge variant="destructive">Offline</Badge>
  }

  return <Badge variant="outline">Connecting</Badge>
}

function OfficeMap({ rooms }: { rooms: RoomSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconLayoutDashboard data-icon="inline-start" />
          Top-view office layout
        </CardTitle>
        <CardDescription>
          Lights glow and fans spin when devices are on.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rooms.length ? (
          <OfficeLayoutSvg rooms={rooms} />
        ) : (
          <div className="grid min-h-[520px] gap-3 lg:grid-cols-[0.85fr_1.15fr]">
            <Skeleton className="h-full min-h-[250px]" />
            <div className="grid gap-3">
              <Skeleton className="h-full min-h-[250px]" />
              <Skeleton className="h-full min-h-[250px]" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AlertsPanel({ alerts }: { alerts: EnergyAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertTriangle data-icon="inline-start" />
          Active alerts
        </CardTitle>
        <CardDescription>{alerts.length} active alert events</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-3">
          <div className="flex flex-col gap-3">
            {alerts.length === 0 ? (
              <Alert>
                <IconSparkles />
                <AlertTitle>No active alerts</AlertTitle>
                <AlertDescription>
                  The office is operating inside expected limits.
                </AlertDescription>
              </Alert>
            ) : (
              alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={
                    alert.severity === "critical" ? "destructive" : "default"
                  }
                >
                  <IconAlertTriangle />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>
                    {alert.message} · {formatTimestamp(alert.timestamp)}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function DiscordPreview({ state }: { state: EnergyState }) {
  const statusLine = useMemo(() => {
    if (!state.rooms.length) {
      return "Waiting for live room data..."
    }

    return state.rooms
      .map(
        (room) =>
          `${room.name}: ${room.fansOn} fan${room.fansOn === 1 ? "" : "s"} ON, ${room.lightsOn} light${room.lightsOn === 1 ? "" : "s"} ON`
      )
      .join(". ")
  }, [state.rooms])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconRobot data-icon="inline-start" />
          Discord bot preview
        </CardTitle>
        <CardDescription>
          Same `/api/state` contract, humanized output.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-lg border bg-muted p-3 font-mono text-xs">
          !status
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {statusLine}. Total power right now is{" "}
          <span className="font-semibold text-foreground">
            {state.totalWatts}W
          </span>
          .
        </p>
      </CardContent>
    </Card>
  )
}

export function DeviceTable({ rooms }: { rooms: RoomSummary[] }) {
  const devices = rooms.flatMap((room) => room.devices)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live device status</CardTitle>
        <CardDescription>
          All devices exposed by the shared backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devices.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Watts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.roomName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{device.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={device.status === "on" ? "default" : "secondary"}
                    >
                      {device.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {device.watts}W
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Separator />
      </CardFooter>
    </Card>
  )
}
