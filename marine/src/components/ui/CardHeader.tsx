import type { ReactNode } from 'react'
import styles from './CardHeader.module.css'

type CardHeaderProps = {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <header className={styles.header}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  )
}