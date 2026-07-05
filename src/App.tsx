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
  const [skipTaunt, setSkipTaunt] = useState(0)

  const current = challenges[index]
  const total = challenges.length

  const startQuest = useCallback(() => {
    setIndex(0)
    setScreen('intro')
  }, [])

  const beginChallenge = useCallback(() => setScreen('playing'), [])

  const completeChallenge = useCallback(() => {
    if (index + 1 >= total) {
      setScreen('gate')
    } else {
      setIndex((i) => i + 1)
      setScreen('intro')
    }
  }, [index, total])

  const skipTaunts = [
    'Haha nej. 😌',
    'Fint försök.',
    'Absolut inte.',
    'Du måste jobba för det. 💪',
  ]

  return (
    <main className="quest">
      {screen === 'welcome' && (
        <section className="welcome">
          <div className="bigEmoji">🎂</div>
          <h1>Grattis på 16-årsdagen!</h1>
          <p className="lead">
            Innan du får ditt presentkort måste du klara {total} små utmaningar.
            Inga genvägar. Redo?
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
          <current.Component onComplete={completeChallenge} />
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
