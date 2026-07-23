export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  /** Which gender this question "votes" for if answered correctly */
  genderVote: 'boy' | 'girl' | 'neutral'
  note?: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'Hur lång är föräldraledigheten i Sverige totalt?',
    options: ['360 dagar', '480 dagar', '240 dagar', '520 dagar'],
    correctIndex: 1,
    genderVote: 'neutral',
    note: '480 dagar totalt, varav 90 dagar är reserverade för varje förälder.',
  },
  {
    question: 'Vad heter lagen som reglerar socialtjänstens arbete?',
    options: ['Socialtjänstlagen (SoL)', 'Sociallagen', 'Omsorgslagen', 'Välfärdslagen'],
    correctIndex: 0,
    genderVote: 'girl',
    note: 'Socialtjänstlagen (2001:453) - Ida och Siri kan detta! 💅',
  },
  {
    question: 'Hur många dagar får den andra föräldern vara hemma vid förlossningen?',
    options: ['5 dagar', '10 dagar', '14 dagar', '7 dagar'],
    correctIndex: 1,
    genderVote: 'boy',
    note: '10 dagar med tillfällig föräldrapenning i samband med barns födelse.',
  },
  {
    question: 'Enligt Socialtjänstlagen, vad ska alltid vara avgörande i beslut som rör barn?',
    options: ['Föräldrarnas önskemål', 'Barnets bästa', 'Kommunens budget', 'Socialnämndens policy'],
    correctIndex: 1,
    genderVote: 'neutral',
    note: '1 kap. 2 § SoL: "Barnets bästa ska vara avgörande." Ida vet! 🌟',
  },
  {
    question: 'Hur gammal måste man vara för att få köpa energidryck i Sverige?',
    options: ['15 år', '16 år', 'Ingen åldersgräns i lag', '18 år'],
    correctIndex: 2,
    genderVote: 'boy',
    note: 'Det finns ingen lagstadgad åldersgräns, men många butiker har egna regler.',
  },
  {
    question: 'Vad kallas det när socialtjänsten gör en utredning om ett barns situation?',
    options: ['Barnutredning', 'Barnsamtal', '11 kap. 1 § utredning', 'Orosanmälan'],
    correctIndex: 2,
    genderVote: 'girl',
    note: 'En utredning enligt 11 kap. 1 § SoL. Orosanmälan är det som startar utredningen!',
  },
  {
    question: 'Hur mycket föräldrapenning får man per dag på sjukpenningnivå (2024)?',
    options: ['Ca 800 kr', 'Ca 1000 kr', 'Ca 1200 kr', 'Ca 600 kr'],
    correctIndex: 1,
    genderVote: 'neutral',
    note: 'Max ca 1006 kr/dag på sjukpenningnivå (80% av SGI upp till taket).',
  },
  {
    question: 'Vem är skyldig att göra en orosanmälan om barn far illa?',
    options: ['Bara socialarbetare', 'Alla vuxna', 'Yrkesverksamma inom vård, skola, socialtjänst m.fl.', 'Bara polisen'],
    correctIndex: 2,
    genderVote: 'girl',
    note: '14 kap. 1 § SoL - anmälningsskyldighet för yrkesverksamma. Ida anmäler! 📝',
  },
  {
    question: 'Vad är den vanligaste födelsemånaden i Sverige?',
    options: ['Mars', 'Juli', 'September', 'December'],
    correctIndex: 1,
    genderVote: 'boy',
    note: 'Juli är populärast - 9 månader efter nyår... 🎉',
  },
  {
    question: 'Hur länge har man rätt att vara föräldraledig (oavsett ersättning)?',
    options: ['Tills barnet är 1,5 år', 'Tills barnet är 8 år', 'Tills barnet är 12 år', 'Tills barnet är 3 år'],
    correctIndex: 2,
    genderVote: 'neutral',
    note: 'Man har rätt till ledighet tills barnet fyller 12 år, men ersättningen tar slut tidigare.',
  },
]
