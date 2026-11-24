import { BrandCard } from './BrandCard'
import { ConditionsCard } from './ConditionsCard'
import { DataSourcesCard } from './DataSourcesCard'
import { GlanceCard } from './GlanceCard'
import { Hero } from './Hero'
import { InsightsCard } from './InsightsCard'
import { KpiRail } from './KpiRail'
import { LayersCard } from './LayersCard'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <>
      <section className={styles.stage}>
        {/* Dönen 3D küre slotu arka plan görseliyle değiştirildiği için kaldırıldı */}
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