import { useEffect, useMemo, useState } from 'react'
import type { ChallengeProps } from '../types'
import { quizQuestions } from './questions'
import { GENDER_COLORS } from '../../config'
import styles from './Quiz.module.css'

interface PreparedQuestion {
  question: string
  options: string[]
  correct: number
  genderVote: 'boy' | 'girl' | 'neutral'
  note?: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function prepare(): PreparedQuestion[] {
  // Pick 5 random questions
  const selected = shuffle(quizQuestions).slice(0, 5)
  return selected.map((q) => {
    const correctValue = q.options[q.correctIndex]
    const options = shuffle(q.options)
    return {
      question: q.question,
      options,
      correct: options.indexOf(correctValue),
      genderVote: q.genderVote,
      note: q.note,
    }
  })
}

export function Quiz({ onComplete, onScoreChange }: ChallengeProps) {
  const questions = useMemo(prepare, [])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [boyVotes, setBoyVotes] = useState(0)
  const [girlVotes, setGirlVotes] = useState(0)

  const q = questions[index]
  const isLast = index === questions.length - 1
  const answered = picked !== null
  const isRight = picked === q.correct

  // Report score changes to parent
  useEffect(() => {
    onScoreChange?.(girlVotes, boyVotes)
  }, [girlVotes, boyVotes, onScoreChange])

  function choose(i: number) {
    if (answered) return
    setPicked(i)
    
    // Count the vote if answered correctly
    if (i === q.correct) {
      if (q.genderVote === 'boy') {
        setBoyVotes((v) => v + 1)
      } else if (q.genderVote === 'girl') {
        setGirlVotes((v) => v + 1)
      }
    }
  }

  function next() {
    if (isLast) {
      onComplete()
      return
    }
    setIndex((n) => n + 1)
    setPicked(null)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.progress}>
        Fråga {index + 1} / {questions.length}
        <span className={styles.votes}>
          <span style={{ color: GENDER_COLORS.girl }}>👧 {girlVotes}</span>
          {' · '}
          <span style={{ color: GENDER_COLORS.boy }}>{boyVotes} 👦</span>
        </span>
      </div>

      <h3 className={styles.question}>{q.question}</h3>

      <div className={styles.options}>
        {q.options.map((opt, i) => {
          const state = !answered
            ? ''
            : i === q.correct
              ? styles.correct
              : i === picked
                ? styles.wrong
                : styles.dim
          return (
            <button
              key={opt}
              type="button"
              className={`${styles.option} ${state}`}
              onClick={() => choose(i)}
              disabled={answered}
            >
              {opt}
              {answered && i === q.correct && (
                <span className={styles.mark}> ✓</span>
              )}
              {answered && !isRight && i === picked && (
                <span className={styles.mark}> ✕</span>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={styles.feedback}>
          {isRight ? (
            <>
              <p className={styles.reaction}>
                Rätt! 🎉
                {q.genderVote !== 'neutral' && (
                  <span 
                    className={styles.voteInfo}
                    style={{ color: GENDER_COLORS[q.genderVote] }}
                  >
                    +1 {q.genderVote === 'boy' ? '👦' : '👧'}
                  </span>
                )}
              </p>
              {q.note && <p className={styles.note}>{q.note}</p>}
            </>
          ) : (
            <p className={`${styles.reaction} ${styles.wrongReaction}`}>
              Fel! 😅 Rätt svar: {q.options[q.correct]}
            </p>
          )}
          <button type="button" className={styles.nextBtn} onClick={next}>
            {isLast ? 'Klar!' : 'Nästa'}
          </button>
        </div>
      )}
    </div>
  )
}
