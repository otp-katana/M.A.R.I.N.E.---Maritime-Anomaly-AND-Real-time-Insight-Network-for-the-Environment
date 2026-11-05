import { useState } from 'react'
import { CardHeader, GlassCard } from '@/components/ui'
import { LayersIcon } from '@/components/ui/icons'
import { fetchLayers } from '@/data/api'
import { useAsync } from '@/hooks/useAsync'
import { cx } from '@/utils/cx'
import { LayerStack } from './LayerStack'
import styles from './LayersCard.module.css'

export function LayersCard() {
  const { data, error } = useAsync(fetchLayers)
  const [selected, setSelected] = useState<string | null>(null)
  const activeId = selected ?? data?.[0]?.id

  return (
    <GlassCard padding="none">
      <div className={styles.inner}>
        <CardHeader
          icon={<LayersIcon />}
          title="Ocean Layers"
          subtitle="Illustrative depth ranges"
        />

        <div className={styles.body}>
          {error && <p className={styles.note}>Katmanlar yüklenemedi.</p>}
          {!error && !data && <div className={styles.skeleton} />}
          {data && (
            <>
              <LayerStack layers={data} activeId={activeId} />
              <div className={styles.list} role="group" aria-label="Okyanus katmanı">
                {data.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={cx(styles.row, styles[layer.tone], layer.id === activeId && styles.active)}
                    aria-pressed={layer.id === activeId}
                    onClick={() => setSelected(layer.id)}
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.name}>{layer.name}</span>
                    <span className={cx('num', styles.depth)}>{layer.depth}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  )
}