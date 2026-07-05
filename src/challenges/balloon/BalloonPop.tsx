import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import styles from './BalloonPop.module.css'

const TARGET = 16
const DURATION = 16
const COLORS = ['#ff5c8a', '#ffb703', '#8ecae6', '#a3e635', '#c084fc', '#fb7185']
const BOMB_PENALTY = 3
const BOMB_TAUNTS = [
  'BOOM! 💥 Inte alla ballonger är snälla...',
  'Aj. Den där var en bomb. -3! 💣',
  'Lär dig: svarta ballonger = fara. 💀',
]

interface Balloon {
  id: number
  left: number
  color: string
  drift: number
  duration: number
  bomb: boolean
}

let balloonSeq = 0

function makeBalloon(): Balloon {
  const bomb = Math.random() < 0.18
  return {
    id: balloonSeq++,
    left: 6 + Math.random() * 82,
    color: bomb ? '#1f2937' : COLORS[Math.floor(Math.random() * COLORS.length)],
    drift: (Math.random() - 0.5) * 40,
    duration: 3.4 + Math.random() * 2.2,
    bomb,
  }
}

type Phase = 'idle' | 'playing' | 'won' | 'lost'

export function BalloonPop({ onComplete }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [popped, setPopped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [taunt, setTaunt] = useState<string | null>(null)
  const spawnRef = useRef<number | undefined>(undefined)
  const tickRef = useRef<number | undefined>(undefined)

  const stop = useCallback(() => {
    window.clearInterval(spawnRef.current)
    window.clearInterval(tickRef.current)
  }, [])

  const start = useCallback(() => {
    setPhase('playing')
    setPopped(0)
    setTimeLeft(DURATION)
    setBalloons([makeBalloon(), makeBalloon(), makeBalloon()])

    spawnRef.current = window.setInterval(() => {
      setBalloons((prev) => [...prev, makeBalloon()].slice(-14))
    }, 620)

    tickRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(spawnRef.current)
          window.clearInterval(tickRef.current)
          setPhase((p) => (p === 'playing' ? 'lost' : p))
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => stop, [stop])

  const pop = useCallback(
    (b: Balloon) => {
      setBalloons((prev) => prev.filter((x) => x.id !== b.id))
      if (b.bomb) {
        setTaunt(BOMB_TAUNTS[Math.floor(Math.random() * BOMB_TAUNTS.length)])
        window.setTimeout(() => setTaunt(null), 1200)
        setPopped((n) => Math.max(0, n - BOMB_PENALTY))
        return
      }
      setPopped((n) => {
        const next = n + 1
        if (next >= TARGET) {
          stop()
          setPhase('won')
        }
        return next
      })
    },
    [stop],
  )

  useEffect(() => {
    if (phase === 'won') {
      const t = window.setTimeout(onComplete, 900)
      return () => window.clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === 'idle' || phase === 'lost') {
    return (
      <div className={styles.center}>
        {phase === 'lost' && (
          <p className={styles.lost}>Nästan! Du poppade {popped} av {TARGET}. Testa igen! 🎈</p>
        )}
        <p className={styles.warn}>Psst: poppa INTE de svarta ballongerna 💣</p>
        <button type="button" className={styles.startBtn} onClick={start}>
          {phase === 'lost' ? 'Försök igen' : 'Starta'}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stage}>
      <div className={styles.hud}>
        <span>🎈 {popped}/{TARGET}</span>
        <span className={timeLeft <= 4 ? styles.urgent : ''}>⏱ {timeLeft}s</span>
      </div>

      {phase === 'won' && <div className={styles.win}>🎉 Klart!</div>}
      {taunt && <div className={styles.taunt}>{taunt}</div>}

      <div className={styles.field}>
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label={b.bomb ? 'Bomb' : 'Poppa ballong'}
            className={`${styles.balloon} ${b.bomb ? styles.bomb : ''}`}
            style={
              {
                left: `${b.left}%`,
                background: b.color,
                '--drift': `${b.drift}px`,
                '--dur': `${b.duration}s`,
              } as React.CSSProperties
            }
            onPointerDown={() => pop(b)}
          >
            {b.bomb ? '💣' : ''}
          </button>
        ))}
      </div>
    </div>
  )
}
