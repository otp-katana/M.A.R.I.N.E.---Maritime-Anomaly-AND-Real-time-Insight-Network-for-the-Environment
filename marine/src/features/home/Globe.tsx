import { useEffect, useRef, type CSSProperties } from 'react'
import { Map as MapLibreMap, type StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { cx } from '@/utils/cx'
import styles from './Globe.module.css'

const GIBS_TILES =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg'

const GLOBE_STYLE: StyleSpecification = {
  version: 8,
  projection: { type: 'globe' },
  sources: {
    bluemarble: {
      type: 'raster',
      tiles: [GIBS_TILES],
      tileSize: 256,
      maxzoom: 8,
      attribution: 'Imagery: NASA GIBS',
    },
  },
  layers: [
    {
      id: 'bluemarble',
      type: 'raster',
      source: 'bluemarble',
      paint: {
        'raster-saturation': 0.15,
        'raster-contrast': 0.1,
        'raster-brightness-max': 0.85,
      },
    },
  ],
  sky: {
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
  },
}

/** Kürenin kapsayıcının kısa kenarına oranı (CSS'teki gölge de bunu kullanır). */
const GLOBE_FILL = 0.88
/** MapLibre'de zoom 0'da dünya 512 px; küre çapı = 512 · 2^zoom / π */
const WORLD_PX = 512
const ROTATION_DEG_PER_SEC = 4
const RESUME_DELAY_MS = 2500
const START_CENTER: [number, number] = [28, 22]

const wrapLng = (lng: number) => ((lng + 540) % 360) - 180

function fitZoom(size: number): number {
  const diameter = Math.max(size, 100) * GLOBE_FILL
  return Math.log2((diameter * Math.PI) / WORLD_PX)
}

export function Globe({ className }: { className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mapRef.current
    if (!container) return

    const map = new MapLibreMap({
      container,
      style: GLOBE_STYLE,
      center: START_CENTER,
      zoom: fitZoom(Math.min(container.clientWidth, container.clientHeight)),
      attributionControl: { compact: true },
      // Süs amaçlı küre: sadece sürükleyerek döndürülebilsin, sayfa kaydırmayı engellemesin
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      keyboard: false,
      dragRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
      maxPitch: 0,
    })

    map.once('load', () => {
      container.dataset.ready = 'true'
    })

    // Kapsayıcı boyutu değişince küreyi yeniden sığdır
    const observer = new ResizeObserver(() => {
      map.resize()
      map.setZoom(fitZoom(Math.min(container.clientWidth, container.clientHeight)))
    })
    observer.observe(container)

    // Yavaş otomatik dönüş (azaltılmış hareket tercihi varsa kapalı)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let paused = false
    let resumeTimer = 0
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!paused) {
        const c = map.getCenter()
        map.jumpTo({ center: [wrapLng(c.lng + ROTATION_DEG_PER_SEC * dt), c.lat] })
      }
      frame = requestAnimationFrame(tick)
    }

    if (!reduceMotion) {
      frame = requestAnimationFrame(tick)
      map.on('dragstart', () => {
        paused = true
        window.clearTimeout(resumeTimer)
      })
      map.on('dragend', () => {
        resumeTimer = window.setTimeout(() => {
          paused = false
        }, RESUME_DELAY_MS)
      })
    }

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resumeTimer)
      observer.disconnect()
      map.remove()
    }
  }, [])

  return (
    <div
      className={cx(styles.wrap, className)}
      style={{ '--globe-fill': GLOBE_FILL } as CSSProperties}
      role="img"
      aria-label="Dönen dünya küresi, NASA Blue Marble okyanus görüntüsü"
    >
      <div ref={mapRef} className={styles.map} />
      <div className={styles.shade} />
    </div>
  )
}