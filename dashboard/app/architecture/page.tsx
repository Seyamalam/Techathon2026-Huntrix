import {
  IconApi,
  IconBrandDiscord,
  IconBulb,
  IconDeviceDesktopAnalytics,
  IconPlug,
  IconPropeller,
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
          <CardTitle>System architecture</CardTitle>
          <CardDescription>
            One simulated device layer feeds one backend contract, then the web
            dashboard and Discord bot read the same state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArchitectureSvg />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Representative one-room schematic</CardTitle>
          <CardDescription>
            Concept circuit for 2 fans and 3 lights using an ESP32, relay
            modules, isolated state inputs, and a current sensor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HardwareSchematicSvg />
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
            <path d="M0,0 L0,6 L9,3 z" fill="var(--foreground)" />
          </marker>
        </defs>
        <rect width="1080" height="520" rx="24" fill="var(--background)" />
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
          stroke="var(--foreground)"
          strokeWidth="4"
          markerEnd="url(#arrow)"
        />
        <path
          d="M610 214 C660 150 640 142 680 142"
          stroke="var(--foreground)"
          strokeWidth="4"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <path
          d="M610 266 C660 330 640 338 680 338"
          stroke="var(--foreground)"
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
      <rect width="88" height="26" rx="13" fill="var(--primary)" />
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

function HardwareSchematicSvg() {
  const loads = [
    { x: 690, y: 70, label: "Fan 1", icon: "fan" },
    { x: 690, y: 145, label: "Fan 2", icon: "fan" },
    { x: 690, y: 220, label: "Light 1", icon: "light" },
    { x: 690, y: 295, label: "Light 2", icon: "light" },
    { x: 690, y: 370, label: "Light 3", icon: "light" },
  ] as const

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/20">
      <svg
        role="img"
        aria-label="Representative hardware schematic for one room"
        viewBox="0 0 1080 520"
        className="h-auto w-full"
      >
        <defs>
          <marker
            id="schematic-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="var(--foreground)" />
          </marker>
        </defs>
        <rect width="1080" height="520" rx="24" fill="var(--background)" />
        <line
          x1="610"
          y1="45"
          x2="610"
          y2="455"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <line
          x1="875"
          y1="45"
          x2="875"
          y2="455"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <text
          x="596"
          y="32"
          textAnchor="end"
          className="fill-muted-foreground text-xs font-medium"
        >
          Relay outputs
        </text>
        <text
          x="890"
          y="32"
          className="fill-muted-foreground text-xs font-medium"
        >
          AC load side
        </text>

        <foreignObject x="55" y="120" width="240" height="210">
          <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconRouter />
              </span>
              <div className="font-semibold">ESP32 Controller</div>
            </div>
            <div className="text-sm leading-5 text-muted-foreground">
              Reads opto inputs, drives relays, estimates load, and publishes
              room state to the backend.
            </div>
            <Badge variant="secondary" className="w-fit">
              Wi-Fi telemetry
            </Badge>
          </div>
        </foreignObject>

        <foreignObject x="360" y="105" width="190" height="245">
          <div className="flex h-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <IconPlug />
              </span>
              <div className="font-semibold">5V relay board</div>
            </div>
            <div className="text-sm leading-5 text-muted-foreground">
              Five isolated channels control the representative room loads.
            </div>
            <Badge variant="outline" className="w-fit">
              one room
            </Badge>
          </div>
        </foreignObject>

        <path
          d="M295 185 H350"
          stroke="var(--foreground)"
          strokeWidth="3"
          markerEnd="url(#schematic-arrow)"
        />
        <path
          d="M295 242 H350"
          stroke="var(--foreground)"
          strokeWidth="3"
          markerEnd="url(#schematic-arrow)"
        />
        <path
          d="M550 165 H602"
          stroke="var(--foreground)"
          strokeWidth="3"
          markerEnd="url(#schematic-arrow)"
        />

        {loads.map((load, index) => (
          <g key={load.label}>
            <path
              d={`M610 ${load.y + 24} H680`}
              stroke="var(--foreground)"
              strokeWidth="3"
            />
            <path
              d={`M780 ${load.y + 24} H875`}
              stroke="var(--muted-foreground)"
              strokeWidth="3"
            />
            <foreignObject x={load.x} y={load.y} width="90" height="50">
              <div className="flex h-full items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium text-card-foreground shadow-sm">
                {load.icon === "fan" ? <IconPropeller /> : <IconBulb />}
                <span>{load.label}</span>
              </div>
            </foreignObject>
            <text
              x="582"
              y={load.y + 29}
              textAnchor="end"
              className="fill-muted-foreground text-xs"
            >
              CH{index + 1}
            </text>
          </g>
        ))}

        <foreignObject x="910" y="185" width="120" height="135">
          <div className="flex h-full flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
            <div className="font-semibold">ACS712</div>
            <div className="text-sm leading-5 text-muted-foreground">
              Optional current sensor reports total room draw.
            </div>
          </div>
        </foreignObject>

        <path
          d="M875 250 H900"
          stroke="var(--foreground)"
          strokeWidth="3"
          markerEnd="url(#schematic-arrow)"
        />
        <text x="140" y="392" className="fill-muted-foreground text-sm">
          Sensing inputs can use opto-isolators or low-voltage wall switch
          feedback.
        </text>
        <text x="140" y="420" className="fill-muted-foreground text-sm">
          Mains wiring is conceptual; isolation and certified relay modules are
          required in real hardware.
        </text>
      </svg>
    </div>
  )
}
