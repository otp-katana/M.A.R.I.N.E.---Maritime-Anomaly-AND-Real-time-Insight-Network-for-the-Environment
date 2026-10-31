import { Link } from 'react-router-dom'
import { DatabaseIcon } from '@/components/layout/icons'
import { CardHeader, GlassCard } from '@/components/ui'
import { ArrowRightIcon } from '@/components/ui/icons'
import { fetchSources } from '@/data/api'
import { useAsync } from '@/hooks/useAsync'
import { SourceRow } from './SourceRow'
import styles from './DataSourcesCard.module.css'
import { DATA_MODE } from '@/config'

export function DataSourcesCard() {
  const { data, error } = useAsync(fetchSources)

  return (
    <GlassCard className={styles.card}>
      <CardHeader
        icon={<DatabaseIcon width={18} height={18} />}
        title="Data Sources"
        subtitle="Multi-source integration"
        action={
          <Link to="/sources" className={styles.viewAll}>
            View all
            <ArrowRightIcon width={14} height={14} />
          </Link>
        }
      />

      <div className={styles.list}>
        {DATA_MODE === 'sample' && (
          <p className={styles.sampleNote}>
            Statuses are sample values. The ingestion pipeline is not connected yet.
          </p>
        )}
        {error && <p className={styles.note}>Kaynaklar yüklenemedi.</p>}
        {!error && !data && [0, 1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
        {data?.map((source) => <SourceRow key={source.id} source={source} />)}
      </div>
    </GlassCard>
  )
}