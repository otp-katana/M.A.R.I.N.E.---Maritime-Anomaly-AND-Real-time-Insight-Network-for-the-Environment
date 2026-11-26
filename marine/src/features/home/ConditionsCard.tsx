import { useEffect, useRef, useState } from 'react'
import { AreaChart } from '@/components/charts/AreaChart'
import { CardHeader, SegmentedTabs } from '@/components/ui'
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard'
import { DropIcon } from '@/components/ui/icons'
import { fetchConditions } from '@/data/api'
import type { ConditionVariable } from '@/data/types'
import { useAsync } from '@/hooks/useAsync'
import { cx } from '@/utils/cx'
import styles from './ConditionsCard.module.css'

const TABS: { id: ConditionVariable; label: string }[] = [
  { id: 'temperature', label: 'Temperature' },
  { id: 'salinity', label: 'Salinity' },
  { id: 'chlorophyll', label: 'Chlorophyll' },
]

const CHART_SWAP_DELAY_MS = 110
const CHART_SETTLE_MS = 380

export function ConditionsCard() {
  const { data, error } = useAsync(fetchConditions)
  const [tab, setTab] = useState<ConditionVariable>('temperature')
  const [displayTab, setDisplayTab] = useState<ConditionVariable>('temperature')
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const prevTabRef = useRef<ConditionVariable>('temperature')

  useEffect(() => {
    if (tab === prevTabRef.current) return
    prevTabRef.current = tab

    setPhase('exiting')

    const swapTimer = window.setTimeout(() => {
      setDisplayTab(tab)
      setPhase('entering')
    }, CHART_SWAP_DELAY_MS)

    const settleTimer = window.setTimeout(() => {
      setPhase('idle')
    }, CHART_SETTLE_MS)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(settleTimer)
    }
  }, [tab])

  const series = data?.[displayTab]

  return (
    <LiquidGlassCard padding="md" lightOrigin="conditions" className={styles.card}>
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
          <div
            className={cx(
              styles.chartStage,
              phase === 'exiting' && styles.exiting,
              phase === 'entering' && styles.entering,
            )}
          >
            <AreaChart
              points={series.points}
              height={186}
              unit={series.unit}
              decimals={series.decimals}
              tickSuffix={series.tickSuffix}
              ariaLabel={`${series.label}, haziran-ekim zaman serisi`}
            />
          </div>
        )}
      </div>
    </LiquidGlassCard>
  )
}