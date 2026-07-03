# Live Office Energy Monitor Dashboard

Next.js + shadcn dashboard for the Techathon office energy monitoring prototype.

## What It Does

- Simulates 15 office devices across 3 rooms.
- Exposes the shared live state at `/api/state`.
- Renders an animated top-view office dashboard.
- Uses an SVG office layout where lights visibly glow/off and fan blades spin at state-driven speeds.
- Uses shadcn Cards, Badges, Alerts, Progress, Tabs, Table, ScrollArea, Tooltip, Skeleton, and Chart components.
- Uses shadcn Sidebar for multi-page navigation.
- Shows current watts, estimated kWh, room status, device status, and alerts.
- Includes a Discord bot response preview based on the same API state.

## Development

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

Routes:

```text
/              Live dashboard
/devices       Device table
/architecture  System architecture diagram
```

## API

```text
GET /api/state
```

Returns rooms, devices, total usage, estimated kWh, and active alerts.

## Assumption

The problem statement defines 3 rooms with 2 fans and 3 lights each, so this implementation tracks 15 devices. A later line mentions 18 devices; the fixed room definition is treated as authoritative.
