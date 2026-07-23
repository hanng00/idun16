import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChallengeProps } from '../types'
import { GENDER_COLORS } from '../../config'
import styles from './Heartbeat.module.css'

// Old wives' tale: fast heartbeat = girl, slow = boy
const TARGET_BPM_GIRL = 155 // "Fast" heartbeat
const TARGET_BPM_BOY = 125  // "Slow" heartbeat
const TOLERANCE = 15

type Phase = 'intro' | 'listening' | 'tapping' | 'result'

export function Heartbeat({ onComplete, onScoreChange }: ChallengeProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [targetBPM] = useState(() => Math.random() < 0.5 ? TARGET_BPM_GIRL : TARGET_BPM_BOY)
  const [taps, setTaps] = useState<number[]>([])
  const [calculatedBPM, setCalculatedBPM] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [heartScale, setHeartScale] = useState(1)
  
  const tickRef = useRef<number>()
  const beatRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)

  const isGirlBPM = targetBPM > 140
  const actualGender = isGirlBPM ? 'girl' : 'boy'

  // Report score based on the heartbeat type (this game is deterministic)
  useEffect(() => {
    if (phase === 'result') {
      // The heartbeat determines the gender vote
      if (actualGender === 'girl') {
        onScoreChange?.(1, 0)
      } else {
        onScoreChange?.(0, 1)
      }
    }
  }, [phase, actualGender, onScoreChange])

  // Create heartbeat sound
  const playBeat = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.value = 80
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
    
    // Visual pulse
    setHeartScale(1.2)
    setTimeout(() => setHeartScale(1), 100)
  }, [])

  // Start listening phase with heartbeat
  const startListening = useCallback(() => {
    setPhase('listening')
    setTimeLeft(5)
    
    const beatInterval = 60000 / targetBPM
    beatRef.current = window.setInterval(playBeat, beatInterval)
    
    tickRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Move to tapping phase
          window.clearInterval(tickRef.current)
          window.clearInterval(beatRef.current)
          setPhase('tapping')
          setTimeLeft(10)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [targetBPM, playBeat])

  // Start tapping phase
  useEffect(() => {
    if (phase !== 'tapping') return
    
    const beatInterval = 60000 / targetBPM
    beatRef.current = window.setInterval(playBeat, beatInterval)
    
    tickRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          window.clearInterval(tickRef.current)
          window.clearInterval(beatRef.current)
          // Calculate result
          if (taps.length >= 2) {
            const intervals = []
            for (let i = 1; i < taps.length; i++) {
              intervals.push(taps[i] - taps[i - 1])
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
            const bpm = Math.round(60000 / avgInterval)
            setCalculatedBPM(bpm)
          } else {
            setCalculatedBPM(0)
          }
          setPhase('result')
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(tickRef.current)
      window.clearInterval(beatRef.current)
    }
  }, [phase, targetBPM, playBeat, taps])

  const handleTap = useCallback(() => {
    if (phase !== 'tapping') return
    setTaps(t => [...t, performance.now()])
    setHeartScale(1.3)
    setTimeout(() => setHeartScale(1), 100)
  }, [phase])

  useEffect(() => {
    if (phase === 'result') {
      const t = setTimeout(onComplete, 3000)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  // Cleanup
  useEffect(() => {
    return () => {
      window.clearInterval(tickRef.current)
      window.clearInterval(beatRef.current)
      audioContextRef.current?.close()
    }
  }, [])

  const guessedGender = calculatedBPM && calculatedBPM > 140 ? 'girl' : 'boy'
  const isClose = calculatedBPM ? Math.abs(calculatedBPM - targetBPM) <= TOLERANCE : false

  return (
    <div className={styles.container}>
      {phase === 'intro' && (
        <div className={styles.intro}>
          <p className={styles.myth}>
            🔮 Enligt gammal folktro:
          </p>
          <p className={styles.mythDetail}>
            <span style={{ color: GENDER_COLORS.girl }}>Snabbt hjärtslag (140+) = Flicka</span>
            <br />
            <span style={{ color: GENDER_COLORS.boy }}>Långsamt hjärtslag (&lt;140) = Pojke</span>
          </p>
          <p className={styles.instruction}>
            Lyssna på bebisens hjärtslag och försök matcha takten!
          </p>
          <button type="button" className={styles.startBtn} onClick={startListening}>
            🎧 Lyssna
          </button>
        </div>
      )}

      {phase === 'listening' && (
        <div className={styles.listening}>
          <p className={styles.listenText}>Lyssna på hjärtslaget...</p>
          <div 
            className={styles.heart}
            style={{ transform: `scale(${heartScale})` }}
          >
            ❤️
          </div>
          <p className={styles.timer}>Tappning börjar om {timeLeft}s</p>
        </div>
      )}

      {phase === 'tapping' && (
        <div className={styles.tapping}>
          <p className={styles.tapInstruction}>Tappa i takt med hjärtslaget!</p>
          <button 
            type="button" 
            className={styles.tapButton}
            onClick={handleTap}
            style={{ transform: `scale(${heartScale})` }}
          >
            ❤️
            <span className={styles.tapCount}>{taps.length} tapp</span>
          </button>
          <p className={styles.timer}>⏱ {timeLeft}s kvar</p>
        </div>
      )}

      {phase === 'result' && (
        <div className={styles.result}>
          <div className={styles.bpmDisplay}>
            <span className={styles.bpmLabel}>Din takt:</span>
            <span className={styles.bpmValue}>{calculatedBPM || '?'} BPM</span>
          </div>
          <div className={styles.bpmDisplay}>
            <span className={styles.bpmLabel}>Bebisens takt:</span>
            <span className={styles.bpmValue}>{targetBPM} BPM</span>
          </div>
          
          {isClose ? (
            <p className={styles.verdict} style={{ color: '#22c55e' }}>
              🎯 Bra gehör! Du var nära!
            </p>
          ) : (
            <p className={styles.verdict} style={{ color: '#fbbf24' }}>
              😅 Lite off, men det är okej!
            </p>
          )}
          
          <p className={styles.genderGuess}>
            Enligt folktron pekar detta mot{' '}
            <span style={{ color: GENDER_COLORS[actualGender] }}>
              {actualGender === 'boy' ? 'POJKE 👦' : 'FLICKA 👧'}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
