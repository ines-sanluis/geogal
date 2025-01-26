interface Guess {
  name: string;
  correct: boolean;
}

interface GamePlay {
  start: string;
  end: string;
  solution?: string[];
  guesses?: Guess[];
  isGameOver: boolean;
  hasWon?: boolean;
  date?: string;
  usedHints?: number;
}
