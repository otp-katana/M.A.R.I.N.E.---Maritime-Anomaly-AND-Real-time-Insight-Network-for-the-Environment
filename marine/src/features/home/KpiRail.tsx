import { GlassCard } from '@/components/ui'
import { fetchKpis } from '@/data/api'
import { useAsync } from '@/hooks/useAsync'
import { KpiCard } from './KpiCard'
import styles from './KpiRail.module.css'

export function KpiRail() {
  const { data, loading, error } = useAsync(fetchKpis)

  if (error) {
    return (
      <div className={styles.rail}>
        <GlassCard>Göstergeler yüklenemedi.</GlassCard>
      </div>
    )
  }

  return (
    <div className={styles.rail}>
      {loading || !data
        ? [0, 1, 2].map((i) => (
            <GlassCard key={i} className={styles.skeleton} aria-hidden="true" />
          ))
        : data.map((metric) => <KpiCard key={metric.id} metric={metric} />)}
    </div>
  )
}