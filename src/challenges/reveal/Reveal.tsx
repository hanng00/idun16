import { useEffect, useMemo, useState } from 'react'
import styles from './Reveal.module.css'

/** Byt ut mot det riktiga presentkortskoden här. */
const GIFT_CARD_CODE = 'GRATTIS-16-XXXX-XXXX'
const RECIPIENT = 'grattis på födelsedagen!'

const CONFETTI_COLORS = ['#ff5c8a', '#ffb703', '#8ecae6', '#a3e635', '#c084fc', '#fb7185']

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  rotate: number
}

export function Reveal() {
  const [copied, setCopied] = useState(false)

  const confetti = useMemo<Piece[]>(
    () =>
      Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 3 + Math.random() * 2.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotate: Math.random() * 360,
      })),
    [],
  )

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
        <div className={styles.emoji}>🎉🎂🎁</div>
        <h2 className={styles.title}>Du klarade alla utmaningar!</h2>
        <p className={styles.sub}>{RECIPIENT}</p>

        <div className={styles.codeLabel}>Ditt presentkort</div>
        <button type="button" className={styles.code} onClick={copy}>
          {GIFT_CARD_CODE}
        </button>
        <p className={styles.copyHint}>{copied ? 'Kopierat! ✅' : 'Tryck för att kopiera'}</p>
      </div>
    </div>
  )
}
