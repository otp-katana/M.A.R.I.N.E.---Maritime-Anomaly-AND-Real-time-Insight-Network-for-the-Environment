import { ButtonLink, LiveBadge } from '@/components/ui'
import { ArrowRightIcon, SendIcon } from '@/components/ui/icons'
import { DATA_MODE } from '@/config'
import { mockStatus } from '@/data/mock/status'
import { formatUtcStamp } from '@/utils/format'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.status}>
        <LiveBadge />
        <span className={styles.updated}>
          {DATA_MODE === 'live' ? 'Last Updated: ' : 'Sample dataset · '}
          <span className="num">{formatUtcStamp(mockStatus.lastUpdated)}</span>
        </span>
      </div>

      <h1 id="hero-title" className={styles.title}>
        M.A.R.I.N.E.
      </h1>
      <p className={styles.tagline}>Unified Ocean Intelligence</p>
      <p className={styles.description}>
        Combining NOAA and NASA ocean data to monitor conditions and flag anomalies as
        they happen.
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