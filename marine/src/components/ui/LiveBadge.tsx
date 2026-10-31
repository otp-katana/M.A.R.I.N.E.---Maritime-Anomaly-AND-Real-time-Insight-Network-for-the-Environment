import { DATA_MODE } from '@/config'
import { cx } from '@/utils/cx'
import styles from './LiveBadge.module.css'

const COPY = {
  live: { label: 'Live Data', hint: 'Veriler canlı kaynaklardan geliyor' },
  sample: {
    label: 'Sample Data',
    hint: 'Arayüz örnek (mock) veriyle çalışıyor; gerçek ölçüm değildir',
  },
} as const

export function LiveBadge() {
  const { label, hint } = COPY[DATA_MODE]

  return (
    <span className={cx(styles.badge, styles[DATA_MODE])} title={hint}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  )
}