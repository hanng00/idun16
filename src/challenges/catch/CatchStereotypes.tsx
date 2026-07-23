import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import { GENDER_COLORS } from '../../config'
import styles from './CatchStereotypes.module.css'

const DURATION = 25
const GOAL = 15

// Boy stereotypes
const BOY_ITEMS = ['🔧', '🚗', '⚽', '🏈', '🔨', '🎮', '🦖', '🚀']
// Girl stereotypes  
const GIRL_ITEMS = ['👗', '💄', '🎀', '💅', '👠', '🌸', '🦄', '💎']
// Danger - Socialtjänsten!
const DANGER = '👮'

interface Item {
  id: number
  x: number
  y: number
  speed: number
  emoji: string
  type: 'boy' | 'girl' | 'danger'
}

let seq = 0
type Phase = 'idle' | 'playing' | 'won'

export function CatchStereotypes({ onComplete, onScoreChange }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [boyScore, setBoyScore] = useState(0)
  const [girlScore, setGirlScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [items, setItems] = useState<Item[]>([])
  const [basketX, setBasketX] = useState(50)
  const [taunt, setTaunt] = useState<string | null>(null)

  const [isDragging, setIsDragging] = useState(false)

  const fieldRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const lastSpawn = useRef(0)
  const basketXRef = useRef(50)
  const boyScoreRef = useRef(0)
  const girlScoreRef = useRef(0)
  const tickRef = useRef<number | undefined>(undefined)

  const totalCaught = boyScore + girlScore

  // Report score changes to parent
  useEffect(() => {
    onScoreChange?.(girlScore, boyScore)
  }, [girlScore, boyScore, onScoreChange])

  const reset = () => {
    boyScoreRef.current = 0
    girlScoreRef.current = 0
    seq = 0
    setBoyScore(0)
    setGirlScore(0)
    setTimeLeft(DURATION)
    setItems([])
    setBasketX(50)
    basketXRef.current = 50
  }

  const start = () => {
    reset()
    setPhase('playing')
    
    tickRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(tickRef.current)
          setPhase('won')
          return 0
        }
        return t - 1
      })
    }, 1000)
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

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }, [moveTo])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      moveTo(e.clientX)
    }
  }, [isDragging, moveTo])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    let mounted = true
    let prev = performance.now()

    const loop = (now: number) => {
      if (!mounted) return
      const dt = Math.min(48, now - prev)
      prev = now

      if (now - lastSpawn.current > 650) {
        lastSpawn.current = now
        const rand = Math.random()
        let type: 'boy' | 'girl' | 'danger'
        let emoji: string
        
        if (rand < 0.15) {
          type = 'danger'
          emoji = DANGER
        } else if (rand < 0.575) {
          type = 'boy'
          emoji = BOY_ITEMS[Math.floor(Math.random() * BOY_ITEMS.length)]
        } else {
          type = 'girl'
          emoji = GIRL_ITEMS[Math.floor(Math.random() * GIRL_ITEMS.length)]
        }

        setItems((list) => [
          ...list,
          {
            id: seq++,
            x: 8 + Math.random() * 84,
            y: -40,
            speed: 0.1 + Math.random() * 0.08,
            emoji,
            type,
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
            const hit = Math.abs(it.x - basketXRef.current) < 14
            if (hit) {
              if (it.type === 'danger') {
                // Socialtjänsten takes your points!
                const penalty = Math.floor((boyScoreRef.current + girlScoreRef.current) / 2)
                boyScoreRef.current = Math.max(0, boyScoreRef.current - Math.ceil(penalty / 2))
                girlScoreRef.current = Math.max(0, girlScoreRef.current - Math.floor(penalty / 2))
                setBoyScore(boyScoreRef.current)
                setGirlScore(girlScoreRef.current)
                setTaunt('👮 SOCIALTJÄNSTEN! De tog hälften av dina poäng! 💀')
                window.setTimeout(() => setTaunt(null), 1800)
              } else if (it.type === 'boy') {
                boyScoreRef.current += 1
                setBoyScore(boyScoreRef.current)
              } else {
                girlScoreRef.current += 1
                setGirlScore(girlScoreRef.current)
              }
            }
            continue
          }
          kept.push({ ...it, y: ny })
        }
        return kept
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      mounted = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.clearInterval(tickRef.current)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'won') {
      const t = window.setTimeout(onComplete, 1500)
      return () => window.clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === 'idle') {
    return (
      <div className={styles.center}>
        <p className={styles.help}>
          Fånga stereotyperna! 🎯
        </p>
        <p className={styles.hint}>
          <span style={{ color: GENDER_COLORS.boy }}>🔧🚗⚽ = Pojke</span>
          {' · '}
          <span style={{ color: GENDER_COLORS.girl }}>👗💄🎀 = Flicka</span>
        </p>
        <p className={styles.warn}>
          ⚠️ UNDVIK 👮 Socialtjänsten - de tar dina poäng!
        </p>
        <button type="button" className={styles.startBtn} onClick={start}>
          Starta
        </button>
      </div>
    )
  }

  return (
    <div className={styles.stage}>
      <div className={styles.hud}>
        <span style={{ color: GENDER_COLORS.girl }}>👧 {girlScore}</span>
        <span className={timeLeft <= 5 ? styles.urgent : ''}>⏱ {timeLeft}s</span>
        <span style={{ color: GENDER_COLORS.boy }}>{boyScore} 👦</span>
      </div>

      {phase === 'won' && (
        <div className={styles.win}>
          {totalCaught >= GOAL ? '💅 Slay!' : 'Tiden är slut!'}
          <div className={styles.result}>
            {boyScore > girlScore 
              ? `Pojke leder med ${boyScore - girlScore}!` 
              : girlScore > boyScore 
                ? `Flicka leder med ${girlScore - boyScore}!`
                : 'Helt lika!'}
          </div>
        </div>
      )}
      
      {taunt && <div className={styles.taunt}>{taunt}</div>}

      <div
        ref={fieldRef}
        className={styles.field}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {items.map((it) => (
          <span
            key={it.id}
            className={`${styles.item} ${it.type === 'danger' ? styles.danger : ''}`}
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
