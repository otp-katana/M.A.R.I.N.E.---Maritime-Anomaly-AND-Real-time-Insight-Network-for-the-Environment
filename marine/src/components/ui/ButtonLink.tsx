import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LiquidGlassLayer } from '@/components/ui/LiquidGlassCard'
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

function isReadMoreContent(children: ReactNode): boolean {
  if (typeof children === 'string') {
    return children.trim().toLowerCase() === 'read more'
  }
  if (Array.isArray(children)) {
    return children.some(isReadMoreContent)
  }
  return false
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
  const isGhost = variant === 'ghost'
  const isReadMore = isReadMoreContent(children)

  return (
    <Link
      to={to}
      className={cx(
        styles.btn,
        styles[variant],
        size === 'sm' && styles.sm,
        isReadMore && styles.readMore,
        className,
      )}
    >
      {isGhost && <LiquidGlassLayer />}
      <span className={styles.content}>
        {icon}
        {children}
        {trailingIcon}
      </span>
    </Link>
  )
}