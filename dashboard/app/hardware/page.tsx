import Image from "next/image"
import { IconExternalLink } from "@tabler/icons-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { WokwiCircuitPreview } from "@/components/wokwi-circuit-preview"
import { hardwareDevices } from "@/lib/hardware-circuit"
import { cn } from "@/lib/utils"

const repoBase = "https://github.com/Seyamalam/Techathon2026-Huntrix/blob/main"

export default function HardwarePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-col gap-3">
        <div className="flex max-w-3xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            Hardware simulation
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This relay preview reads the same live backend state as the floor
            plan, charts, alerts, and Discord bot, so every interface stays in
            sync during the demo.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <WokwiCircuitPreview />

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>One-room hardware schematic</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  AI-generated visual for the representative ESP32 relay and
                  sensing circuit. It maps to the same device IDs, pin mapping,
                  and wattage contract used by the backend, dashboard, and
                  Discord bot.
                </p>
              </div>
              <a
                href={`${repoBase}/docs/assets/one-room-hardware-schematic.png`}
                target="_blank"
                rel="noreferrer"
                aria-label="Open hardware schematic image in GitHub"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              >
                <IconExternalLink />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border bg-muted/20">
              <Image
                src="/diagrams/one-room-hardware-schematic.png"
                alt="Representative ESP32 relay and sensing hardware schematic"
                width={1600}
                height={1000}
                className="h-auto w-full"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pin mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <div className="border-b px-4 py-3 text-sm text-muted-foreground">
                Matches `wokwi/diagram.json` and `wokwi/sketch.ino`.
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Relay</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Sense</TableHead>
                    <TableHead className="text-right">Watts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hardwareDevices.map((device) => (
                    <TableRow key={device.name}>
                      <TableCell className="font-medium">
                        {device.name}
                      </TableCell>
                      <TableCell>{device.relay}</TableCell>
                      <TableCell>{device.output}</TableCell>
                      <TableCell>{device.sense}</TableCell>
                      <TableCell className="text-right">
                        {device.ratedWatts}W
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repository files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
              <FileLine
                path="wokwi/diagram.json"
                href={`${repoBase}/wokwi/diagram.json`}
              />
              <FileLine
                path="wokwi/sketch.ino"
                href={`${repoBase}/wokwi/sketch.ino`}
              />
              <FileLine
                path="docs/hardware-schematic.md"
                href={`${repoBase}/docs/hardware-schematic.md`}
              />
              <FileLine
                path="docs/assets/one-room-hardware-schematic.png"
                href={`${repoBase}/docs/assets/one-room-hardware-schematic.png`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Wokwi circuit screenshot</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The Wokwi view shows the ESP32 representative room circuit
                  used for the hardware concept: five sensed controls, relay
                  channels, and load indicators for two fans and three lights.
                </p>
              </div>
              <a
                href={`${repoBase}/docs/assets/wokwi.png`}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Wokwi screenshot in GitHub"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              >
                <IconExternalLink />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border bg-muted/20">
              <Image
                src="/diagrams/wokwi.png"
                alt="Wokwi ESP32 representative room circuit screenshot"
                width={1728}
                height={867}
                className="h-auto w-full"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function FileLine({ path, href }: { path: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted p-3">
      <code className="truncate text-xs">{path}</code>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${path} in GitHub`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
      >
        <IconExternalLink />
      </a>
    </div>
  )
}
