import { useEffect, useMemo, useState } from 'react'
import { RunawayButton } from './RunawayButton'
import styles from './TrollGate.module.css'

interface TrollGateProps {
  /** Called when she finally survives all the trolling. */
  onSurvive: () => void
}

type Step =
  | 'sure'
  | 'loading'
  | 'error'
  | 'swap'
  | 'almost'
  | 'realization'

/**
 * A "Dumb Ways to Die"-style gauntlet of fake-outs she must see
 * through before the real reveal. Each step is a little realization:
 * don't trust the obvious button, read carefully, be patient.
 */
export function TrollGate({ onSurvive }: TrollGateProps) {
  const [step, setStep] = useState<Step>('sure')
  const [progress, setProgress] = useState(0)

  // Fake loading bar that "fails" on purpose.
  useEffect(() => {
    if (step !== 'loading') return
    setProgress(0)
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 99) {
          window.clearInterval(id)
          window.setTimeout(() => setStep('error'), 500)
          return 99
        }
        return p + Math.max(1, Math.round((100 - p) / 8))
      })
    }, 160)
    return () => window.clearInterval(id)
  }, [step])

  // Randomize which side the real "Ja"/"Nej" buttons sit on each render.
  const swapSides = useMemo(() => Math.random() > 0.5, [step])

  if (step === 'sure') {
    return (
      <div className={styles.wrap}>
        <div className={styles.big}>🤨</div>
        <h2>Är du säker på att du förtjänar presentkortet?</h2>
        <p className={styles.hint}>Välj klokt...</p>
        <div className={styles.row}>
          <RunawayButton dodges={4} onClick={() => setStep('loading')}>
            Ja, absolut
          </RunawayButton>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => setStep('realization')}
          >
            Nej
          </button>
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div className={styles.wrap}>
        <div className={styles.big}>⏳</div>
        <h2>Laddar ditt presentkort...</h2>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.hint}>{progress}%</p>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className={styles.wrap}>
        <div className={styles.big}>💀</div>
        <h2 className={styles.error}>FEL 16: Presentkortet kunde inte laddas</h2>
        <p className={styles.hint}>
          Skojar bara. Tryck på knappen som INTE är märkt "Ladda om".
        </p>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.decoy}
            onClick={() => setStep('loading')}
          >
            🔄 Ladda om
          </button>
          <button
            type="button"
            className={styles.cta}
            onClick={() => setStep('swap')}
          >
            Fortsätt ändå
          </button>
        </div>
      </div>
    )
  }

  if (step === 'swap') {
    const yes = (
      <button
        key="yes"
        type="button"
        className={styles.cta}
        onClick={() => setStep('almost')}
      >
        Ge mig presentkortet 🎁
      </button>
    )
    const no = (
      <button
        key="no"
        type="button"
        className={styles.decoy}
        onClick={() => setStep('sure')}
      >
        Börja om från början 😈
      </button>
    )
    return (
      <div className={styles.wrap}>
        <div className={styles.big}>👀</div>
        <h2>Sista chansen. Läs noga.</h2>
        <p className={styles.hint}>Knapparna kanske inte gör det de säger...</p>
        <div className={styles.row}>{swapSides ? [no, yes] : [yes, no]}</div>
      </div>
    )
  }

  if (step === 'almost') {
    return (
      <div className={styles.wrap}>
        <div className={styles.big}>🎉</div>
        <h2 className={styles.win}>DU VANN!!!</h2>
        <p className={styles.hint}>...eller?</p>
        <div className={styles.row}>
          <button
            type="button"
            className={styles.decoy}
            onClick={() => setStep('sure')}
          >
            Hämta belöning
          </button>
          <button
            type="button"
            className={styles.tiny}
            onClick={() => setStep('realization')}
          >
            nej det gjorde jag inte
          </button>
        </div>
      </div>
    )
  }

  // realization: the ONLY genuinely honest screen — reward the humility.
  return (
    <div className={styles.wrap}>
      <div className={styles.big}>🥹</div>
      <h2>Okej okej, du klarade det på riktigt.</h2>
      <p className={styles.hint}>
        Läxan: lita aldrig på en knapp som är för ivrig. Nu kör vi.
      </p>
      <button type="button" className={styles.cta} onClick={onSurvive}>
        Visa presentkortet (på riktigt) 🎂
      </button>
    </div>
  )
}
