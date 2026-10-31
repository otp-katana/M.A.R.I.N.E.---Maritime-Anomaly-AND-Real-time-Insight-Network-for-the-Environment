import { useEffect, useRef } from 'react'
import { SearchIcon, UserIcon } from './icons'
import styles from './Topbar.module.css'

const isMac = /Mac|iPhone|iPad/i.test(navigator.userAgent)

export function Topbar() {
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
      <form className={styles.search} role="search" onSubmit={(e) => e.preventDefault()}>
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
        <UserIcon width={20} height={20} />
      </button>
    </header>
  )
}