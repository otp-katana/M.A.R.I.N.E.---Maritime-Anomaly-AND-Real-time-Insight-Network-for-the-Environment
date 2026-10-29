import { GlassCard } from '@/components/ui'
import styles from './PlaceholderPage.module.css'

type Props = { title: string; description: string }

export function PlaceholderPage({ title, description }: Props) {
  return (
    <GlassCard padding="lg">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{description}</p>
    </GlassCard>
  )
}