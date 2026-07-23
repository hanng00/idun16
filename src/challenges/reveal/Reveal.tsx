import { useState } from 'react'
import { ACTUAL_GENDER, GENDER_COLORS, GENDER_EMOJI, GENDER_TEXT } from '../../config'
import styles from './Reveal.module.css'

const CONFETTI_COLORS = ACTUAL_GENDER === 'boy' 
  ? ['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#bfdbfe']
  : ['#f472b6', '#ec4899', '#db2777', '#f9a8d4', '#fbcfe8']

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  rotate: number
}

function makeConfetti(): Piece[] {
  return Array.from({ length: 100 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2.5,
    duration: 3 + Math.random() * 2.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
  }))
}

export function Reveal() {
  const [confetti] = useState<Piece[]>(makeConfetti)

  const genderColor = GENDER_COLORS[ACTUAL_GENDER]
  const genderEmoji = GENDER_EMOJI[ACTUAL_GENDER]
  const genderText = GENDER_TEXT[ACTUAL_GENDER]

  return (
    <div className={styles.wrap}>
      <div className={styles.confetti} aria-hidden="true">
        {confetti.map((p, i) => (
          <span
            key={i}
            className={styles.piece}
            style={
              {
                left: `${p.left}%`,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--rot': `${p.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.emojiReveal}>
          {genderEmoji}
        </div>

        <h1 
          className={styles.genderText}
          style={{ color: genderColor }}
        >
          DET BLIR EN {genderText}!
        </h1>

        <p className={styles.congrats}>
          🎉 Grattis Ida & familjen! 🎉
        </p>

        <div className={styles.message}>
          <p>
            {ACTUAL_GENDER === 'boy' 
              ? 'En liten kille är på väg! 💙'
              : 'En liten tjej är på väg! 💗'}
          </p>
        </div>

        <div className={styles.footer}>
          <span className={styles.emoji}>👶</span>
          <span className={styles.emoji}>🍼</span>
          <span className={styles.emoji}>{genderEmoji}</span>
          <span className={styles.emoji}>🎀</span>
          <span className={styles.emoji}>⭐</span>
        </div>
      </div>
    </div>
  )
}
