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

// SegmentedTabs mercek geçiş süresinin (400ms) tam orta noktası
const CHART_SWAP_DELAY_MS = 190

export function ConditionsCard() {
  const { data, error } = useAsync(fetchConditions)
  const [tab, setTab] = useState<ConditionVariable>('temperature')
  const [displayTab, setDisplayTab] = useState<ConditionVariable>('temperature')
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const prevTabRef = useRef<ConditionVariable>('temperature')

  useEffect(() => {
    if (tab === prevTabRef.current) return

    const prevIndex = TABS.findIndex((t) => t.id === prevTabRef.current)
    const nextIndex = TABS.findIndex((t) => t.id === tab)
    setDirection(nextIndex >= prevIndex ? 'next' : 'prev')
    prevTabRef.current = tab

    setPhase('exiting')

    const swapTimer = window.setTimeout(() => {
      setDisplayTab(tab)
      setPhase('entering')
    }, CHART_SWAP_DELAY_MS)

    const settleTimer = window.setTimeout(() => {
      setPhase('idle')
    }, 400)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(settleTimer)
    }
  }, [tab])

  const series = data?.[displayTab]

  return (
    <LiquidGlassCard padding="md">
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
              direction === 'prev' && styles.reverse,
            )}
          >
            <AreaChart
              key={displayTab}
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