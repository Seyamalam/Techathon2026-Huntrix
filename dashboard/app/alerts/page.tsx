"use client"

import {
  IconAlertTriangle,
  IconClockHour4,
  IconShieldCheck,
} from "@tabler/icons-react"

import { PageHeading, LiveBadge } from "@/components/page-heading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEnergyState } from "@/hooks/use-energy-state"
import { formatTime } from "@/lib/format"

export default function AlertsPage() {
  const { state, connection } = useEnergyState()

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Alert center"
        description="Live anomaly rules for after-hours usage, high load, and rooms left fully active for too long."
      >
        <LiveBadge connection={connection} />
        <Badge variant={state.isAfterHours ? "destructive" : "outline"}>
          {state.isAfterHours ? "After hours" : "Office hours"}
        </Badge>
        <Badge variant="secondary">{state.alerts.length} active</Badge>
      </PageHeading>

      <section className="grid gap-4 md:grid-cols-3">
        <RuleCard
          icon={<IconClockHour4 />}
          title="Office hours"
          detail="9:00 AM to 5:00 PM. Any active device outside that window is flagged."
        />
        <RuleCard
          icon={<IconAlertTriangle />}
          title="High load"
          detail="Total load above the configured threshold gets a warning for quick review."
        />
        <RuleCard
          icon={<IconShieldCheck />}
          title="Room runtime"
          detail="A room with every device running for 2+ hours becomes a critical alert."
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Active alert timeline</CardTitle>
          <CardDescription>
            Generated from the same backend payload used by Discord.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {state.alerts.length === 0 ? (
            <Alert>
              <IconShieldCheck />
              <AlertTitle>No active alerts</AlertTitle>
              <AlertDescription>
                All rooms are inside the expected operating envelope.
              </AlertDescription>
            </Alert>
          ) : (
            state.alerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === "critical" ? "destructive" : "default"}
              >
                <IconAlertTriangle />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.message} Reported at {formatTime(alert.timestamp)}.
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function RuleCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Separator />
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
