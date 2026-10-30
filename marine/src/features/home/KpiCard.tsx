import type { ComponentType, SVGProps } from 'react'
import { GlassCard, Sparkline } from '@/components/ui'
import { DropIcon, ThermometerIcon, WavesIcon } from '@/components/ui/icons'
import { CADENCE_LABEL } from '@/data/labels'
import type { KpiIcon, KpiMetric } from '@/data/types'
import { cx } from '@/utils/cx'
import styles from './KpiCard.module.css'

const ICONS: Record<KpiIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  thermometer: ThermometerIcon,
  drop: DropIcon,
  waves: WavesIcon,
}

function formatValue(m: KpiMetric): string {
  const text = m.value.toFixed(m.decimals)
  return m.showSign && m.value > 0 ? `+${text}` : text
}

function formatDelta(delta: number, decimals: number): string {
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→'
  return `${arrow} ${Math.abs(delta).toFixed(decimals)}`
}

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const Icon = ICONS[metric.icon]

  return (
    <GlassCard>
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon />
        </span>

        <div className={styles.meta}>
          <div className={styles.labelRow}>
            <span className={styles.label}>{metric.label}</span>
            <span className={styles.cadence}>{CADENCE_LABEL[metric.cadence]}</span>
          </div>

          <div className={styles.valueRow}>
            <span className={cx('num', styles.value)}>
              {formatValue(metric)}
              {metric.unit && <span className={styles.unit}> {metric.unit}</span>}
            </span>
            <span className={cx('num', styles.delta, styles[metric.sentiment])}>
              {formatDelta(metric.delta, metric.deltaDecimals)}
            </span>
          </div>
        </div>
      </div>

      <Sparkline
        values={metric.series}
        className={cx(styles.spark, metric.sentiment === 'bad' ? styles.warn : styles.calm)}
      />
    </GlassCard>
  )
}