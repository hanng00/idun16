import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import { GENDER_COLORS } from '../../config'
import styles from './BalloonPop.module.css'

const DURATION = 15
const TARGET = 20

interface Balloon {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: 'pink' | 'blue' | 'gold'
  size: number
  popped: boolean
}

let balloonSeq = 0

function makeBalloon(): Balloon {
  const rand = Math.random()
  let color: 'pink' | 'blue' | 'gold'
  if (rand < 0.1) {
    color = 'gold' // Special balloon!
  } else if (rand < 0.55) {
    color = 'pink'
  } else {
    color = 'blue'
  }
  
  return {
    id: balloonSeq++,
    x: 10 + Math.random() * 80,
    y: 110, // Start below screen
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(0.6 + Math.random() * 0.5), // Slower float up
    color,
    size: color === 'gold' ? 1.3 : 0.9 + Math.random() * 0.4,
    popped: false,
  }
}

type Phase = 'idle' | 'playing' | 'won'

export function BalloonPop({ onComplete, onScoreChange }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [pinkPopped, setPinkPopped] = useState(0)
  const [bluePopped, setBluePopped] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [combo, setCombo] = useState(0)
  const [lastPopColor, setLastPopColor] = useState<string | null>(null)
  const [popEffects, setPopEffects] = useState<{id: number, x: number, y: number, text: string, color: string}[]>([])
  
  const fieldRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const tickRef = useRef<number>()
  const lastSpawnRef = useRef(0)
  const effectIdRef = useRef(0)
  const pinkRef = useRef(0)
  const blueRef = useRef(0)

  const totalPopped = pinkPopped + bluePopped

  // Report score changes to parent
  useEffect(() => {
    onScoreChange?.(pinkPopped, bluePopped)
  }, [pinkPopped, bluePopped, onScoreChange])

  const addPopEffect = (x: number, y: number, text: string, color: string) => {
    const id = effectIdRef.current++
    setPopEffects(prev => [...prev, { id, x, y, text, color }])
    setTimeout(() => {
      setPopEffects(prev => prev.filter(e => e.id !== id))
    }, 600)
  }

  const start = useCallback(() => {
    balloonSeq = 0
    setPinkPopped(0)
    setBluePopped(0)
    setTimeLeft(DURATION)
    setBalloons([])
    setCombo(0)
    setLastPopColor(null)
    setPhase('playing')
    lastSpawnRef.current = 0
  }, [])

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return
    
    let lastTime = performance.now()
    
    const loop = (now: number) => {
      const dt = Math.min(32, now - lastTime)
      lastTime = now
      
      // Spawn balloons
      if (now - lastSpawnRef.current > 600) {
        lastSpawnRef.current = now
        setBalloons(prev => [...prev, makeBalloon()])
      }
      
      // Update balloon positions
      setBalloons(prev => {
        return prev
          .map(b => ({
            ...b,
            x: b.x + b.vx * dt * 0.03,
            y: b.y + b.vy * dt * 0.03,
            vx: b.vx + (Math.random() - 0.5) * 0.05, // Gentle wobble
          }))
          .filter(b => !b.popped && b.y > -20) // Remove off-screen
      })
      
      rafRef.current = requestAnimationFrame(loop)
    }
    
    rafRef.current = requestAnimationFrame(loop)
    
    // Timer
    tickRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('won')
          return 0
        }
        return t - 1
      })
    }, 1000)
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [phase])

  const popBalloon = useCallback((b: Balloon, e: React.PointerEvent) => {
    if (b.popped || phase !== 'playing') return
    
    // Mark as popped
    setBalloons(prev => prev.filter(balloon => balloon.id !== b.id))
    
    // Calculate combo
    const sameColor = lastPopColor === b.color
    const newCombo = sameColor ? combo + 1 : 1
    setCombo(newCombo)
    setLastPopColor(b.color)
    
    // Points based on combo
    const points = b.color === 'gold' ? 3 : (newCombo >= 3 ? 2 : 1)
    
    // Get position for effect
    const rect = fieldRef.current?.getBoundingClientRect()
    const x = rect ? ((e.clientX - rect.left) / rect.width) * 100 : b.x
    const y = rect ? ((e.clientY - rect.top) / rect.height) * 100 : b.y
    
    if (b.color === 'gold') {
      // Gold balloon gives both!
      setPinkPopped(p => p + 2)
      setBluePopped(p => p + 2)
      addPopEffect(x, y, '🌟 +2 BÅDA!', '#fbbf24')
    } else if (b.color === 'pink') {
      setPinkPopped(p => p + points)
      const text = newCombo >= 3 ? `🔥 x${newCombo} +${points}!` : `+${points}`
      addPopEffect(x, y, text, GENDER_COLORS.girl)
    } else {
      setBluePopped(p => p + points)
      const text = newCombo >= 3 ? `🔥 x${newCombo} +${points}!` : `+${points}`
      addPopEffect(x, y, text, GENDER_COLORS.boy)
    }
  }, [phase, combo, lastPopColor])

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
          Poppa så många ballonger du kan! 🎈
        </p>
        <p className={styles.hint}>
          <span style={{ color: GENDER_COLORS.girl }}>Rosa = Flicka</span>
          {' · '}
          <span style={{ color: GENDER_COLORS.boy }}>Blå = Pojke</span>
        </p>
        <p className={styles.tips}>
          💡 Poppa samma färg i rad för COMBO!<br/>
          🌟 Guldballonger ger poäng till båda!
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
        <span style={{ color: GENDER_COLORS.girl }}>👧 {pinkPopped}</span>
        <span className={timeLeft <= 5 ? styles.urgent : ''}>⏱ {timeLeft}s</span>
        <span style={{ color: GENDER_COLORS.boy }}>{bluePopped} 👦</span>
      </div>
      
      {combo >= 3 && (
        <div className={styles.comboIndicator}>
          🔥 COMBO x{combo}!
        </div>
      )}

      {phase === 'won' && (
        <div className={styles.win}>
          {totalPopped >= TARGET ? '💅 Slay!' : 'Tiden är slut!'}
          <div className={styles.result}>
            {pinkPopped > bluePopped 
              ? `Rosa vann med ${pinkPopped - bluePopped}!` 
              : bluePopped > pinkPopped 
                ? `Blå vann med ${bluePopped - pinkPopped}!`
                : 'Helt lika!'}
          </div>
        </div>
      )}

      <div ref={fieldRef} className={styles.field}>
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Poppa ${b.color} ballong`}
            className={`${styles.balloon} ${b.color === 'gold' ? styles.gold : ''}`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              '--balloon-color': b.color === 'pink' 
                ? GENDER_COLORS.girl 
                : b.color === 'blue' 
                  ? GENDER_COLORS.boy 
                  : '#fbbf24',
              '--balloon-size': b.size,
            } as React.CSSProperties}
            onPointerDown={(e) => popBalloon(b, e)}
          />
        ))}
        
        {popEffects.map(effect => (
          <div
            key={effect.id}
            className={styles.popEffect}
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              color: effect.color,
            }}
          >
            {effect.text}
          </div>
        ))}
      </div>
    </div>
  )
}
