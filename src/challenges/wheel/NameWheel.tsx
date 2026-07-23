import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import { GENDER_COLORS } from '../../config'
import styles from './NameWheel.module.css'

// Common Swedish names - stereotypically gendered
const BOY_NAMES = ['Erik', 'Oscar', 'William', 'Lucas', 'Liam', 'Hugo', 'Elias', 'Oliver', 'Noah', 'Adam']
const GIRL_NAMES = ['Emma', 'Maja', 'Alice', 'Ella', 'Wilma', 'Olivia', 'Ebba', 'Alma', 'Elsa', 'Saga']
const NEUTRAL_NAMES = ['Kim', 'Alex', 'Robin', 'Love', 'Charlie']

interface WheelName {
  name: string
  gender: 'boy' | 'girl' | 'neutral'
  color: string
}

function buildWheel(): WheelName[] {
  const names: WheelName[] = []
  
  // Add 5 boy names
  const boys = [...BOY_NAMES].sort(() => Math.random() - 0.5).slice(0, 5)
  boys.forEach(name => names.push({ name, gender: 'boy', color: GENDER_COLORS.boy }))
  
  // Add 5 girl names
  const girls = [...GIRL_NAMES].sort(() => Math.random() - 0.5).slice(0, 5)
  girls.forEach(name => names.push({ name, gender: 'girl', color: GENDER_COLORS.girl }))
  
  // Add 2 neutral names
  const neutrals = [...NEUTRAL_NAMES].sort(() => Math.random() - 0.5).slice(0, 2)
  neutrals.forEach(name => names.push({ name, gender: 'neutral', color: '#a78bfa' }))
  
  // Shuffle the wheel
  return names.sort(() => Math.random() - 0.5)
}

const SPINS_REQUIRED = 3

type Phase = 'idle' | 'spinning' | 'result' | 'done'

export function NameWheel({ onComplete, onScoreChange }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [wheel] = useState<WheelName[]>(buildWheel)
  const [rotation, setRotation] = useState(0)
  const [spinCount, setSpinCount] = useState(0)
  const [currentResult, setCurrentResult] = useState<WheelName | null>(null)
  const [boyVotes, setBoyVotes] = useState(0)
  const [girlVotes, setGirlVotes] = useState(0)
  const [chaosMessage, setChaosMessage] = useState<string | null>(null)
  
  const wheelRef = useRef<HTMLDivElement>(null)
  const segmentAngle = 360 / wheel.length

  // Report score changes to parent
  useEffect(() => {
    onScoreChange?.(girlVotes, boyVotes)
  }, [girlVotes, boyVotes, onScoreChange])

  const spin = useCallback(() => {
    if (phase === 'spinning') return
    
    setPhase('spinning')
    setChaosMessage(null)
    
    // Random spin: 3-5 full rotations plus random segment
    const fullRotations = 3 + Math.floor(Math.random() * 3)
    const extraAngle = Math.random() * 360
    const totalRotation = rotation + (fullRotations * 360) + extraAngle
    
    setRotation(totalRotation)
    
    // Calculate which segment we land on
    const normalizedAngle = totalRotation % 360
    const segmentIndex = Math.floor((360 - normalizedAngle + segmentAngle / 2) % 360 / segmentAngle)
    const result = wheel[segmentIndex % wheel.length]
    
    // Wait for spin to complete
    setTimeout(() => {
      setCurrentResult(result)
      setSpinCount(s => s + 1)
      
      if (result.gender === 'neutral') {
        // Chaos! Random effect
        const chaos = Math.random()
        if (chaos < 0.33) {
          setChaosMessage(`${result.name}?! Könsneutralt namn! 🌈 Båda får +1!`)
          setBoyVotes(v => v + 1)
          setGirlVotes(v => v + 1)
        } else if (chaos < 0.66) {
          setChaosMessage(`${result.name}! Kaos! 🎲 Alla poäng nollställs!`)
          setBoyVotes(0)
          setGirlVotes(0)
        } else {
          setChaosMessage(`${result.name}! Mystiskt... 🔮 Inget händer!`)
        }
      } else if (result.gender === 'boy') {
        setBoyVotes(v => v + 1)
      } else {
        setGirlVotes(v => v + 1)
      }
      
      setPhase('result')
    }, 4000)
  }, [phase, rotation, wheel, segmentAngle])

  const continueGame = useCallback(() => {
    if (spinCount >= SPINS_REQUIRED) {
      setPhase('done')
    } else {
      setPhase('idle')
      setCurrentResult(null)
      setChaosMessage(null)
    }
  }, [spinCount])

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onComplete, 1500)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    <div className={styles.container}>
      <div className={styles.hud}>
        <span style={{ color: GENDER_COLORS.girl }}>👧 {girlVotes}</span>
        <span className={styles.spinCount}>Snurr {spinCount}/{SPINS_REQUIRED}</span>
        <span style={{ color: GENDER_COLORS.boy }}>{boyVotes} 👦</span>
      </div>

      <div className={styles.wheelContainer}>
        <div className={styles.pointer}>▼</div>
        <div 
          ref={wheelRef}
          className={styles.wheel}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {wheel.map((item, i) => (
            <div
              key={item.name}
              className={styles.segment}
              style={{
                transform: `rotate(${i * segmentAngle}deg)`,
                '--segment-color': item.color,
              } as React.CSSProperties}
            >
              <span 
                className={styles.name}
                style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {phase === 'idle' && (
        <button type="button" className={styles.spinBtn} onClick={spin}>
          🎰 Snurra hjulet!
        </button>
      )}

      {phase === 'spinning' && (
        <p className={styles.spinningText}>Snurrar... 🎡</p>
      )}

      {phase === 'result' && currentResult && (
        <div className={styles.resultBox}>
          {chaosMessage ? (
            <p className={styles.chaos}>{chaosMessage}</p>
          ) : (
            <p className={styles.resultText}>
              <span style={{ color: currentResult.color }}>{currentResult.name}</span>
              {' '}
              {currentResult.gender === 'boy' ? '→ +1 Pojke 👦' : '→ +1 Flicka 👧'}
            </p>
          )}
          <button type="button" className={styles.continueBtn} onClick={continueGame}>
            {spinCount >= SPINS_REQUIRED ? 'Klar!' : 'Snurra igen'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className={styles.doneBox}>
          <p className={styles.doneText}>
            {boyVotes > girlVotes 
              ? `Pojknamn vann med ${boyVotes}-${girlVotes}! 👦`
              : girlVotes > boyVotes
                ? `Flicknamn vann med ${girlVotes}-${boyVotes}! 👧`
                : 'Helt lika! 🤝'}
          </p>
        </div>
      )}
    </div>
  )
}
