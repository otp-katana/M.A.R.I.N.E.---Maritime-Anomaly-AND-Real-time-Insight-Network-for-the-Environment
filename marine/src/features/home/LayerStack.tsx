import type { OceanLayer } from '@/data/types'
import { cx } from '@/utils/cx'
import styles from './LayerStack.module.css'

const PLANE_H = 46
const STEP = 24
const PAD = 3

type Props = {
  layers: OceanLayer[]
  activeId: string | undefined
  className?: string
}

/** Katmanları izometrik düzlemler olarak üst üste çizer; ilk eleman en üstte. */
export function LayerStack({ layers, activeId, className }: Props) {
  const height = PAD * 2 + (layers.length - 1) * STEP + PLANE_H

  return (
    <svg className={cx(styles.svg, className)} viewBox={`0 0 170 ${height}`} aria-hidden="true">
      {layers
        .map((layer, i) => ({ layer, y: PAD + i * STEP }))
        .reverse()
        .map(({ layer, y }) => (
          <polygon
            key={layer.id}
            className={cx(styles.plane, styles[layer.tone], layer.id === activeId && styles.active)}
            points={`85,${y} 163,${y + 23} 85,${y + PLANE_H} 7,${y + 23}`}
          />
        ))}
    </svg>
  )
}