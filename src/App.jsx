import { useState, useEffect, useCallback } from "react";
import { municipalities } from "./data/municipalities";
import GuessForm from "./components/GuessForm";
import GaliciaComponent from "./components/GaliciaMap";
import ShareButtons from "./components/ShareButtons";
import useTimeUntilMidnight from "./hooks/useTimeUntilMidnight";
export const MAX_GUESSES = 3;

// Get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const options = {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const date = new Intl.DateTimeFormat("en-GB", options).format(new Date());
  return date.split("/").reverse().join("-"); // Format as YYYY-MM-DD
};

const getDirectionArrow = (bearing) => {
  if (bearing > 0 && bearing < 45) return "🔽";
  if (bearing >= 45 && bearing < 135) return "⬅️";
  if (bearing >= 135 && bearing < 225) return "🔼";
  if (bearing >= 225 && bearing < 315) return "➡️";
  if (bearing >= 315 && bearing < 360) return "🔽➡️";
  if (bearing === 0) return "✅";
  return "🥵";
};

const calculateScore = (lat1, lng1, lat2, lng2, numberGuesses) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = (R * c) / 1000;

  // Calculate bearing
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  const direction = getDirectionArrow(bearing);
  const finalScore = getScore(Number(distance), numberGuesses);

  return {
    distance: distance.toFixed(2),
    direction: direction,
    score: finalScore,
  };
};

// Get daily municipality using date as seed
const getDailyMunicipality = () => {
  const municipalityNames = Object.keys(municipalities);
  const dateString = getTodayString();
  // Create a hash from the date string
  const dateHash = Array.from(dateString).reduce(
    (hash, char) => (hash << 5) - hash + char.charCodeAt(0),
    0
  );
  const index = Math.abs(dateHash) % municipalityNames.length;
  const name = municipalityNames[index];
  return {
    ...municipalities[name],
    name: name,
  };
};

function getScore(numericDistance, numberGuesses) {
  let distanceScore = 0;
  if (numericDistance === 0) {
    distanceScore = 100; // Exact match
  } else if (numericDistance <= 100) {
    distanceScore = Math.max(0, 90 - Math.floor(numericDistance)); // Scale down to max 90 points
  } else {
    distanceScore = 0; // Beyond 100 km, no score
  }

  // Adjust score based on the guess number
  let guessScore = 0;
  if (numericDistance === 0) {
    if (numberGuesses === 0) {
      guessScore = 20; // Correct answer, 0 km distance
    } else if (numberGuesses === 1) {
      guessScore = 10; // Second guess
    } else if (numberGuesses === 2) {
      guessScore = 5; // Third guess
    }
  }

  // Final score: Add the guess score and distance score, ensuring no negative scores
  const finalScore = Math.max(distanceScore + guessScore, 0);
  return finalScore;
}

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [score, setScore] = useState(0);
  const timeLeft = useTimeUntilMidnight();

  useEffect(() => {
    // Load saved game state
    const today = getTodayString();
    const storedData = localStorage.getItem("galiciaGame");

    if (storedData) {
      const gameData = JSON.parse(storedData);
      if (gameData.lastPlayed === today) {
        setGuesses(gameData.guesses || []);
        setScore(gameData.score || 0);
        setGameOver(gameData.gameOver || false);
      } else {
        // New day, clear previous game
        localStorage.removeItem("galiciaGame");
      }
    }

    // Set today's municipality
    setCurrentLocation(getDailyMunicipality());
  }, []); // Only run on mount

  const updateLocalStorage = useCallback((updates = {}) => {
    // Get game from local storage
    const storedData = localStorage.getItem("galiciaGame");
    const gameData = storedData ? JSON.parse(storedData) : {};
    const newData = {
      lastPlayed: getTodayString(),
      ...gameData,
      ...updates,
    };
    localStorage.setItem("galiciaGame", JSON.stringify(newData));
  }, []);

  const handleGuess = useCallback(
    (municipalityName) => {
      const guessedMunicipality = municipalities[municipalityName];
      const result = calculateScore(
        currentLocation.lat,
        currentLocation.lng,
        guessedMunicipality.lat,
        guessedMunicipality.lng,
        guesses.length
      );

      setScore((prev) => {
        // Ensure both prev and result.score are valid numbers
        const validPrev = typeof prev === "number" && !isNaN(prev) ? prev : 0;
        const validResultScore =
          typeof result.score === "number" && !isNaN(result.score)
            ? result.score
            : 0;

        // Use the higher of the two values for the new score
        const newScore =
          validPrev >= validResultScore ? validPrev : validResultScore;

        updateLocalStorage({ score: newScore });

        return newScore;
      });

      const newGuess = {
        name: municipalityName,
        distance: result.distance,
        direction: result.direction,
        lat: guessedMunicipality.lat,
        lng: guessedMunicipality.lng,
        score: result.score,
      };

      const isGameOver =
        guesses.length === MAX_GUESSES ||
        newGuess.name === currentLocation.name;

      setGuesses((prevGuesses) => {
        const updatedGuesses = [...prevGuesses, newGuess];

        updateLocalStorage({
          guesses: updatedGuesses,
          gameOver: isGameOver,
        });

        return updatedGuesses;
      });

      if (isGameOver) {
        setGameOver(true);
        setHasWon(municipalityName === currentLocation.name);
      }
    },
    [currentLocation, guesses, updateLocalStorage]
  );

  return (
    <div className="flex flex-col items-center justify-center w-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-2">GeoGal</h1>
      <h2 className="text-sm font-bold text-center mb-4">
        Adiviña o concello galego do día
      </h2>
      <div className="space-y-6">
        <GaliciaComponent currentLocation={currentLocation} guesses={guesses} />
        <GuessForm
          municipalities={municipalities}
          onGuess={handleGuess}
          disabled={gameOver}
          guesses={guesses}
          score={score}
          gameOver={gameOver}
          currentLocation={currentLocation}
        />
        {gameOver && (
          <div className="text-center mb-4 p-2 bg-blue-100 rounded">
            Vémonos mañá! Próximo concello en {timeLeft}
          </div>
        )}
        {gameOver && (
          <ShareButtons
            score={score}
            guesses={guesses}
            currentLocation={currentLocation}
            hasWon={hasWon}
          />
        )}
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
      </footer>
    </div>
  );
}

export default App;
