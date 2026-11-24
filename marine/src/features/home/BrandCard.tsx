import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard'
import styles from './BrandCard.module.css'

export function BrandCard() {
  return (
    <LiquidGlassCard padding="none" className={styles.card} contentClassName={styles.glassContent}>
      <div className={styles.content}>
        <span className={styles.mark}>M.A.R.I.N.E.</span>
        <p className={styles.message}>For a healthier, more balanced ocean.</p>
        <span className={styles.rule} aria-hidden="true" />
      </div>
    </LiquidGlassCard>
  )
}