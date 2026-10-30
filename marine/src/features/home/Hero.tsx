import { ButtonLink } from '@/components/ui'
import { ArrowRightIcon, SendIcon } from '@/components/ui/icons'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.title}>
        M.A.R.I.N.E.
      </h1>
      <p className={styles.tagline}>Real-time Ocean Intelligence</p>
      <p className={styles.description}>
        Buoy, satellite and event data from NOAA and NASA, unified in one place to
        monitor ocean conditions and flag anomalies as they happen.
      </p>
      <div className={styles.actions}>
        <ButtonLink to="/map" icon={<SendIcon />}>
          Explore the Ocean
        </ButtonLink>
        <ButtonLink to="/about" variant="ghost" icon={<ArrowRightIcon />}>
          How it Works
        </ButtonLink>
      </div>
    </section>
  )
}