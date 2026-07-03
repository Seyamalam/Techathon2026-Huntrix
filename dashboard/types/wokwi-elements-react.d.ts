import type React from "react"

type WokwiCustomElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  brightness?: number
  color?: string
  label?: string
  led1?: boolean
  ledPower?: boolean
  value?: boolean | number | string
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wokwi-esp32-devkit-v1": WokwiCustomElement
      "wokwi-ks2e-m-dc5": WokwiCustomElement
      "wokwi-led": WokwiCustomElement
      "wokwi-resistor": WokwiCustomElement
      "wokwi-slide-switch": WokwiCustomElement
    }
  }
}
