import { useState } from 'react'
import { AreaChart } from '@/components/charts/AreaChart'
import { CardHeader, GlassCard, SegmentedTabs } from '@/components/ui'
import { DropIcon } from '@/components/ui/icons'
import { fetchConditions } from '@/data/api'
import type { ConditionVariable } from '@/data/types'
import { useAsync } from '@/hooks/useAsync'
import styles from './ConditionsCard.module.css'

const TABS: { id: ConditionVariable; label: string }[] = [
  { id: 'temperature', label: 'Temperature' },
  { id: 'salinity', label: 'Salinity' },
  { id: 'chlorophyll', label: 'Chlorophyll' },
]

export function ConditionsCard() {
  const { data, error } = useAsync(fetchConditions)
  const [tab, setTab] = useState<ConditionVariable>('temperature')
  const series = data?.[tab]

  return (
    <GlassCard>
      <CardHeader
        icon={<DropIcon />}
        title="Ocean Conditions"
        subtitle="Explore key variables"
        action={
          <SegmentedTabs options={TABS} value={tab} onChange={setTab} ariaLabel="Değişken" />
        }
      />

      <div className={styles.body}>
        {error && <p className={styles.note}>Grafik verisi yüklenemedi.</p>}
        {!error && !series && <div className={styles.skeleton} />}
        {series && (
          <AreaChart
            key={tab}
            points={series.points}
            height={186}
            unit={series.unit}
            decimals={series.decimals}
            tickSuffix={series.tickSuffix}
            ariaLabel={`${series.label}, haziran-ekim zaman serisi`}
          />
        )}
      </div>
    </GlassCard>
  )
}