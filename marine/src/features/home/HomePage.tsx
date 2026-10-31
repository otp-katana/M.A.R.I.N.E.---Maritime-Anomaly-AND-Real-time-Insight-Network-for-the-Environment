import { Suspense, lazy } from 'react'
import { ConditionsCard } from './ConditionsCard'
import { DataSourcesCard } from './DataSourcesCard'
import { GlanceCard } from './GlanceCard'
import { Hero } from './Hero'
import { KpiRail } from './KpiRail'
import styles from './HomePage.module.css'

const Globe = lazy(() => import('./Globe').then((m) => ({ default: m.Globe })))

export function HomePage() {
  return (
    <>
      <section className={styles.stage}>
        <div className={styles.globeSlot}>
          <Suspense fallback={null}>
            <Globe />
          </Suspense>
        </div>
        <Hero />
        <KpiRail />
      </section>

      <section className={styles.panels}>
        <GlanceCard />
        <ConditionsCard />
        <DataSourcesCard />
      </section>
    </>
  )
}