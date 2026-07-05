export interface QuizQuestion {
  /** The question text shown to the player. */
  question: string
  /** Answer options. Order here is randomized at runtime. */
  options: string[]
  /** Index into `options` (before shuffling) that is correct. */
  correctIndex: number
  /** Optional fun fact / reaction shown after answering. */
  note?: string
}

/**
 * Redigera fritt! Lägg till, ta bort eller ändra frågor.
 * `correctIndex` pekar på rätt svar i `options` (0 = första alternativet).
 */
export const quizQuestions: QuizQuestion[] = [
  {
    question: 'Hur många invånare har vi ungefär i Sverige?',
    options: ['Ca 5 miljoner', 'Ca 10 miljoner', 'Ca 25 miljoner', 'Ca 50 miljoner'],
    correctIndex: 1,
    note: 'Ungefär 10,5 miljoner! 🇸🇪',
  },
  {
    question: 'Vilken är Sveriges huvudstad?',
    options: ['Göteborg', 'Malmö', 'Stockholm', 'Uppsala'],
    correctIndex: 2,
  },
  {
    question: 'Hur många år fyller du idag?',
    options: ['14', '15', '16', '17'],
    correctIndex: 2,
    note: 'Grattis på 16-årsdagen! 🎂',
  },
  {
    question: 'Hur många ben har en spindel?',
    options: ['6', '8', '10', '12'],
    correctIndex: 1,
  },
  {
    question: 'Vad heter Sveriges längsta flod?',
    options: ['Klarälven', 'Dalälven', 'Göta älv', 'Ume älv'],
    correctIndex: 0,
    note: 'Klarälven är ca 300 km lång.',
  },
  {
    question: 'Vilken planet är närmast solen?',
    options: ['Venus', 'Mars', 'Merkurius', 'Jorden'],
    correctIndex: 2,
  },
  {
    question: 'Läs noga: hur många F finns i meningen "FEM FINA FLICKOR FISKAR"?',
    options: ['3', '4', '5', 'Vänta, jag räknar igen...'],
    correctIndex: 1,
    note: 'FEM-FINA-FLICKOR-FISKAR = 4 F. Lätt att missa! 😏',
  },
  {
    question: 'Vad väger mest: ett kilo fjädrar eller ett kilo bly?',
    options: ['Blyet', 'Fjädrarna', 'Lika mycket', 'Fjädrarna är luftigare'],
    correctIndex: 2,
    note: 'Ett kilo är ett kilo. Fälla! 🪶',
  },
  {
    question: 'Tryck på det RÄTTA svaret. Vilket är det rätta svaret?',
    options: ['Det här', 'Nej, det här', 'Det rätta svaret', 'Inte det här'],
    correctIndex: 2,
    note: 'Ibland är svaret bokstavligen framför dig. 🙃',
  },
]
