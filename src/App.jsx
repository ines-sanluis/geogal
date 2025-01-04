import { useState, useEffect } from "react";
import { municipalities } from "./data/municipalities";
import GuessForm from "./components/GuessForm";
import GaliciaComponent from "./components/GaliciaMap";
import ShareButtons from "./components/ShareButtons";
import useTimeUntilMidnight from "./hooks/useTimeUntilMidnight";
export const MAX_GUESSES = 3;

// Get today's date in YYYY-MM-DD format
const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
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

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [score, setScore] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const timeLeft = useTimeUntilMidnight();

  useEffect(() => {
    // Load saved game state
    const today = getTodayString();
    const storedData = localStorage.getItem("galiciaGame");

    if (storedData) {
      const gameData = JSON.parse(storedData);
      if (gameData.lastPlayed === today) {
        setHasPlayedToday(true);
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
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

    // Calculate score
    const distanceScore = Math.max(200 - Math.floor(distance * 5), 0);
    const guessScore = Math.max(100 - guesses.length * 20, 0);
    const finalScore = Math.max(distanceScore + guessScore, 0);

    setScore((prev) => {
      const newScore = prev > finalScore ? prev : finalScore;
      updateLocalStorage({ score: newScore });
      return newScore;
    });

    return {
      distance: distance.toFixed(2),
      direction: direction,
      score: finalScore,
    };
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

  const updateLocalStorage = (updates = {}) => {
    const gameData = {
      lastPlayed: getTodayString(),
      guesses,
      score,
      gameOver,
      ...updates,
    };
    localStorage.setItem("galiciaGame", JSON.stringify(gameData));
  };

  const handleGuess = (municipalityName) => {
    if (hasPlayedToday) return;

    const guessedMunicipality = municipalities[municipalityName];
    const result = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      guessedMunicipality.lat,
      guessedMunicipality.lng
    );

    const newGuesses = [
      ...guesses,
      {
        name: municipalityName,
        distance: result.distance,
        direction: result.direction,
        lat: guessedMunicipality.lat,
        lng: guessedMunicipality.lng,
        score: result.score,
      },
    ];

    setGuesses(newGuesses);

    const isGameOver =
      newGuesses.length === MAX_GUESSES ||
      municipalityName === currentLocation.name;

    if (isGameOver) {
      setGameOver(true);
      setHasWon(municipalityName === currentLocation.name);
      setHasPlayedToday(true);
    }

    updateLocalStorage({
      guesses: newGuesses,
      gameOver: isGameOver,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">GeoGal</h1>
      {hasPlayedToday && (
        <div className="text-center mb-4 p-2 bg-blue-100 rounded">
          Vémonos mañá! Próximo concello en {timeLeft}
        </div>
      )}
      <div className="space-y-6">
        <GaliciaComponent currentLocation={currentLocation} guesses={guesses} />
        <GuessForm
          municipalities={municipalities}
          onGuess={handleGuess}
          disabled={gameOver || hasPlayedToday}
          guesses={guesses}
          score={score}
          gameOver={gameOver}
          currentLocation={currentLocation}
        />
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
        </a>{" "}
        en X
      </footer>
    </div>
  );
}

export default App;
