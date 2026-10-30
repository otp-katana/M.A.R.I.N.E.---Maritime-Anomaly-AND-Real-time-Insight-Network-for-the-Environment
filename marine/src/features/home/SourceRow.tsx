import type { ComponentType, SVGProps } from 'react'
import { AlertIcon, BuoyIcon, GlobeIcon, OrbitIcon } from '@/components/ui/icons'
import type { DataSource, SourceIcon, SourceStatus } from '@/data/types'
import { cx } from '@/utils/cx'
import styles from './SourceRow.module.css'

const ICONS: Record<SourceIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  buoy: BuoyIcon,
  orbit: OrbitIcon,
  alert: AlertIcon,
  globe: GlobeIcon,
}

const STATUS_LABEL: Record<SourceStatus, string> = {
  online: 'Online',
  delayed: 'Delayed',
  planned: 'Planned',
}

export function SourceRow({ source }: { source: DataSource }) {
  const Icon = ICONS[source.icon]

  return (
    <div className={styles.row}>
      <span className={styles.icon}>
        <Icon />
      </span>

      <div className={styles.meta}>
        <div className={styles.name}>{source.name}</div>
        <div className={styles.desc}>{source.description}</div>
      </div>

      <span className={cx(styles.status, styles[source.status])}>
        <span className={styles.dot} aria-hidden="true" />
        {STATUS_LABEL[source.status]}
      </span>
    </div>
  )
}