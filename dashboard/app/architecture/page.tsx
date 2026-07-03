import {
  IconApi,
  IconBrandDiscord,
  IconDeviceDesktopAnalytics,
  IconRouter,
  IconServer,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ArchitecturePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>
            One simulated device layer feeds one backend contract, then the web
            dashboard and Discord bot read the same state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArchitectureSvg />
        </CardContent>
      </Card>
    </div>
  )
}

function ArchitectureSvg() {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <svg
        role="img"
        aria-label="System architecture diagram"
        viewBox="0 0 1080 520"
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--foreground))" />
          </marker>
        </defs>
        <rect width="1080" height="520" rx="24" fill="hsl(var(--background))" />
        <ArchitectureNode
          x={60}
          y={160}
          title="Simulated IoT Layer"
          subtitle="15 device states · watts · timestamps"
          icon="router"
        />
        <ArchitectureNode
          x={360}
          y={160}
          title="Next.js Backend API"
          subtitle="GET /api/state · alert rules · usage totals"
          icon="server"
        />
        <ArchitectureNode
          x={690}
          y={70}
          title="Web Dashboard"
          subtitle="SVG room map · charts · status table"
          icon="dashboard"
        />
        <ArchitectureNode
          x={690}
          y={260}
          title="Discord Bot"
          subtitle="!status · !room · !usage · proactive alerts"
          icon="discord"
        />

        <path
          d="M310 238 H350"
          stroke="hsl(var(--foreground))"
          strokeWidth="4"
          markerEnd="url(#arrow)"
        />
        <path
          d="M610 214 C660 150 640 142 680 142"
          stroke="hsl(var(--foreground))"
          strokeWidth="4"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <path
          d="M610 266 C660 330 640 338 680 338"
          stroke="hsl(var(--foreground))"
          strokeWidth="4"
          fill="none"
          markerEnd="url(#arrow)"
        />

        <text
          x="330"
          y="92"
          className="fill-muted-foreground text-sm font-medium"
        >
          single source of truth
        </text>
        <BadgeSvg x={426} y={82} text="live JSON" />
      </svg>
    </div>
  )
}

function ArchitectureNode({
  x,
  y,
  title,
  subtitle,
  icon,
}: {
  x: number
  y: number
  title: string
  subtitle: string
  icon: "router" | "server" | "dashboard" | "discord"
}) {
  const Icon =
    icon === "router"
      ? IconRouter
      : icon === "server"
        ? IconServer
        : icon === "dashboard"
          ? IconDeviceDesktopAnalytics
          : IconBrandDiscord

  return (
    <foreignObject x={x} y={y} width="250" height="130">
      <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icon />
          </span>
          <div className="min-w-0 font-semibold">{title}</div>
        </div>
        <div className="text-sm leading-5 text-muted-foreground">
          {subtitle}
        </div>
        <Badge variant="secondary" className="w-fit">
          <IconApi data-icon="inline-start" />
          shared contract
        </Badge>
      </div>
    </foreignObject>
  )
}

function BadgeSvg({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="88" height="26" rx="13" fill="hsl(var(--primary))" />
      <text
        x="44"
        y="17"
        textAnchor="middle"
        className="fill-primary-foreground text-xs font-semibold"
      >
        {text}
      </text>
    </g>
  )
}
