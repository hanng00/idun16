import type { ComponentType } from 'react'

/** Props every challenge component receives. */
export interface ChallengeProps {
  /** Call when the player successfully clears the challenge. */
  onComplete: () => void
  /** Optional: call when the player fails in a way that triggers a punishment. */
  onFail?: () => void
  /** Optional: report live score changes (girlPoints, boyPoints) */
  onScoreChange?: (girlPoints: number, boyPoints: number) => void
}

export interface Challenge {
  id: string
  /** Short title shown in the intro card. */
  title: string
  /** Emoji badge for the challenge. */
  emoji: string
  /** One-line description / instruction. */
  intro: string
  /** The playable component. */
  Component: ComponentType<ChallengeProps>
}
