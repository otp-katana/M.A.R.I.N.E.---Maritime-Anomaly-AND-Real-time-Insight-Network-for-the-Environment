import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/utils/cx'
import styles from './ButtonLink.module.css'

type Props = {
  to: string
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'sm'
  icon?: ReactNode
  trailingIcon?: ReactNode
  className?: string
  children: ReactNode
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  className,
  children,
}: Props) {
  return (
    <Link to={to} className={cx(styles.btn, styles[variant], size === 'sm' && styles.sm, className)}>
      {icon}
      {children}
      {trailingIcon}
    </Link>
  )
}