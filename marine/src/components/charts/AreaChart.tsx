import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import type { SeriesPoint } from '@/data/types'
import { monthTicks, niceDomain } from '@/utils/chart'
import { cx } from '@/utils/cx'
import { smoothLinePath } from '@/utils/path'
import styles from './AreaChart.module.css'

const MARGIN = { top: 16, right: 16, bottom: 28, left: 50 }
const TOOLTIP_HALF = 58

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
const dayFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const fmtTick = (v: number) => String(Number(v.toFixed(3)))

type Props = {
  points: SeriesPoint[]
  unit: string
  decimals: number
  tickSuffix?: string
  height?: number
  ariaLabel: string
}

export function AreaChart({
  points,
  unit,
  decimals,
  tickSuffix = '',
  height = 230,
  ariaLabel,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const gradId = `area-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const g = useMemo(() => {
    if (width <= 0 || points.length < 2) return null

    const innerW = width - MARGIN.left - MARGIN.right
    const innerH = height - MARGIN.top - MARGIN.bottom
    const t0 = points[0].t
    const t1 = points[points.length - 1].t
    const values = points.map((p) => p.v)
    const dom = niceDomain(Math.min(...values), Math.max(...values), 4)

    const x = (t: number) => MARGIN.left + ((t - t0) / (t1 - t0)) * innerW
    const y = (v: number) => MARGIN.top + (1 - (v - dom.lo) / (dom.hi - dom.lo)) * innerH

    const pts = points.map((p) => [x(p.t), y(p.v)] as [number, number])
    const line = smoothLinePath(pts)
    const baseY = MARGIN.top + innerH
    const area = `${line} L${pts[pts.length - 1][0].toFixed(2)},${baseY} L${pts[0][0].toFixed(2)},${baseY} Z`

    return {
      pts,
      line,
      area,
      innerW,
      innerH,
      ticks: dom.ticks.map((v) => ({ v, y: y(v) })),
      months: monthTicks(t0, t1).map((t) => ({ t, x: x(t) })),
    }
  }, [points, width, height])

  const active = hover ?? points.length - 1
  const activePoint = points[active]
  const activeXY = g?.pts[active]

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHover(Math.round(frac * (points.length - 1)))
  }

  return (
    <div ref={wrapRef} className={styles.wrap} style={{ height }}>
      {g && activeXY && activePoint && (
        <>
          <svg
            className={styles.svg}
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>

            {g.ticks.map((tick) => (
              <g key={tick.v}>
                <line
                  className={styles.grid}
                  x1={MARGIN.left}
                  x2={width - MARGIN.right}
                  y1={tick.y}
                  y2={tick.y}
                />
                <text
                  className={styles.tick}
                  x={MARGIN.left - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                >
                  {fmtTick(tick.v)}
                  {tickSuffix}
                </text>
              </g>
            ))}

            {g.months.map((m) => (
              <text key={m.t} className={styles.tick} x={m.x + 4} y={height - 8}>
                {monthFmt.format(m.t)}
              </text>
            ))}

            <path d={g.area} fill={`url(#${gradId})`} />
            <path className={styles.line} d={g.line} />

            <line
              className={styles.guide}
              x1={activeXY[0]}
              x2={activeXY[0]}
              y1={MARGIN.top}
              y2={MARGIN.top + g.innerH}
            />
            <circle className={styles.dot} cx={activeXY[0]} cy={activeXY[1]} r={5} />

            <rect
              className={styles.overlay}
              x={MARGIN.left}
              y={MARGIN.top}
              width={g.innerW}
              height={g.innerH}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>

          <div
            className={styles.tooltip}
            style={{
              left: Math.min(Math.max(activeXY[0], TOOLTIP_HALF), width - TOOLTIP_HALF),
              top: activeXY[1],
            }}
          >
            <div className={cx('num', styles.tipValue)}>
              {activePoint.v.toFixed(decimals)} {unit}
            </div>
            <div className={styles.tipDate}>{dayFmt.format(activePoint.t)}</div>
          </div>
        </>
      )}
    </div>
  )
}