import { Suspense, lazy } from 'react'
import { BrandCard } from './BrandCard'
import { ConditionsCard } from './ConditionsCard'
import { DataSourcesCard } from './DataSourcesCard'
import { GlanceCard } from './GlanceCard'
import { Hero } from './Hero'
import { InsightsCard } from './InsightsCard'
import { KpiRail } from './KpiRail'
import { LayersCard } from './LayersCard'
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

      <section className={styles.panelsLow}>
        <InsightsCard />
        <LayersCard />
        <BrandCard />
      </section>
    </>
  )
}