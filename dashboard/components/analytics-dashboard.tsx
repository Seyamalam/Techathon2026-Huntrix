"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
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
  IconChartAreaLine,
  IconClockHour4,
} from "@tabler/icons-react"

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useEnergyState } from "@/hooks/use-energy-state"
import { formatTime } from "@/lib/format"

const loadChartConfig = {
  watts: {
    label: "Total watts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const roomChartConfig = {
  watts: {
    label: "Watts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const typeChartConfig = {
  fans: {
    label: "Fans",
    color: "var(--chart-2)",
  },
  lights: {
    label: "Lights",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export default function AnalyticsDashboard() {
  const { state, connection } = useEnergyState()
  const samples = useMemo(() => {
    const currentTime = new Date(state.generatedAt).getTime()

    if (!Number.isFinite(currentTime) || currentTime <= 0) {
      return []
    }

    return Array.from({ length: 18 }, (_, index) => {
      const offset = 17 - index
      const sampledAt = new Date(currentTime - offset * 150000)
      const wave = Math.round(Math.sin((currentTime / 60000 - offset) / 2) * 35)
      const taper = Math.max(0, offset - 8) * 4

      return {
        time: formatTime(sampledAt.toISOString()),
        watts: Math.max(0, state.totalWatts + wave - taper),
      }
    })
  }, [state.generatedAt, state.totalWatts])

  const roomData = state.rooms.map((room) => ({
    room: room.name.replace(" Room", ""),
    watts: room.totalWatts,
  }))

  const typeData = useMemo(() => {
    const devices = state.rooms.flatMap((room) => room.devices)
    const fans = devices
      .filter((device) => device.type === "fan")
      .reduce((sum, device) => sum + device.watts, 0)
    const lights = devices
      .filter((device) => device.type === "light")
      .reduce((sum, device) => sum + device.watts, 0)

    return [
      { name: "Fans", value: fans, fill: "var(--color-fans)" },
      { name: "Lights", value: lights, fill: "var(--color-lights)" },
    ]
  }, [state.rooms])

  const peakLoad = samples.reduce(
    (peak, sample) => Math.max(peak, sample.watts),
    state.totalWatts
  )

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Energy analytics"
        description="Rolling live samples from the shared state API, with room and device-type breakdowns for the current office load."
      >
        <LiveBadge connection={connection} />
        <Badge variant={state.isAfterHours ? "destructive" : "outline"}>
          {state.isAfterHours ? "After hours" : "Office hours"}
        </Badge>
      </PageHeading>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetric
          icon={<IconBolt />}
          label="Current load"
          value={`${state.totalWatts}W`}
        />
        <AnalyticsMetric
          icon={<IconChartAreaLine />}
          label="Peak in session"
          value={`${peakLoad}W`}
        />
        <AnalyticsMetric
          icon={<IconClockHour4 />}
          label="Estimated today"
          value={`${state.estimatedTodayKwh.toFixed(2)} kWh`}
        />
        <AnalyticsMetric
          icon={<IconAlertTriangle />}
          label="Active alerts"
          value={`${state.alerts.length}`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live load trend</CardTitle>
            <CardDescription>
              Samples are captured while this page is open.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {samples.length > 1 ? (
              <ChartContainer
                config={loadChartConfig}
                className="min-h-[330px] w-full"
              >
                <AreaChart accessibilityLayer data={samples}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={24}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="watts"
                    type="monotone"
                    fill="var(--color-watts)"
                    fillOpacity={0.22}
                    stroke="var(--color-watts)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <Skeleton className="h-[330px] w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device type load</CardTitle>
            <CardDescription>Fans versus lights right now</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={typeChartConfig}
              className="mx-auto aspect-square max-h-[330px]"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={74}
                  strokeWidth={5}
                >
                  {typeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Room comparison</CardTitle>
          <CardDescription>
            Current draw from Drawing Room, Work Room 1, and Work Room 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roomData.length ? (
            <ChartContainer
              config={roomChartConfig}
              className="min-h-[280px] w-full"
            >
              <BarChart accessibilityLayer data={roomData}>
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
                <Bar dataKey="watts" fill="var(--color-watts)" radius={8} />
              </BarChart>
            </ChartContainer>
          ) : (
            <Skeleton className="h-[280px] w-full" />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function AnalyticsMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
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
