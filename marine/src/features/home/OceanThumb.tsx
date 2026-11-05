import { useId } from 'react'

export function OceanThumb({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')

  return (
    <svg className={className} viewBox="0 0 130 85" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2a5c" />
          <stop offset="0.6" stopColor="#1561c9" />
          <stop offset="1" stopColor="#35d4ff" />
        </linearGradient>
      </defs>
      <rect width="130" height="85" fill={`url(#${id}-bg)`} />
      <circle cx="98" cy="22" r="14" fill="#8bdfff" opacity="0.35" />
      <path d="M0 48C22 36 40 36 62 46S104 56 130 42V85H0Z" fill="#0f3f8f" opacity="0.7" />
      <path d="M0 58C24 46 44 48 66 58S106 68 130 56V85H0Z" fill="#1a6fd6" opacity="0.75" />
      <path d="M0 68C26 58 48 60 70 68S108 76 130 68V85H0Z" fill="#35d4ff" opacity="0.55" />
      <path
        d="M0 48C22 36 40 36 62 46S104 56 130 42"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
    </svg>
  )
}