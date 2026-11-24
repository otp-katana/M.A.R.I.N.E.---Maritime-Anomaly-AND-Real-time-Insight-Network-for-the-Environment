import { cx } from '@/utils/cx'
import bgDarkImage from '../../assets/bg-cosmic_horizon.jpg'
import bgLightImage from '../../assets/bg-cosmic_horizon-light.jpg'
import styles from './BackgroundArt.module.css'

export function BackgroundArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div
        className={cx(styles.imageLayer, styles.darkLayer)}
        style={{ backgroundImage: `url(${bgDarkImage})` }}
      />
      <div
        className={cx(styles.imageLayer, styles.lightLayer)}
        style={{ backgroundImage: `url(${bgLightImage})` }}
      />
    </div>
  )
}