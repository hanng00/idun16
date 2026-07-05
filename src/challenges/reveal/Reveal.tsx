import { useEffect, useState } from 'react'
import styles from './Reveal.module.css'

/** Byt ut mot den riktiga presentkortskoden här. */
const GIFT_CARD_CODE = 'TVCBTFRO'
const GIFT_CARD_VALUE = '500,00 kr'

const CONFETTI_COLORS = ['#ff5c8a', '#ffb703', '#8ecae6', '#a3e635', '#c084fc', '#fb7185']

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  rotate: number
}

function makeConfetti(): Piece[] {
  return Array.from({ length: 80 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2.5,
    duration: 3 + Math.random() * 2.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
  }))
}

export function Reveal() {
  const [copied, setCopied] = useState(false)
  const [confetti] = useState<Piece[]>(makeConfetti)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(GIFT_CARD_CODE)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

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
        <img
          className={styles.hero}
          src="lyko-giftcard.png"
          alt="Lyko presentkort"
        />

        <div className={styles.value}>
          <span className={styles.valueLabel}>Värde</span>
          <span className={styles.valueAmount}>{GIFT_CARD_VALUE}</span>
        </div>

        <p className={styles.body}>
          Grattis! 🎉 Använd koden i kassan online eller i butik.
        </p>

        <div className={styles.codeBlock}>
          <span className={styles.codeLabel}>Din personliga kod</span>
          <button type="button" className={styles.code} onClick={copy}>
            {GIFT_CARD_CODE}
          </button>
          <span className={styles.copyHint}>
            {copied ? 'Kopierad! ✅' : 'Tryck för att kopiera'}
          </span>
        </div>

        <p className={styles.happy}>Happy shopping! 💅</p>
      </div>
    </div>
  )
}
