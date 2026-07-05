import { useCallback, useState } from 'react'
import './App.css'
import { challenges } from './challenges/registry'
import { Reveal } from './challenges/reveal/Reveal'
import { RunawayButton } from './challenges/troll/RunawayButton'
import { TrollGate } from './challenges/troll/TrollGate'

type Screen = 'welcome' | 'intro' | 'playing' | 'gate' | 'reveal'

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [index, setIndex] = useState(0)
  const [returnTo, setReturnTo] = useState<number | null>(null)
  const [runKey, setRunKey] = useState(0)
  const [punish, setPunish] = useState(false)
  const [skipTaunt, setSkipTaunt] = useState(0)

  const current = challenges[index]
  const total = challenges.length

  const startQuest = useCallback(() => {
    setIndex(0)
    setReturnTo(null)
    setScreen('intro')
  }, [])

  const beginChallenge = useCallback(() => {
    setPunish(false)
    setScreen('playing')
  }, [])

  const completeChallenge = useCallback(() => {
    // If she was punished back to an earlier stage, resume where she failed.
    if (returnTo !== null && index < returnTo) {
      const target = returnTo
      setReturnTo(null)
      setIndex(target)
      setScreen('intro')
      return
    }
    if (index + 1 >= total) {
      setScreen('gate')
    } else {
      setIndex((i) => i + 1)
      setScreen('intro')
    }
  }, [index, total, returnTo])

  const failChallenge = useCallback(() => {
    // Send her all the way back to redo the balloon challenge (index 0).
    setReturnTo(index)
    setIndex(0)
    setRunKey((k) => k + 1)
    setPunish(true)
    setScreen('intro')
  }, [index])

  const skipTaunts = [
    'Haha nej. 💀',
    'Fint försök, väldigt delulu. 🌌',
    'Absolut inte.',
    'Du måste jobba för det. 💅',
  ]

  return (
    <main className="quest">
      {screen === 'welcome' && (
        <section className="welcome">
          <div className="bigEmoji">🎂</div>
          <h1>Grattis på 16-årsdagen!</h1>
          <p className="lead">
            Innan du får ditt presentkort måste du klara {total} utmaningar.
            Inga genvägar, no crumbs. Let her cook 👨‍🍳
          </p>
          <RunawayButton dodges={2} onClick={startQuest}>
            Kör igång 🚀
          </RunawayButton>
          <button
            type="button"
            className="skip"
            onClick={() => setSkipTaunt((n) => (n + 1) % skipTaunts.length)}
          >
            {skipTaunt === 0 ? 'Hoppa över alla utmaningar' : skipTaunts[skipTaunt]}
          </button>
        </section>
      )}

      {screen === 'intro' && (
        <section className="intro">
          <StepDots total={total} index={index} />
          {punish && (
            <p className="punish">
              💀 Fel svar i quizet! -5000 aura. Du måste klara ballongerna igen
              innan du får fortsätta.
            </p>
          )}
          <div className="bigEmoji">{current.emoji}</div>
          <p className="stepCount">
            Utmaning {index + 1} av {total}
          </p>
          <h2>{current.title}</h2>
          <p className="lead">{current.intro}</p>
          <button type="button" className="cta" onClick={beginChallenge}>
            Starta utmaningen
          </button>
        </section>
      )}

      {screen === 'playing' && (
        <section className="playing">
          <StepDots total={total} index={index} />
          <h2 className="playHeading">
            {current.emoji} {current.title}
          </h2>
          <current.Component
            key={`${current.id}-${runKey}`}
            onComplete={completeChallenge}
            onFail={failChallenge}
          />
        </section>
      )}

      {screen === 'gate' && <TrollGate onSurvive={() => setScreen('reveal')} />}

      {screen === 'reveal' && <Reveal />}
    </main>
  )
}

function StepDots({ total, index }: { total: number; index: number }) {
  return (
    <div className="dots" aria-label={`Steg ${index + 1} av ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`dot ${i < index ? 'done' : i === index ? 'active' : ''}`}
        />
      ))}
    </div>
  )
}

export default App
