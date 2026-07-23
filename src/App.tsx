import { useCallback, useState } from 'react'
import './App.css'
import { challenges } from './challenges/registry'
import { Reveal } from './challenges/reveal/Reveal'
import { GenderMeter } from './components/GenderMeter/GenderMeter'
import { RIGGED_POSITIONS, ACTUAL_GENDER, FINAL_REVEAL_PERCENT } from './config'

type Screen = 'welcome' | 'intro' | 'playing' | 'result' | 'reveal'

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [index, setIndex] = useState(0)
  const [baseMeterPercent, setBaseMeterPercent] = useState(50) // The "rigged" base from previous games
  const [liveMeterPercent, setLiveMeterPercent] = useState(50) // Real-time during gameplay
  const [showMeter, setShowMeter] = useState(false)

  const current = challenges[index]
  const total = challenges.length
  const isLastGame = index === total - 1

  const startQuest = useCallback(() => {
    setIndex(0)
    setBaseMeterPercent(50)
    setLiveMeterPercent(50)
    setShowMeter(true)
    setScreen('intro')
  }, [])

  const beginChallenge = useCallback(() => {
    setScreen('playing')
  }, [])

  // Called by games to report live score changes
  const handleScoreChange = useCallback((girlPoints: number, boyPoints: number) => {
    const total = girlPoints + boyPoints
    if (total === 0) {
      setLiveMeterPercent(baseMeterPercent)
      return
    }
    // Calculate shift from game: positive = more boy, negative = more girl
    const gameShift = ((boyPoints - girlPoints) / Math.max(total, 1)) * 25 // Max ±25% swing from one game
    const newPercent = Math.max(5, Math.min(95, baseMeterPercent + gameShift))
    setLiveMeterPercent(newPercent)
  }, [baseMeterPercent])

  const completeChallenge = useCallback(() => {
    setScreen('result')
    
    // After a short delay showing the result, move to next game
    setTimeout(() => {
      if (isLastGame) {
        // Final reveal!
        const finalPercent = ACTUAL_GENDER === 'boy' ? FINAL_REVEAL_PERCENT : (100 - FINAL_REVEAL_PERCENT)
        setLiveMeterPercent(finalPercent)
        setTimeout(() => {
          setShowMeter(false)
          setScreen('reveal')
        }, 2000)
      } else {
        // Set the new base to the rigged position for next game
        const riggedPosition = RIGGED_POSITIONS[index]
        setBaseMeterPercent(riggedPosition)
        setLiveMeterPercent(riggedPosition)
        setIndex((i) => i + 1)
        setScreen('intro')
      }
    }, 1500)
  }, [index, isLastGame])

  // Display meter: during play show live, otherwise show base
  const displayMeterPercent = screen === 'playing' ? liveMeterPercent : 
                              screen === 'result' && isLastGame ? liveMeterPercent :
                              baseMeterPercent

  return (
    <div className="appContainer">
      {/* Sticky header breadcrumb */}
      {showMeter && (
        <div className="stickyHeader">
          <div className="breadcrumb">
            <span className="breadcrumbStep">Spel {index + 1}/{total}</span>
            <span className="breadcrumbTitle">{current.emoji} {current.title}</span>
          </div>
        </div>
      )}

      <main className="quest">
        {screen === 'welcome' && (
          <section className="welcome">
            <div className="bigEmoji">👶</div>
            <h1>Idas Könsavslöjande!</h1>
            <p className="lead">
              Spela {total} minispel för att avslöja om det blir en pojke eller flicka!
              Varje spel påverkar könsmätaren... 🎲
            </p>
            <button type="button" className="cta" onClick={startQuest}>
              Kör igång! 🚀
            </button>
          </section>
        )}

        {screen === 'intro' && (
          <section className="intro">
            <div className="bigEmoji">{current.emoji}</div>
            <h2>{current.title}</h2>
            <p className="lead">{current.intro}</p>
            <button type="button" className="cta" onClick={beginChallenge}>
              Starta spelet
            </button>
          </section>
        )}

        {screen === 'playing' && (
          <section className="playing">
            <current.Component
              key={current.id}
              onComplete={completeChallenge}
              onScoreChange={handleScoreChange}
            />
          </section>
        )}

        {screen === 'result' && (
          <section className="meterScreen">
            <h2 className="meterTitle">
              {isLastGame ? '🥁 Och resultatet är...' : '✅ Spel klart!'}
            </h2>
            {!isLastGame && (
              <p className="meterHint">
                {liveMeterPercent > 50 
                  ? `Pojke leder! 👦`
                  : liveMeterPercent < 50 
                    ? `Flicka leder! 👧`
                    : 'Helt jämnt! 🤝'}
              </p>
            )}
          </section>
        )}

        {screen === 'reveal' && <Reveal />}
      </main>

      {/* Sticky HUD meter at bottom */}
      {showMeter && (
        <div className="stickyMeter">
          <GenderMeter 
            targetPercent={displayMeterPercent} 
            showLabel={true}
          />
        </div>
      )}
    </div>
  )
}

export default App
