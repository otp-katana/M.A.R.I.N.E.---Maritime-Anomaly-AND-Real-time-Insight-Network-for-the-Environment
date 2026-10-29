import styles from './LiveBadge.module.css'

export function LiveBadge({ label = 'Live Data' }: { label?: string }) {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  )
}