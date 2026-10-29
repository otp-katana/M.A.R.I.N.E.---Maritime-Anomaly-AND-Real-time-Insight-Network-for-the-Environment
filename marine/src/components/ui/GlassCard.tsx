import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '@/utils/cx'
import styles from './GlassCard.module.css'

type GlassCardProps<T extends ElementType> = {
  as?: T
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  glow?: boolean
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export function GlassCard<T extends ElementType = 'div'>({
  as,
  padding = 'md',
  interactive = false,
  glow = false,
  className,
  children,
  ...rest
}: GlassCardProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cx(
        styles.card,
        styles[padding],
        interactive && styles.interactive,
        glow && styles.glow,
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}