import { useCallback, useRef, useState } from 'react'
import styles from './RunawayButton.module.css'

interface RunawayButtonProps {
  children: React.ReactNode
  /** How many dodges before it gives up and lets you click. */
  dodges?: number
  /** Called on the real, successful click. */
  onClick: () => void
  className?: string
}

/**
 * A button that leaps away from the pointer a few times before
 * finally surrendering and accepting the click. Pure troll energy.
 */
export function RunawayButton({
  children,
  dodges = 3,
  onClick,
  className,
}: RunawayButtonProps) {
  const [dodged, setDodged] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)

  const caught = dodged >= dodges

  const flee = useCallback(() => {
    if (caught) return
    const wrap = wrapRef.current
    const maxX = wrap ? Math.min(120, wrap.clientWidth / 2) : 100
    const angle = Math.random() * Math.PI * 2
    const dist = 70 + Math.random() * 60
    setOffset({
      x: Math.max(-maxX, Math.min(maxX, Math.cos(angle) * dist)),
      y: (Math.random() - 0.5) * 90,
    })
    setDodged((d) => d + 1)
  }, [caught])

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={`${styles.btn} ${caught ? styles.caught : ''} ${className ?? ''}`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onPointerEnter={flee}
        onPointerDown={(e) => {
          if (!caught) {
            e.preventDefault()
            flee()
            return
          }
          onClick()
        }}
      >
        {children}
      </button>
    </div>
  )
}
