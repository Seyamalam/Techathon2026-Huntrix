"use client"

import { useEffect, useState } from "react"

import type { EnergyState } from "@/lib/energy-simulator"

export const initialEnergyState: EnergyState = {
  generatedAt: new Date(0).toISOString(),
  simulatedClock: "--:--:--",
  isAfterHours: false,
  totalWatts: 0,
  estimatedTodayKwh: 0,
  activeDevices: 0,
  deviceCount: 15,
  rooms: [],
  alerts: [],
}

export function useEnergyState() {
  const [state, setState] = useState<EnergyState>(initialEnergyState)
  const [connection, setConnection] = useState<
    "connecting" | "live" | "offline"
  >("connecting")

  useEffect(() => {
    let active = true

    async function loadState() {
      try {
        const response = await fetch("/api/state", { cache: "no-store" })

        if (!response.ok) {
          throw new Error(`State request failed: ${response.status}`)
        }

        const nextState = (await response.json()) as EnergyState

        if (active) {
          setState(nextState)
          setConnection("live")
        }
      } catch {
        if (active) {
          setConnection("offline")
        }
      }
    }

    loadState()
    const timer = window.setInterval(loadState, 2500)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  return { state, connection }
}
