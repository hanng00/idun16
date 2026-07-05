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
    question: 'Vilken är INTE en av Sveriges grundlagar?',
    options: [
      'Regeringsformen',
      'Tryckfrihetsförordningen',
      'Skollagen',
      'Yttrandefrihetsgrundlagen',
    ],
    correctIndex: 2,
    note: 'Skollagen är en vanlig lag – inte en grundlag. Vi har 4 grundlagar. 🤓',
  },
  {
    question: 'Var sitter EU (alltså var ligger EU:s "huvudstad")?',
    options: ['Bryssel', 'Genève', 'Paris', 'Berlin'],
    correctIndex: 0,
    note: 'Bryssel, Belgien. (Lite krångel i Strasbourg också, men Bryssel gäller.) 🇪🇺',
  },
  {
    question: 'Vad får du INTE göra när du är 16?',
    options: [
      'Köpa nässpray på ICA',
      'Dricka öl i Tyskland',
      'Ta körkort i USA',
    ],
    correctIndex: 0,
    note: 'Nässpray har 18-årsgräns! Öl i Tyskland (16+) och körkort i USA går bra. 👃',
  },
  {
    question: 'Vad väger mest: ett kilo fjädrar eller ett kilo bly?',
    options: ['Blyet', 'Fjädrarna', 'Lika mycket', 'Fjädrarna är luftigare'],
    correctIndex: 2,
    note: 'Ett kilo är ett kilo. Klassisk fälla. Väldigt lite demure av frågan. 🪶',
  },
  {
    question: 'Vad finns på LYKO?',
    options: [
      'Hårprodukter & skönhet',
      'Settings spray',
      'Motivation till att plugga',
    ],
    correctIndex: 0,
    note: 'LYKO = hår & skönhet. Motivationen får du hitta någon annanstans. 💅',
  },
]

