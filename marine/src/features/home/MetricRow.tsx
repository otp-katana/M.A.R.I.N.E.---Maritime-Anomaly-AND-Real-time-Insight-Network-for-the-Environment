import type { ComponentType, SVGProps } from 'react'
import { LeafIcon, ThermometerIcon, WavesIcon } from '@/components/ui/icons'
import { CADENCE_LABEL } from '@/data/labels'
import type { GlanceIcon, GlanceMetric } from '@/data/types'
import { cx } from '@/utils/cx'
import styles from './MetricRow.module.css'

const ICONS: Record<GlanceIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  waves: WavesIcon,
  leaf: LeafIcon,
  thermometer: ThermometerIcon,
}

function formatDelta(pct: number): string {
  const arrow = pct > 0 ? '↑' : pct < 0 ? '↓' : '→'
  return `${arrow} ${Math.abs(pct).toFixed(1)}%`
}

export function MetricRow({ metric }: { metric: GlanceMetric }) {
  const Icon = ICONS[metric.icon]

  return (
    <div className={styles.row}>
      <span className={cx(styles.icon, styles[metric.tone])}>
        <Icon />
      </span>

      <div className={styles.meta}>
        <div className={styles.label}>
          {metric.label}
          <span className={styles.cadence}> · {CADENCE_LABEL[metric.cadence]}</span>
        </div>
        <div className={cx('num', styles.value)}>
          {metric.value.toFixed(metric.decimals)}
          <span className={styles.unit}> {metric.unit}</span>
        </div>
      </div>

      <span className={cx('num', styles.delta, styles[metric.sentiment])}>
        {formatDelta(metric.deltaPct)}
      </span>
    </div>
  )
}