import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // Esc ve karartma ile kapanınca odak hamburger düğmesine döner
  const closeNav = useCallback(() => {
    setNavOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  // Sayfa değişince çekmece kapanır
  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  // Ekran 1024 px ve üstüne genişleyince çekmece kapanır
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setNavOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Açıkken: Esc ile kapat, sayfa kaydırmasını kilitle
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [navOpen, closeNav])

  return (
    <div className={styles.shell}>
      <Sidebar open={navOpen} />
      {navOpen && <div className={styles.scrim} onClick={closeNav} aria-hidden="true" />}
      <div className={styles.main}>
        <div className={styles.frame}>
          <Topbar
            menuOpen={navOpen}
            onMenuClick={() => setNavOpen((v) => !v)}
            menuButtonRef={menuButtonRef}
          />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}