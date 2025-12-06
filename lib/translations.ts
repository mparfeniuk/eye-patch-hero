export type Language = "uk" | "en";

export interface Translations {
  // Navigation
  home: string;
  settings: string;
  stats: string;
  back: string;

  // Games
  game1Title: string;
  game1Description: string;
  game2Title: string;
  game2Description: string;
  game3Title: string;
  game3Description: string;
  game4Title: string;
  game4Description: string;
  game5Title: string;
  game5Description: string;
  game6Title: string;
  game6Description: string;
  play: string;
  start: string;
  pause: string;
  resume: string;
  finish: string;

  // Game 1
  catchTheDot: string;
  score: string;
  hits: string;
  misses: string;
  timeLeft: string;

  // Game 2
  focusGrid: string;
  findTheDifferent: string;
  found: string;
  level: string;

  // Game 3
  movingContrast: string;
  clickWhenYouSee: string;
  contrast: string;

  // Game 4
  colorMatch: string;

  // Game 5
  sizeChallenge: string;

  // Game 6
  followPath: string;

  // Parent descriptions
  forParents: string;
  game1Benefit: string;
  game2Benefit: string;
  game3Benefit: string;
  game4Benefit: string;
  game5Benefit: string;
  game6Benefit: string;

  // Settings
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  sessionDuration: string;
  minutes: string;
  sound: string;
  on: string;
  off: string;
  language: string;
  ukrainian: string;
  english: string;
  speed: string;
  size: string;
  contrastLevel: string;

  // Stats
  totalSessions: string;
  totalExercises: string;
  averageScore: string;
  lastSession: string;
  noData: string;
  sessionHistory: string;
  date: string;
  duration: string;
  result: string;

  // Common
  loading: string;
  error: string;
}

export const translations: Record<Language, Translations> = {
  uk: {
    home: "Головна",
    settings: "Налаштування",
    stats: "Статистика",
    back: "Назад",
    game1Title: "Ловіть крапку",
    game1Description: "Натисніть на рухому крапку",
    game2Title: "Сітка фокусу",
    game2Description: "Знайдіть відмінний символ",
    game3Title: "Рухомий контраст",
    game3Description: "Натисніть, коли побачите фігуру",
    game4Title: "Знайди колір",
    game4Description: "Знайдіть відповідний колір",
    game5Title: "Розмір об'єктів",
    game5Description: "Знайдіть найбільший об'єкт",
    game6Title: "Слідкуй за шляхом",
    game6Description: "Відстежуйте рухомий шлях",
    play: "Грати",
    start: "Почати",
    pause: "Пауза",
    resume: "Продовжити",
    finish: "Завершити",
    catchTheDot: "Ловіть крапку",
    score: "Рахунок",
    hits: "Попадання",
    misses: "Промахи",
    timeLeft: "Залишилось",
    focusGrid: "Сітка фокусу",
    findTheDifferent: "Знайдіть відмінний",
    found: "Знайдено",
    level: "Рівень",
    movingContrast: "Рухомий контраст",
    clickWhenYouSee: "Натисніть, коли побачите",
    contrast: "Контраст",
    colorMatch: "Знайди колір",
    sizeChallenge: "Розмір об'єктів",
    followPath: "Слідкуй за шляхом",
    forParents: "Для батьків",
    game1Benefit:
      "Ця вправа тренує координацію рук та очей, покращує реакцію та фокусування зору. Відстеження рухомих об'єктів допомагає розвивати периферичний зір та точність сприйняття.",
    game2Benefit:
      "Вправа розвиває увагу та концентрацію, тренує здатність швидко знаходити відмінності. Це покращує обробку візуальної інформації та розвиває спостережливість.",
    game3Benefit:
      "Тренування контрастної чутливості допомагає покращити здатність розрізняти об'єкти з низьким контрастом. Це особливо корисно для розвитку зорової системи та покращення нічного зору.",
    game4Benefit:
      "Розпізнавання кольорів тренує колірне сприйняття та допомагає розвивати здатність розрізняти відтінки. Це покращує загальну зорову обробку та сприйняття деталей.",
    game5Benefit:
      "Вправа розвиває здатність оцінювати розміри та відстані, тренує просторове сприйняття. Це допомагає покращити координацію та точність зору.",
    game6Benefit:
      "Відстеження рухомих шляхів тренує саккадичні рухи очей та покращує плавність переміщення погляду. Це розвиває здатність передбачати рух та покращує загальну координацію зору.",
    difficulty: "Складність",
    easy: "Легко",
    medium: "Середньо",
    hard: "Важко",
    sessionDuration: "Тривалість сесії",
    minutes: "хвилин",
    sound: "Звук",
    on: "Увімкнено",
    off: "Вимкнено",
    language: "Мова",
    ukrainian: "Українська",
    english: "Англійська",
    speed: "Швидкість",
    size: "Розмір",
    contrastLevel: "Рівень контрасту",
    totalSessions: "Всього сесій",
    totalExercises: "Всього вправ",
    averageScore: "Середній рахунок",
    lastSession: "Остання сесія",
    noData: "Немає даних",
    sessionHistory: "Історія сесій",
    date: "Дата",
    duration: "Тривалість",
    result: "Результат",
    loading: "Завантаження...",
    error: "Помилка",
  },
  en: {
    home: "Home",
    settings: "Settings",
    stats: "Statistics",
    back: "Back",
    game1Title: "Catch the Dot",
    game1Description: "Click on the moving dot",
    game2Title: "Focus Grid",
    game2Description: "Find the different symbol",
    game3Title: "Moving Contrast",
    game3Description: "Click when you see the shape",
    game4Title: "Color Match",
    game4Description: "Find the matching color",
    game5Title: "Size Challenge",
    game5Description: "Find the largest object",
    game6Title: "Follow the Path",
    game6Description: "Track the moving path",
    play: "Play",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    finish: "Finish",
    catchTheDot: "Catch the Dot",
    score: "Score",
    hits: "Hits",
    misses: "Misses",
    timeLeft: "Time Left",
    focusGrid: "Focus Grid",
    findTheDifferent: "Find the Different",
    found: "Found",
    level: "Level",
    movingContrast: "Moving Contrast",
    clickWhenYouSee: "Click When You See",
    contrast: "Contrast",
    colorMatch: "Color Match",
    sizeChallenge: "Size Challenge",
    followPath: "Follow the Path",
    forParents: "For Parents",
    game1Benefit:
      "This exercise trains hand-eye coordination, improves reaction time and visual focus. Tracking moving objects helps develop peripheral vision and perception accuracy.",
    game2Benefit:
      "The exercise develops attention and concentration, trains the ability to quickly find differences. This improves visual information processing and develops observation skills.",
    game3Benefit:
      "Training contrast sensitivity helps improve the ability to distinguish low-contrast objects. This is especially useful for developing the visual system and improving night vision.",
    game4Benefit:
      "Color recognition trains color perception and helps develop the ability to distinguish shades. This improves overall visual processing and detail perception.",
    game5Benefit:
      "The exercise develops the ability to assess sizes and distances, trains spatial perception. This helps improve coordination and visual accuracy.",
    game6Benefit:
      "Tracking moving paths trains saccadic eye movements and improves smooth eye movement. This develops the ability to predict movement and improves overall visual coordination.",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    sessionDuration: "Session Duration",
    minutes: "minutes",
    sound: "Sound",
    on: "On",
    off: "Off",
    language: "Language",
    ukrainian: "Ukrainian",
    english: "English",
    speed: "Speed",
    size: "Size",
    contrastLevel: "Contrast Level",
    totalSessions: "Total Sessions",
    totalExercises: "Total Exercises",
    averageScore: "Average Score",
    lastSession: "Last Session",
    noData: "No Data",
    sessionHistory: "Session History",
    date: "Date",
    duration: "Duration",
    result: "Result",
    loading: "Loading...",
    error: "Error",
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang];
}

