import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

export function PageHeading({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </header>
  )
}

export function LiveBadge({
  connection,
}: {
  connection: "connecting" | "live" | "offline"
}) {
  if (connection === "live") {
    return <Badge>Live</Badge>
  }

  if (connection === "offline") {
    return <Badge variant="destructive">Offline</Badge>
  }

  return <Badge variant="outline">Connecting</Badge>
}
