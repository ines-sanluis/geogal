interface Guess {
  name: string;
  correct: boolean;
}

interface GamePlay {
  start: string;
  end: string;
  officialSolution?: string[];
  userSolution?: string[];
  guesses?: string[];
  isGameOver: boolean;
  hasWon?: boolean;
  date?: string;
  usedHints?: number;
}
