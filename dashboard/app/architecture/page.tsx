import Image from "next/image"
import { IconExternalLink } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeading } from "@/components/page-heading"
import { cn } from "@/lib/utils"

const repoBase = "https://github.com/Seyamalam/Techathon2026-Huntrix/blob/main"

const diagrams = [
  {
    title: "High-Level Architecture",
    description:
      "Core system flow across ESP32/Wokwi, backend API, InstantDB, Next.js dashboard, and Discord bot.",
    imageSrc: "/diagrams/hla.png",
    sourcePath: "docs/assets/hla.png",
  },
  {
    title: "Whole System Diagram",
    description:
      "Complete flow from office device state to backend, dashboard, Discord bot, alerts, and AI summaries.",
    imageSrc: "/diagrams/system-architecture.png",
    sourcePath: "docs/assets/system-architecture.png",
  },
  {
    title: "Web Dashboard Diagram",
    description:
      "Next.js routes, API routes, simulator, alert builder, InstantDB sync, and visual dashboard pages.",
    imageSrc: "/diagrams/web-dashboard-architecture.png",
    sourcePath: "docs/assets/web-dashboard-architecture.png",
  },
  {
    title: "Discord Bot And AI Diagram",
    description:
      "Command lifecycle, shared state fetch, deterministic fallback, LLM humanization, and proactive alerts.",
    imageSrc: "/diagrams/discord-ai-flow.png",
    sourcePath: "docs/assets/discord-ai-flow.png",
  },
  {
    title: "Deployment Diagram",
    description:
      "Docker local setup, Vercel dashboard deployment, bot runtime, and optional external services.",
    imageSrc: "/diagrams/deployment-architecture.png",
    sourcePath: "docs/assets/deployment-architecture.png",
  },
]

export default function ArchitecturePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <PageHeading
        title="Architecture"
        description="High-level architecture plus supporting PNG visuals for the shared backend, simulated IoT layer, dashboard, Discord bot, AI response path, and deployment setup."
      >
        <Badge>PNG diagrams</Badge>
        <Badge variant="outline">single source of truth</Badge>
        <Badge variant="secondary">dashboard + bot</Badge>
      </PageHeading>

      {diagrams.map((diagram) => (
        <DiagramCard key={diagram.sourcePath} {...diagram} />
      ))}
    </main>
  )
}

function DiagramCard({
  title,
  description,
  imageSrc,
  sourcePath,
}: {
  title: string
  description: string
  imageSrc: string
  sourcePath: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <a
            href={`${repoBase}/${sourcePath}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title} image in GitHub`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <IconExternalLink />
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border bg-muted/20">
          <Image
            src={imageSrc}
            alt={title}
            width={1600}
            height={1000}
            className="h-auto w-full"
            priority={title === "High-Level Architecture"}
          />
        </div>
      </CardContent>
    </Card>
  )
}
