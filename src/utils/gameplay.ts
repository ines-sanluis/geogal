import map from "../data/adjacencyMap";
import { getTodayString } from "./date";
import findShortestRoute from "./findShortestRoute";

const KEY = "xeo-gal-last-gameplay";

export function saveGuesses(guesses: string[], usedHints?: number) {
  const gameplay = getGameFromStorage();
  if (gameplay) {
    gameplay.guesses = guesses;
    gameplay.usedHints = usedHints;
    saveGame(gameplay);
  }
}

export function saveGame(gameplay: GamePlay) {
  localStorage.setItem(KEY, JSON.stringify(gameplay));
}

export function saveSolution(
  start: string,
  end: string,
  officialSolution: string[],
  userSolution?: string[]
) {
  const gameplay = getGameFromStorage();
  if (gameplay) {
    gameplay.officialSolution = officialSolution;
    gameplay.userSolution = userSolution;
    gameplay.start = start;
    gameplay.end = end;
    gameplay.date = getTodayString();
    saveGame(gameplay);
  } else {
    saveGame({
      start,
      end,
      officialSolution,
      userSolution,
      usedHints: 0,
      isGameOver: false,
      date: getTodayString(),
    });
  }
}

export function saveResult(hasWon: boolean) {
  const gameplay = getGameFromStorage();
  if (gameplay) {
    gameplay.isGameOver = true;
    gameplay.hasWon = hasWon;
    saveGame(gameplay);
  }
}

function getGameFromStorage(): GamePlay | null {
  const gameplay = localStorage.getItem(KEY);
  return gameplay ? JSON.parse(gameplay) : null;
}

function getGame(): GamePlay {
  // Each day we play a game between two random municipalities
  const today = getTodayString();
  // Create a hash from the date string
  const dateHash = Array.from(today).reduce(
    (hash, char) => (hash << 5) - hash + char.charCodeAt(0),
    0
  );
  // Check if user has already played
  const gameplay = getGameFromStorage();
  if (gameplay && gameplay.date === today) {
    return gameplay;
  }
  // Get start and end from map keys
  const keys = Object.keys(map);
  let start = keys[Math.abs(dateHash) % keys.length];
  let end = keys[Math.abs(dateHash * 2) % keys.length];
  let officialSolution = findShortestRoute(start, end);

  // Use default game
  if (!officialSolution || officialSolution.length == 2) {
    start = "Viveiro";
    end = "Samos";
    officialSolution = findShortestRoute(start, end);
  }
  return {
    start,
    end,
    usedHints: 0,
    officialSolution: officialSolution || [],
    isGameOver: false,
  };
}

export default getGame;
