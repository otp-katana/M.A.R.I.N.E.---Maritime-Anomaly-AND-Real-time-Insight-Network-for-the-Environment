import { ButtonLink, CardHeader, GlassCard } from '@/components/ui'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/icons'
import { DATA_MODE } from '@/config'
import { fetchInsights } from '@/data/api'
import type { Insight } from '@/data/types'
import { useAsync } from '@/hooks/useAsync'
import { cx } from '@/utils/cx'
import { formatUtcStamp } from '@/utils/format'
import { OceanThumb } from './OceanThumb'
import styles from './InsightsCard.module.css'

const KIND_LABEL: Record<Insight['kind'], string> = {
  measured: 'Measured',
  modeled: 'Model-derived',
}

export function InsightsCard() {
  const { data, error } = useAsync(fetchInsights)
  const insight = data?.[0]

  return (
    <GlassCard padding="none">
      <div className={styles.inner}>
        <CardHeader
          icon={<SparkleIcon />}
          title="Key Insights"
          action={
            insight && (
              <div className={styles.meta}>
                {DATA_MODE === 'sample' && <span className={styles.sample}>Sample</span>}
                <span className={cx(styles.kind, styles[insight.kind])}>
                  {KIND_LABEL[insight.kind]}
                </span>
                <span>{insight.region}</span>
                <span>{insight.dataset}</span>
                <span className="num">{formatUtcStamp(insight.observedAt)}</span>
              </div>
            )
          }
        />

        <div className={styles.body}>
          <OceanThumb className={styles.thumb} />

          <div className={styles.text}>
            {error && <p className={styles.note}>İçgörüler yüklenemedi.</p>}
            {!error && !insight && <div className={styles.skeleton} />}
            {insight && (
              <>
                <h3 className={styles.title}>{insight.title}</h3>
                <p className={styles.summary}>{insight.summary}</p>
              </>
            )}
          </div>

          <ButtonLink
            to="/analytics"
            variant="ghost"
            size="sm"
            trailingIcon={<ArrowRightIcon width={14} height={14} />}
          >
            Read More
          </ButtonLink>
        </div>
      </div>
    </GlassCard>
  )
}