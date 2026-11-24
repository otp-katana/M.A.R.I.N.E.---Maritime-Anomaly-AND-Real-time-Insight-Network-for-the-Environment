import { useEffect, useRef, type RefObject } from 'react'
import { LiquidGlassLayer } from '@/components/ui/LiquidGlassCard'
import { SearchIcon, UserIcon } from './icons'
import styles from './Topbar.module.css'

const isMac = /Mac|iPhone|iPad/i.test(navigator.userAgent)

type TopbarProps = {
  menuOpen: boolean
  onMenuClick: () => void
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function Topbar({ menuOpen, onMenuClick, menuButtonRef }: TopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Ctrl/⌘ + K ile aramaya odaklan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={styles.topbar}>
      <button
        ref={menuButtonRef}
        type="button"
        className={styles.menuButton}
        aria-label="Menüyü aç"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        onClick={onMenuClick}
      >
        <LiquidGlassLayer />
        <span className={styles.buttonContent}>
          <MenuIcon />
        </span>
      </button>

      <form className={styles.search} role="search" onSubmit={(e) => e.preventDefault()}>
        <LiquidGlassLayer />
        <SearchIcon width={18} height={18} className={styles.searchIcon} />
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          placeholder="Search regions, data, or insights..."
          aria-label="Ara"
        />
        <kbd className={styles.kbd}>{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
      </form>

      <button type="button" className={styles.avatar} aria-label="Profil">
        <LiquidGlassLayer />
        <span className={styles.buttonContent}>
          <UserIcon width={20} height={20} />
        </span>
      </button>
    </header>
  )
}