import { useEffect, useRef } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui'
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

const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartIcon },
  { to: '/sources', label: 'Data Sources', icon: DatabaseIcon },
  { to: '/about', label: 'About', icon: InfoIcon },
]

type SidebarProps = {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null)

  // Çekmece açılınca odak ilk menü bağlantısına geçer
  useEffect(() => {
    if (open) navRef.current?.querySelector('a')?.focus({ preventScroll: true })
  }, [open])

  return (
    <aside id="app-sidebar" className={cx(styles.sidebar, open && styles.open)}>
      <NavLink to="/" className={styles.brand} aria-label="M.A.R.I.N.E. ana sayfa">
        <LogoMark />
        <span className={styles.wordmark}>M.A.R.I.N.E.</span>
      </NavLink>

      <nav ref={navRef} className={styles.nav} aria-label="Ana menü">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) => cx(styles.link, isActive && styles.active)}
          >
            <Icon />
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.promo}>
          <div className={styles.orb} aria-hidden="true" />
          <p className={styles.promoTitle}>Ocean. Observed.</p>
          <p className={styles.promoText}>A smarter planet.</p>
        </div>
        <ThemeToggle className={styles.toggle} />
      </div>
    </aside>
  )
}