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
                path="docs/assets/one-room-hardware-schematic.svg"
                href={`${repoBase}/docs/assets/one-room-hardware-schematic.svg`}
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
