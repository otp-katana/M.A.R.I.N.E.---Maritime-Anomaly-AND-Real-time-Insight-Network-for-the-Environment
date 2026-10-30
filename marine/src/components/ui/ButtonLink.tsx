import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/utils/cx'
import styles from './ButtonLink.module.css'

type Props = {
  to: string
  variant?: 'primary' | 'ghost'
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export function ButtonLink({ to, variant = 'primary', icon, className, children }: Props) {
  return (
    <Link to={to} className={cx(styles.btn, styles[variant], className)}>
      {icon}
      {children}
    </Link>
  )
}