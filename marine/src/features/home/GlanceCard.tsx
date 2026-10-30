import { useCallback, useState } from 'react'
import { CardHeader, GlassCard, SelectPill } from '@/components/ui'
import { BarsIcon } from '@/components/ui/icons'
import { fetchGlance } from '@/data/api'
import type { RangeDays } from '@/data/types'
import { useAsync } from '@/hooks/useAsync'
import { MetricRow } from './MetricRow'
import styles from './GlanceCard.module.css'

const RANGE_OPTIONS: { value: RangeDays; label: string }[] = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
]

export function GlanceCard() {
  const [range, setRange] = useState<RangeDays>(30)
  const load = useCallback(() => fetchGlance(range), [range])
  const { data, error } = useAsync(load)

  return (
    <GlassCard>
      <CardHeader
        icon={<BarsIcon />}
        title="Ocean at a Glance"
        subtitle="Global overview"
        action={
          <SelectPill
            value={range}
            options={RANGE_OPTIONS}
            onChange={setRange}
            ariaLabel="Zaman aralığı"
          />
        }
      />

      <div className={styles.container}>
        <div className={styles.body}>
          <div className={styles.orb} aria-hidden="true" />
          <div className={styles.rows}>
            {error && <p className={styles.note}>Veriler yüklenemedi.</p>}
            {!error && !data && [0, 1, 2].map((i) => <div key={i} className={styles.skeleton} />)}
            {data?.map((metric) => <MetricRow key={metric.id} metric={metric} />)}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}