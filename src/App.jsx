import { useState, useEffect, useCallback } from "react";
import GuessForm from "./components/GuessForm";
import GaliciaComponent from "./components/GaliciaMap";
import ShareButtons from "./components/ShareButtons";
import useTimeUntilMidnight from "./hooks/useTimeUntilMidnight";
import { getDailyMunicipality } from "./utils/helpers";
import { getTodayString } from "./utils/date";
const STORAGE_KEY = "geoGalGame";

function App() {
  const [target, setTarget] = useState(null);
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [hasWon, setHasWon] = useState(false); // Track if the user has won
  const [guesses, setGuesses] = useState([]); // Track the user's guesses
  const timeLeft = useTimeUntilMidnight();

  const getScore = useCallback(() => {
    if (gameOver && hasWon) {
      return hasWon ? 314 - guesses.length : 0;
    } else {
      return 313 - guesses.length;
    }
  }, [gameOver, guesses.length, hasWon]);

  useEffect(() => {
    const today = getTodayString();
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
      const gameData = JSON.parse(storedData);
      if (gameData.lastPlayed === today) {
        setGuesses(gameData.guesses || []);
        setGameOver(gameData.gameOver || false);
        setHasWon(gameData.gameOver && gameData.score > 0);
      } else {
        // New day, clear previous game
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Set today's municipality
    setTarget(getDailyMunicipality());
  }, []); // Only run on mount

  const updateLocalStorage = useCallback((updates = {}) => {
    // Get game from local storage
    const storedData = localStorage.getItem(STORAGE_KEY);
    const gameData = storedData ? JSON.parse(storedData) : {};
    const newData = {
      lastPlayed: getTodayString(),
      ...gameData,
      ...updates,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const handleGuess = useCallback(
    (guess) => {
      setGuesses((prevGuesses) => {
        const updatedGuesses = [...prevGuesses, guess];
        updateLocalStorage({ guesses: updatedGuesses });
        return updatedGuesses;
      });
      if (guess.toLowerCase() === target?.name.toLowerCase()) {
        setGameOver(true);
        setHasWon(true);
        updateLocalStorage({ gameOver: true, score: getScore() });
      }
    },
    [target?.name, updateLocalStorage, getScore]
  );

  const onGiveUp = () => {
    updateLocalStorage({ gameOver: true, score: 0 });
    setGameOver(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-2">GeoGal</h1>
      <h2 className="text-sm font-bold text-center mb-4">
        Adiviña o concello galego do día
      </h2>
      <div className="space-y-6">
        <GaliciaComponent
          currentLocation={target?.name || ""}
          guesses={guesses}
        />
        <div className="max-w-[400px] m-auto">
          <GuessForm
            onGuess={handleGuess}
            onGiveUp={onGiveUp}
            disabled={gameOver}
            guesses={guesses}
            score={getScore()}
            gameOver={gameOver}
            currentLocation={target?.name || ""}
            hints={target?.hints || []}
          />
          {gameOver && (
            <>
              <div className="text-center mt-4 mb-4 p-2 bg-blue-100 rounded">
                Vémonos mañá! Próximo concello en {timeLeft}
              </div>
              <ShareButtons
                score={getScore()}
                guesses={guesses}
                currentLocation={target}
                hasWon={hasWon}
              />
            </>
          )}
        </div>
      </div>
      <footer
        style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}
      >
        Creado por{" "}
        <a
          href="https://twitter.com/sanluisdev"
          target="_blank"
          rel="noopener noreferrer"
        >
          sanluisdev
        </a>
        <p className="text-xs mt-2 text-center">
          Os datos dos concellos proceden do © Instituto Xeográfico Nacional de
          España.
        </p>
      </footer>
    </div>
  );
}

export default App;
