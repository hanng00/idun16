import { useMemo, useState } from 'react'
import type { ChallengeProps } from '../types'
import { quizQuestions } from './questions'
import styles from './Quiz.module.css'

interface PreparedQuestion {
  question: string
  options: string[]
  correct: number
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
  return quizQuestions.map((q) => {
    const correctValue = q.options[q.correctIndex]
    const options = shuffle(q.options)
    return {
      question: q.question,
      options,
      correct: options.indexOf(correctValue),
      note: q.note,
    }
  })
}

export function Quiz({ onComplete, onFail }: ChallengeProps) {
  const questions = useMemo(prepare, [])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)

  const q = questions[index]
  const isLast = index === questions.length - 1
  const answered = picked !== null
  const isRight = picked === q.correct

  function choose(i: number) {
    if (answered) return
    setPicked(i)
  }

  function next() {
    if (isLast) {
      onComplete()
      return
    }
    setIndex((n) => n + 1)
    setPicked(null)
  }

  const failTaunts = [
    'Fel svar. -5000 aura. 📉 Tillbaka till ballongerna med dig.',
    'Det där var inte särskilt demure. 🤡 Kör ballongerna igen.',
    'Crashout detected. 💀 Du får börja om med ballongerna.',
  ]
  const failMsg = useMemo(
    () => failTaunts[Math.floor(Math.random() * failTaunts.length)],
    [picked],
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.progress}>
        Fråga {index + 1} / {questions.length} · no crumbs 💅
      </div>

      <h3 className={styles.question}>{q.question}</h3>

      <div className={styles.options}>
        {q.options.map((opt, i) => {
          const state = !answered
            ? ''
            : isRight
              ? i === q.correct
                ? styles.correct
                : styles.dim
              : i === picked
                ? styles.wrong
                : ''
          return (
            <button
              key={opt}
              type="button"
              className={`${styles.option} ${state}`}
              onClick={() => choose(i)}
              disabled={answered}
            >
              {opt}
              {answered && isRight && i === q.correct && (
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
              <p className={styles.reaction}>Rätt! 🎉</p>
              {q.note && <p className={styles.note}>{q.note}</p>}
              <button type="button" className={styles.nextBtn} onClick={next}>
                {isLast ? 'Klar!' : 'Nästa'}
              </button>
            </>
          ) : (
            <>
              <p className={`${styles.reaction} ${styles.fake}`}>{failMsg}</p>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => (onFail ? onFail() : setPicked(null))}
              >
                Tillbaka till ballongerna 🎈
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
