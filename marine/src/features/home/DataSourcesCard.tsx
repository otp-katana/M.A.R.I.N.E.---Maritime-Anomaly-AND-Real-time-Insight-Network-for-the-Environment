import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { DatabaseIcon } from '@/components/layout/icons'
import { CardHeader } from '@/components/ui'
import { LiquidGlassCard } from '@/components/ui/LiquidGlassCard'
import { ArrowRightIcon } from '@/components/ui/icons'
import { DATA_MODE } from '@/config'
import { fetchSources } from '@/data/api'
import { useAsync } from '@/hooks/useAsync'
import { cx } from '@/utils/cx'
import { SourceRow } from './SourceRow'
import styles from './DataSourcesCard.module.css'

const DRAG_THRESHOLD_PX = 5

export function DataSourcesCard() {
  const { data, error } = useAsync(fetchSources)
  const listRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{
    active: boolean
    startY: number
    startScrollTop: number
    moved: boolean
  }>({
    active: false,
    startY: 0,
    startScrollTop: 0,
    moved: false,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const updateScrollCue = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    setCanScrollDown(remaining > 6)
  }, [])

  useEffect(() => {
    updateScrollCue()
    const el = listRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(updateScrollCue)
    observer.observe(el)
    return () => observer.disconnect()
  }, [data, error, updateScrollCue])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !listRef.current) return
    dragStateRef.current = {
      active: true,
      startY: e.clientY,
      startScrollTop: listRef.current.scrollTop,
      moved: false,
    }
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current
    const el = listRef.current
    if (!state.active || !el) return

    const deltaY = e.clientY - state.startY
    if (Math.abs(deltaY) >= DRAG_THRESHOLD_PX) {
      state.moved = true
    }
    el.scrollTop = state.startScrollTop - deltaY
  }

  const finishDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragStateRef.current.active = false
    setIsDragging(false)
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStateRef.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragStateRef.current.moved = false
    }
  }

  const handleScrollDownClick = () => {
    listRef.current?.scrollBy({ top: 108, behavior: 'smooth' })
  }

  return (
    <LiquidGlassCard padding="md" className={styles.card} contentClassName={styles.cardContent} lightOrigin="sources">
      <CardHeader
        icon={<DatabaseIcon width={18} height={18} />}
        title="Data Sources"
        subtitle="Multi-source integration"
        action={
          <Link to="/sources" className={styles.viewAll}>
            View all
            <ArrowRightIcon width={14} height={14} />
          </Link>
        }
      />

      <div className={styles.listWrap}>
        <div
          ref={listRef}
          onScroll={updateScrollCue}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onClickCapture={handleClickCapture}
          className={cx(
            styles.list,
            canScrollDown && styles.listFadeBottom,
            isDragging && styles.listDragging,
          )}
        >
          {DATA_MODE === 'sample' && (
            <p className={styles.sampleNote}>
              Statuses are sample values. The ingestion pipeline is not connected yet.
            </p>
          )}
          {error && <p className={styles.note}>Kaynaklar yüklenemedi.</p>}
          {!error && !data && [0, 1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
          {data?.map((source) => <SourceRow key={source.id} source={source} />)}
        </div>

        <div
          className={cx(styles.bottomCue, !canScrollDown && styles.bottomCueHidden)}
          aria-hidden={!canScrollDown}
        >
          <button
            type="button"
            onClick={handleScrollDownClick}
            className={styles.downCueBtn}
            tabIndex={canScrollDown ? 0 : -1}
            aria-label="Diğer veri kaynaklarını görmek için aşağı kaydır"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </LiquidGlassCard>
  )
}