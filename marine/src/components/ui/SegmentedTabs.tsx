import { cx } from '@/utils/cx'
import styles from './SegmentedTabs.module.css'

type Option<T extends string> = { id: T; label: string }

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (id: T) => void
  ariaLabel: string
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <div className={styles.root} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === value}
          className={cx(styles.tab, o.id === value && styles.active)}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}