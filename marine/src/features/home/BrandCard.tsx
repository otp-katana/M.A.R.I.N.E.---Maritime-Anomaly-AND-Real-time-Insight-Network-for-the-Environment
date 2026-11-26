import bgBrandCard from '@/assets/bg-brand_card.jpg'
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard'
import styles from './BrandCard.module.css'

export function BrandCard() {
  return (
    <LiquidGlassCard
      padding="none"
      className={styles.card}
      contentClassName={styles.glassContent}
      lightOrigin="brand"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <img src={bgBrandCard} alt="" className={styles.backdropImage} />
      </div>

      <div className={styles.content}>
        <span className={styles.mark}>M.A.R.I.N.E.</span>
        <p className={styles.message}>
          For a healthier,
          <br />
          more balanced ocean.
        </p>
        <span className={styles.rule} aria-hidden="true" />
      </div>
    </LiquidGlassCard>
  )
}