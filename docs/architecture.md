# Architecture

The system has one source of truth: the backend state exposed by the dashboard package. The simulated device layer creates live device state, and both the dashboard and Discord bot read the same backend contract.

The high-level architecture diagram shows the core system flow across ESP32/Wokwi, the backend API, InstantDB, the Next.js dashboard, and the Discord bot. Supporting diagrams are AI-generated PNG image artifacts, not Mermaid or Graphviz.

## High-Level Architecture

![Huntrix high-level architecture](assets/hla.png)

## Whole System

![Huntrix system architecture](assets/system-architecture.png)

## Web Dashboard

![Web dashboard architecture](assets/web-dashboard-architecture.png)

## Discord Bot And AI

![Discord bot and AI flow](assets/discord-ai-flow.png)

## Deployment

![Deployment architecture](assets/deployment-architecture.png)

## Component Responsibilities

### Device Simulator

- Defines 3 rooms and 15 devices.
- Uses deterministic random state toggles about every 1.5 seconds so changes are easy to observe in the demo.
- Keeps real Asia/Dhaka time for the 9 to 5 office-hours rule.
- Tracks `lastChanged`, `onSince`, room totals, active device counts, and watts.

### Backend API

- Serves `GET /api/state` as the shared live state endpoint.
- Serves `GET /api/ai-insight` for dashboard AI advice.
- Calculates total and per-room power usage.
- Builds after-hours, high-load, and all-on runtime alerts.
- Optionally syncs the current state into InstantDB.

### Web Dashboard

- Polls state about every 1.5 seconds.
- Animates fan spin and light glow directly from device state.
- Shows room wattage, device tables, alerts, analytics, AI coach output, and hardware preview.

### Discord Bot

- Reads the same backend state as the dashboard.
- Answers commands with live facts.
- Uses OpenRouter to make responses sound natural when configured.
- Falls back to deterministic formatters if the LLM is unavailable.
- May post proactive alerts to a configured Discord channel.

## API Contract

```text
GET /api/state
```

Returns rooms, devices, usage, alerts, generated timestamp, and the current Dhaka office clock.

```text
GET /api/ai-insight
```

Returns AI-generated or fallback energy advice derived from the current state.
