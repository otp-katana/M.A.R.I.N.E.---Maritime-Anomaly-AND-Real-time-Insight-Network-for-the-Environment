import { useId } from 'react'
import { GlassCard } from '@/components/ui'
import styles from './BrandCard.module.css'

function Art() {
  const id = useId().replace(/:/g, '')

  return (
    <svg
      className={styles.art}
      viewBox="0 0 282 155"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2257" />
          <stop offset="0.5" stopColor="#5b3f86" />
          <stop offset="0.72" stopColor="#e08a73" />
          <stop offset="0.73" stopColor="#14295a" />
          <stop offset="1" stopColor="#0a1738" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd9a8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="282" height="155" fill={`url(#${id}-sky)`} />
      <circle cx="141" cy="112" r="46" fill={`url(#${id}-sun)`} />
      <g fill="none" stroke="#8bdfff" strokeOpacity="0.35" strokeWidth="1">
        <path d="M0 122C40 116 80 128 120 122S200 116 282 124" />
        <path d="M0 133C50 126 90 138 140 132S220 126 282 134" />
        <path d="M0 145C40 139 100 150 150 144S230 138 282 146" />
      </g>
    </svg>
  )
}

export function BrandCard() {
  return (
    <GlassCard padding="none" className={styles.card}>
      <Art />
      <div className={styles.content}>
        <span className={styles.mark}>M.A.R.I.N.E.</span>
        <p className={styles.message}>For a healthier, more balanced ocean.</p>
        <span className={styles.rule} aria-hidden="true" />
      </div>
    </GlassCard>
  )
}