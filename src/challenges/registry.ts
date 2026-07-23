import type { Challenge } from './types'
import { BalloonPop } from './balloon/BalloonPop'
import { CatchStereotypes } from './catch/CatchStereotypes'
import { Quiz } from './quiz/Quiz'
import { NameWheel } from './wheel/NameWheel'
import { Heartbeat } from './heartbeat/Heartbeat'

/**
 * The ordered quest for Ida's gender reveal.
 * Each game contributes to the gender meter before the final reveal.
 */
export const challenges: Challenge[] = [
  {
    id: 'balloons',
    title: 'Poppa ballongerna',
    emoji: '🎈',
    intro: 'Poppa rosa och blå ballonger! Vilken färg du poppar mest påverkar metern.',
    Component: BalloonPop,
  },
  {
    id: 'catch',
    title: 'Fånga stereotyperna',
    emoji: '🧺',
    intro: 'Fånga könsstereotypa föremål - men akta dig för Socialtjänsten! 👮',
    Component: CatchStereotypes,
  },
  {
    id: 'quiz',
    title: 'Bebisquizet',
    emoji: '🧠',
    intro: 'Testa dina kunskaper om barn, graviditet och Socialtjänstlagen!',
    Component: Quiz,
  },
  {
    id: 'wheel',
    title: 'Namnhjulet',
    emoji: '🎰',
    intro: 'Snurra hjulet och låt ödet välja bland svenska namn!',
    Component: NameWheel,
  },
  {
    id: 'heartbeat',
    title: 'Hjärtslaget',
    emoji: '❤️',
    intro: 'Lyssna på bebisens hjärtslag - snabbt eller långsamt?',
    Component: Heartbeat,
  },
]
