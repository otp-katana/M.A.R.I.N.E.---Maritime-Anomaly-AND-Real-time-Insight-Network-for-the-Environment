export function LogoMark({ size = 40 }: { size?: number }) {
  const wave = (y: number) => `M6 ${y}c4-5 8-5 12 0s8 5 12 0 8-5 12 0`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="marine-logo-grad"
          x1="4"
          y1="8"
          x2="44"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5fd0ff" />
          <stop offset="1" stopColor="#9b7bff" />
        </linearGradient>
      </defs>
      {[14, 24, 34].map((y) => (
        <path
          key={y}
          d={wave(y)}
          stroke="url(#marine-logo-grad)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}