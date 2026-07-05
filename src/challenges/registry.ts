import type { Challenge } from './types'
import { BalloonPop } from './balloon/BalloonPop'
import { Quiz } from './quiz/Quiz'
import { CatchGifts } from './catch/CatchGifts'

/**
 * The ordered quest. Reorder / remove freely — the shell adapts.
 * The final reveal is handled separately in App.
 */
export const challenges: Challenge[] = [
  {
    id: 'balloons',
    title: 'Poppa ballongerna',
    emoji: '🎈',
    intro: 'Poppa 16 ballonger på 16 sekunder. Snabba fingrar!',
    Component: BalloonPop,
  },
  {
    id: 'quiz',
    title: 'Födelsedagsquizet',
    emoji: '🧠',
    intro: 'Svara på frågorna. Klara alla för att gå vidare.',
    Component: Quiz,
  },
  {
    id: 'catch',
    title: 'Fånga presenterna',
    emoji: '🎁',
    intro: 'Dra korgen och fånga presenterna. Akta bomberna!',
    Component: CatchGifts,
  },
]
