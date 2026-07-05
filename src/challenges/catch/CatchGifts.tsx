import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import styles from './CatchGifts.module.css'

const GOAL = 10
const LIVES = 3
const GIFTS = ['🎁', '🎀', '🍰', '⭐️', '🍬']
const BOMB = '💣'

interface Item {
  id: number
  x: number // 0..100 (%)
  y: number // px from top
  speed: number
  emoji: string
  bomb: boolean
}

let seq = 0
type Phase = 'idle' | 'playing' | 'won' | 'lost'

export function CatchGifts({ onComplete }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [items, setItems] = useState<Item[]>([])
  const [basketX, setBasketX] = useState(50)
  const [taunt, setTaunt] = useState<string | null>(null)

  const fieldRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const lastSpawn = useRef(0)
  const basketXRef = useRef(50)
  const scoreRef = useRef(0)
  const livesRef = useRef(LIVES)

  const fakeWin = () => {
    setTaunt('HAHA! Den knappen var falsk. -4 presenter! 😈')
    window.setTimeout(() => setTaunt(null), 1400)
    scoreRef.current = Math.max(0, scoreRef.current - 4)
    setScore(scoreRef.current)
  }

  const reset = () => {
    scoreRef.current = 0
    livesRef.current = LIVES
    seq = 0
    setScore(0)
    setLives(LIVES)
    setItems([])
    setBasketX(50)
    basketXRef.current = 50
  }

  const start = () => {
    reset()
    setPhase('playing')
  }

  const moveTo = useCallback((clientX: number) => {
    const el = fieldRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    const clamped = Math.max(6, Math.min(94, pct))
    basketXRef.current = clamped
    setBasketX(clamped)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    let mounted = true
    let prev = performance.now()

    const loop = (now: number) => {
      if (!mounted) return
      const dt = Math.min(48, now - prev)
      prev = now

      if (now - lastSpawn.current > 780) {
        lastSpawn.current = now
        const bomb = Math.random() < 0.22
        setItems((list) => [
          ...list,
          {
            id: seq++,
            x: 8 + Math.random() * 84,
            y: -40,
            speed: 0.12 + Math.random() * 0.12,
            emoji: bomb ? BOMB : GIFTS[Math.floor(Math.random() * GIFTS.length)],
            bomb,
          },
        ])
      }

      setItems((list) => {
        const kept: Item[] = []
        for (const it of list) {
          const ny = it.y + it.speed * dt
          const el = fieldRef.current
          const h = el ? el.clientHeight : 500
          if (ny >= h - 72) {
            const hit = Math.abs(it.x - basketXRef.current) < 12
            if (hit && !it.bomb) {
              scoreRef.current += 1
              setScore(scoreRef.current)
            } else if (hit && it.bomb) {
              livesRef.current -= 1
              setLives(livesRef.current)
            }
            // missed non-bombs are harmless; caught bombs cost a life
            continue
          }
          kept.push({ ...it, y: ny })
        }
        return kept
      })

      if (scoreRef.current >= GOAL) {
        setPhase('won')
        return
      }
      if (livesRef.current <= 0) {
        setPhase('lost')
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      mounted = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'won') {
      const t = window.setTimeout(onComplete, 900)
      return () => window.clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === 'idle' || phase === 'lost') {
    return (
      <div className={styles.center}>
        <p className={styles.help}>
          Dra korgen i sidled och fånga {GOAL} presenter. Undvik bomberna 💣 –
          och tro inte på allt du ser. 😉
        </p>
        {phase === 'lost' && (
          <p className={styles.lost}>Oj, bomberna tog dig! Du fångade {score}. Testa igen.</p>
        )}
        <button type="button" className={styles.startBtn} onClick={start}>
          {phase === 'lost' ? 'Försök igen' : 'Starta'}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stage}>
      <div className={styles.hud}>
        <span>🎁 {score}/{GOAL}</span>
        <span>{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</span>
      </div>

      {phase === 'won' && <div className={styles.win}>🎉 Klart!</div>}
      {taunt && <div className={styles.taunt}>{taunt}</div>}

      {score >= Math.ceil(GOAL / 2) && phase === 'playing' && (
        <button type="button" className={styles.fakeWin} onClick={fakeWin}>
          🏆 Klart! Hämta belöning
        </button>
      )}

      <div
        ref={fieldRef}
        className={styles.field}
        onPointerMove={(e) => moveTo(e.clientX)}
        onPointerDown={(e) => moveTo(e.clientX)}
      >
        {items.map((it) => (
          <span
            key={it.id}
            className={styles.item}
            style={{ left: `${it.x}%`, top: `${it.y}px` }}
          >
            {it.emoji}
          </span>
        ))}
        <div className={styles.basket} style={{ left: `${basketX}%` }}>
          🧺
        </div>
      </div>
    </div>
  )
}
