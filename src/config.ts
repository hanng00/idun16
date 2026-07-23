/**
 * Gender Reveal Configuration
 * Change ACTUAL_GENDER to 'girl' or 'boy' to set the final reveal.
 */
export const ACTUAL_GENDER: 'boy' | 'girl' = 'boy'

/**
 * Rigged meter positions after each game.
 * These create suspense by swinging back and forth before the final reveal.
 * Values are "percent boy" (0 = 100% girl, 100 = 100% boy)
 */
export const RIGGED_POSITIONS = [
  26,  // Game 1: Slight girl lead - "Hmm, looks like a girl..."
  58,  // Game 2: Swings to boy - "Oh wait, maybe a boy!"
  44,  // Game 3: Back toward girl - "No no, definitely girl vibes"
  52,  // Game 4: Dead heat - "It's anyone's game!"
  // Game 5: Final reveal - handled specially with dramatic animation
]

/**
 * The final reveal percentage (how far to the winning side)
 * For ACTUAL_GENDER = 'boy', this means 85% boy
 * For ACTUAL_GENDER = 'girl', this would show 15% boy (85% girl)
 */
export const FINAL_REVEAL_PERCENT = 85

/** Emoji for each gender */
export const GENDER_EMOJI = {
  boy: '👦',
  girl: '👧',
} as const

/** Colors for each gender */
export const GENDER_COLORS = {
  boy: '#60a5fa',   // Blue
  girl: '#f472b6',  // Pink
} as const

/** Swedish text for each gender */
export const GENDER_TEXT = {
  boy: 'POJKE',
  girl: 'FLICKA',
} as const
