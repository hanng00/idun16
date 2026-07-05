import type { ComponentType } from 'react'

/** Props every challenge component receives. */
export interface ChallengeProps {
  /** Call when the player successfully clears the challenge. */
  onComplete: () => void
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
