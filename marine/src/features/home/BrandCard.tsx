import bgBrandCard from '@/assets/bg-brand_card.jpg'
import bgBrandCardLight from '@/assets/bg-brand_card-light.jpg'
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard'
import { cx } from '@/utils/cx'
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
        <img
          src={bgBrandCard}
          alt=""
          className={cx(styles.backdropImage, styles.backdropDark)}
        />
        <img
          src={bgBrandCardLight}
          alt=""
          className={cx(styles.backdropImage, styles.backdropLight)}
        />
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