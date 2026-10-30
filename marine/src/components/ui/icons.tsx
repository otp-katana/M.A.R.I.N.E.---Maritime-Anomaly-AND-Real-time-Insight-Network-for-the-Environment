import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg(props: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  )
}

export const ThermometerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />
  </Svg>
)

export const DropIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z" />
  </Svg>
)

export const WavesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </Svg>
)

export const SendIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11 21 3l-8 18-2-8z" />
  </Svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const BarsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 20v-7M12 20V5M19 20V10" />
  </Svg>
)

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19c2-4 5-7 9-9" />
  </Svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const BuoyIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3" />
    <path d="M12 11v7M8 18h8M4 21c2.5-1.6 5-1.6 8 0s5.5 1.6 8 0" />
  </Svg>
)

export const OrbitIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-30 12 12)" />
  </Svg>
)

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 2.5 20h19z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
)

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18" />
  </Svg>
)