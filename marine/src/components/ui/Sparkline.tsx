import { useId } from 'react'
import { cx } from '@/utils/cx'
import styles from './Sparkline.module.css'

const W = 100
const H = 36
const PAD = 4

const r = (n: number) => n.toFixed(2)

function toPoints(values: number[]): [number, number][] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = W / (values.length - 1)
  return values.map((v, i) => [i * step, H - PAD - ((v - min) / range) * (H - PAD * 2)])
}

/** Noktalardan yumuşatılmış bir çizgi üretir (orta nokta eğrileri). */
function linePath(pts: [number, number][]): string {
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    d += ` Q${r(x)},${r(y)} ${r((x + nx) / 2)},${r((y + ny) / 2)}`
  }
  const last = pts[pts.length - 1]
  return `${d} L${r(last[0])},${r(last[1])}`
}

type Props = {
  values: number[]
  className?: string
  height?: number
}

/** Rengi `currentColor` üzerinden alır; üst elemandan `color` verin. */
export function Sparkline({ values, className, height = 44 }: Props) {
  const rawId = useId()
  const gradId = `spark-${rawId.replace(/:/g, '')}`
  if (values.length < 2) return null

  const pts = toPoints(values)
  const line = linePath(pts)
  const [lx, ly] = pts[pts.length - 1]
  const area = `${line} L${r(lx)},${H} L0,${H} Z`

  return (
    <svg
      className={cx(styles.svg, className)}
      style={{ height }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Son nokta: sıfır uzunluklu, yuvarlak uçlu çizgi = bozulmayan daire */}
      <path
        d={`M${r(lx)},${r(ly)}h0.001`}
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}