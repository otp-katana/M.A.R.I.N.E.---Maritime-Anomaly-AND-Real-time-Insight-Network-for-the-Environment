import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type SVGProps,
} from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui'
import { LiquidGlassCard, LiquidGlassLayer } from '@/components/ui/LiquidGlassCard'
import { cx } from '@/utils/cx'
import { ChartIcon, DatabaseIcon, HomeIcon, InfoIcon, MapIcon } from './icons'
import { LogoMark } from './LogoMark'
import styles from './Sidebar.module.css'

type NavItem = {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  end?: boolean
}

type PromoSlide = {
  id: string
  title: string
  text: string
  orbTone: 'ocean' | 'cyan' | 'violet'
}

const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartIcon },
  { to: '/sources', label: 'Data Sources', icon: DatabaseIcon },
  { to: '/about', label: 'About', icon: InfoIcon },
]

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'unified',
    title: 'Ocean. Unified.',
    text: 'Global marine observatory & live analytics.',
    orbTone: 'ocean',
  },
  {
    id: 'telemetry',
    title: 'NOAA & NASA',
    text: 'Multi-sensor SST, salinity & chlorophyll feeds.',
    orbTone: 'cyan',
  },
  {
    id: 'anomalies',
    title: 'Anomaly Radar',
    text: 'Early thermal shift & bloom detection.',
    orbTone: 'violet',
  },
]

const PROMO_INTERVAL_MS = 5000
const DRAG_THRESHOLD_PX = 26
const NAV_LEAVE_MS = 240
const NAV_CLEAR_MS = 780

type SidebarProps = {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const dragStartXRef = useRef<number | null>(null)
  const leaveTimerRef = useRef<number | null>(null)
  const clearTimerRef = useRef<number | null>(null)

  const routeIndex = NAV.findIndex(({ to, end }) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`),
  )

  const [visualIndex, setVisualIndex] = useState(routeIndex)
  const [indicatorPos, setIndicatorPos] = useState<{ top: number; height: number } | null>(null)
  const [navStep, setNavStep] = useState<{ dir: 'up' | 'down'; parity: 0 | 1; span: number } | null>(null)

  const triggerStep = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex === visualIndex) return
    setNavStep((s) => ({
      dir: nextIndex > visualIndex ? 'down' : 'up',
      parity: s?.parity === 0 ? 1 : 0,
      span: Math.abs(nextIndex - visualIndex),
    }))
    setVisualIndex(nextIndex)
  }

  const clearTimers = () => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current)
      clearTimerRef.current = null
    }
  }

  const handleSyncedNavigate = (e: MouseEvent<HTMLAnchorElement>, to: string, nextIndex: number) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()

    if (nextIndex === visualIndex) return

    clearTimers()
    triggerStep(nextIndex)

    const isToHome = to === '/'
    document.documentElement.setAttribute(
      'data-nav-target',
      isToHome ? 'home' : 'subpage',
    )
    document.documentElement.setAttribute('data-nav-transition', 'leaving')

    leaveTimerRef.current = window.setTimeout(() => {
      navigate(to)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.setAttribute('data-nav-transition', 'entering')
        })
      })
    }, NAV_LEAVE_MS)

    clearTimerRef.current = window.setTimeout(() => {
      document.documentElement.removeAttribute('data-nav-transition')
      document.documentElement.removeAttribute('data-nav-target')
    }, NAV_CLEAR_MS)
  }

  useEffect(() => () => clearTimers(), [])

  useLayoutEffect(() => {
    if (routeIndex !== visualIndex) {
      triggerStep(routeIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIndex])

  useLayoutEffect(() => {
    const el = linkRefs.current[visualIndex]
    if (!el) return
    setIndicatorPos({ top: el.offsetTop, height: el.offsetHeight })
  }, [visualIndex, open])

  const [promoIndex, setPromoIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (open) navRef.current?.querySelector('a')?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (isPaused || isDragging) return

    const timer = window.setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_SLIDES.length)
    }, PROMO_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [promoIndex, isPaused, isDragging])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    dragStartXRef.current = e.clientX
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) return
    const delta = e.clientX - dragStartXRef.current
    setDragOffset(Math.max(-64, Math.min(64, delta)))
  }

  const finishDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (dragOffset <= -DRAG_THRESHOLD_PX) {
      setPromoIndex((prev) => (prev + 1) % PROMO_SLIDES.length)
    } else if (dragOffset >= DRAG_THRESHOLD_PX) {
      setPromoIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)
    }

    dragStartXRef.current = null
    setDragOffset(0)
    setIsDragging(false)
  }

  // Uzun atlamalarda aşırı şişmeyi önlemek için esneme katsayısı sıkı sınırda tutulur
  const stretchScale = navStep ? Math.min(1.13, 1.07 + (navStep.span - 1) * 0.015) : 1.11

  return (
    <aside id="app-sidebar" className={cx(styles.sidebar, open && styles.open)}>
      <LiquidGlassLayer />

      <div className={styles.inner}>
        <NavLink
          to="/"
          onClick={(e) => handleSyncedNavigate(e, '/', 0)}
          className={styles.brand}
          aria-label="M.A.R.I.N.E. ana sayfa"
        >
          <LogoMark />
          <span className={styles.wordmark}>M.A.R.I.N.E.</span>
        </NavLink>

        <nav
          ref={navRef}
          className={styles.nav}
          aria-label="Ana menü"
          style={
            {
              ['--indicator-y' as string]: `${indicatorPos?.top ?? Math.max(0, visualIndex) * 51}px`,
              ['--indicator-h' as string]: `${indicatorPos?.height ?? 44}px`,
              ['--stretch-y' as string]: stretchScale,
            } as CSSProperties
          }
        >
          {visualIndex >= 0 && (
            <div
              className={cx(
                styles.activeIndicator,
                navStep?.dir === 'down' &&
                  (navStep.parity === 0 ? styles.stretchDown0 : styles.stretchDown1),
                navStep?.dir === 'up' &&
                  (navStep.parity === 0 ? styles.stretchUp0 : styles.stretchUp1),
              )}
              aria-hidden="true"
            >
              <LiquidGlassLayer />
            </div>
          )}

          {NAV.map(({ to, label, icon: Icon, end }, idx) => {
            const isVisualActive = idx === visualIndex
            return (
              <NavLink
                key={to}
                ref={(el) => {
                  linkRefs.current[idx] = el
                }}
                to={to}
                end={end}
                title={label}
                onClick={(e) => handleSyncedNavigate(e, to, idx)}
                className={cx(styles.link, isVisualActive && styles.active)}
              >
                <span className={styles.linkContent}>
                  <Icon />
                  <span className={styles.label}>{label}</span>
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className={styles.footer}>
          <LiquidGlassCard className={styles.promo} contentClassName={styles.promoContent}>
            <div
              className={cx(styles.promoInteractive, isDragging && styles.promoDragging)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              role="region"
              aria-roledescription="carousel"
              aria-label="Öne çıkan duyurular"
            >
              <div className={styles.promoViewport}>
                <div
                  className={cx(styles.promoTrack, isDragging && styles.promoTrackDragging)}
                  style={{
                    transform: `translate3d(calc(-${promoIndex * 100}% + ${dragOffset}px), 0, 0)`,
                  }}
                >
                  {PROMO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={styles.promoSlide}
                      aria-hidden={idx !== promoIndex}
                    >
                      <div
                        className={cx(
                          styles.orb,
                          slide.orbTone === 'cyan' && styles.orbCyan,
                          slide.orbTone === 'violet' && styles.orbViolet,
                        )}
                        aria-hidden="true"
                      />
                      <p className={styles.promoTitle}>{slide.title}</p>
                      <p className={styles.promoText}>{slide.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.promoIndicators} role="tablist" aria-label="Promo seçimi">
                {PROMO_SLIDES.map((slide, idx) => {
                  const active = idx === promoIndex
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`${idx + 1}. duyuru: ${slide.title}`}
                      className={cx(styles.promoLine, active && styles.promoLineActive)}
                      onClick={() => setPromoIndex(idx)}
                    >
                      <span
                        key={active ? `fill-${promoIndex}` : `idle-${idx}`}
                        className={cx(
                          styles.promoLineFill,
                          active && !isPaused && !isDragging && styles.promoLineAnimating,
                          active && (isPaused || isDragging) && styles.promoLineHold,
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </LiquidGlassCard>

          <ThemeToggle className={styles.toggle} />
        </div>
      </div>
    </aside>
  )
}