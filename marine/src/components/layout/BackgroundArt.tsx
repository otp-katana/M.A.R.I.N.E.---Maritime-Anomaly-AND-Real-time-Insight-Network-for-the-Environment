import { useId } from 'react'
import styles from './BackgroundArt.module.css'

/** Dekoratif dalga çizgisi. Gerçek veri değildir. */
function wave(y: number, i: number, amp: number) {
  const k = i * 5
  return (
    `M-120 ${y} ` +
    `C 280 ${y - amp - k}, 640 ${y + amp + k * 1.4}, 1040 ${y - amp * 0.2} ` +
    `S 1440 ${y + amp * 0.6 + k}, 1740 ${y - amp * 0.4}`
  )
}

const LOW = Array.from({ length: 18 }, (_, i) => wave(560 + i * 7, i, 90))
const HIGH = Array.from({ length: 14 }, (_, i) => wave(110 + i * 6, i, 70))

export function BackgroundArt() {
  const uid = useId().replace(/:/g, '')
  const gradLow = `wave-low-${uid}`
  const gradHigh = `wave-high-${uid}`

  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.aurora} />
      <svg
        className={styles.waves}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradLow} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--art-wave-a)', stopOpacity: 0 }} />
            <stop offset="0.28" style={{ stopColor: 'var(--art-wave-a)', stopOpacity: 1 }} />
            <stop offset="0.62" style={{ stopColor: 'var(--art-wave-b)', stopOpacity: 0.8 }} />
            <stop offset="1" style={{ stopColor: 'var(--art-wave-b)', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id={gradHigh} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--art-wave-b)', stopOpacity: 0 }} />
            <stop offset="0.5" style={{ stopColor: 'var(--art-wave-b)', stopOpacity: 0.9 }} />
            <stop offset="1" style={{ stopColor: 'var(--art-wave-a)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        <g className={styles.low} stroke={`url(#${gradLow})`}>
          {LOW.map((d, i) => (
            <path key={i} d={d} opacity={0.35 + (i % 4) * 0.15} />
          ))}
        </g>
        <g className={styles.high} stroke={`url(#${gradHigh})`}>
          {HIGH.map((d, i) => (
            <path key={i} d={d} opacity={0.3 + (i % 3) * 0.2} />
          ))}
        </g>
      </svg>
    </div>
  )
}