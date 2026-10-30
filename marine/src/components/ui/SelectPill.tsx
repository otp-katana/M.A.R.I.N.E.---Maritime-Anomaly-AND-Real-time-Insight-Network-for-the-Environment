import { ChevronDownIcon } from './icons'
import styles from './SelectPill.module.css'

type Props<T extends string | number> = {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  ariaLabel: string
}

export function SelectPill<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <label className={styles.root}>
      <select
        className={styles.select}
        value={String(value)}
        aria-label={ariaLabel}
        onChange={(e) => {
          const next = options.find((o) => String(o.value) === e.target.value)
          if (next) onChange(next.value)
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={styles.chevron} width={14} height={14} />
    </label>
  )
}