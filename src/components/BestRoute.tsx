import React, { useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
import { municipalitiesData as geojsonData } from "../data/municipalities-wgs84";
import { getSuggestions } from "../utils/findShortestRoute";
import Map from "./Map";
import Hints from "./Hints";
import GuessInput from "./GuessInput";
import Heading from "./Heading";
import Results from "./Results";
import validatePath from "../utils/validatePath";
import Guesses from "./Guesses";
import getGame, {
  saveSolution,
  saveGuesses,
  saveResult,
} from "../utils/gameplay";
import getHints from "../utils/hints";
import { areDifferentSolutions } from "../utils/compareString";

const BestRoute = () => {
  const gameplay = getGame();
  const startPoint = gameplay.start;
  const endPoint = gameplay.end;
  const officialSolution = gameplay.officialSolution;
  const [userSolution, setUserSolution] = React.useState<string[] | undefined>(
    undefined
  );
  const [usedHints, setUsedHints] = React.useState(gameplay.usedHints || 0);
  const [isGameOver, setIsGameOver] = React.useState(
    gameplay.isGameOver || false
  );
  const [alreadyGuessed, setAlreadyGuessed] = React.useState<string[]>(
    gameplay.guesses || []
  );
  const [hasWon, setHasWon] = React.useState(gameplay.hasWon || false);
  const maxGuesses =
    officialSolution && officialSolution[0]
      ? officialSolution[0].length + 5
      : 0;
  const suggestions = React.useMemo(
    () => getSuggestions(startPoint, endPoint),
    [startPoint, endPoint]
  );

  if (!officialSolution) {
    return <div>Parece que hoxe hai un problema...</div>;
  }

  useEffect(() => {
    saveSolution(startPoint, endPoint, officialSolution, userSolution);
  }, [officialSolution, userSolution, startPoint, endPoint]);

  const onHintClick = useCallback(() => {
    setUsedHints((hints) => {
      saveGuesses(alreadyGuessed, hints + 1);
      return hints + 1;
    });
  }, [alreadyGuessed]);

  function launchConfetti() {
    // Left edge
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 90,
      origin: { x: 0 },
      colors: ["#22d3ee", "#38bdf8", "#2dd4bf", "#60a5fa"],
    });
    // Right edge
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 90,
      origin: { x: 1 },
      colors: ["#22d3ee", "#38bdf8", "#2dd4bf", "#60a5fa"],
    });
  }

  useEffect(() => {
    const result = validatePath(startPoint, endPoint, [
      startPoint,
      ...alreadyGuessed,
      endPoint,
    ]);
    if (result.valid && result.path) {
      if (areDifferentSolutions(result.path, officialSolution)) {
        setUserSolution(result.path);
      }
      launchConfetti();
      setHasWon(true);
    }
    if (alreadyGuessed.length >= maxGuesses || result.valid) {
      setIsGameOver(true);
      saveResult(result.valid);
    }
  }, [alreadyGuessed, maxGuesses]);

  const onGuess = useCallback((municipality: string) => {
    const s = suggestions.map((s) => s.toLowerCase());
    if (s.includes(municipality.toLowerCase())) {
      setAlreadyGuessed((guessed: string[]) => {
        const newGuesses = [...guessed, municipality];
        saveGuesses(newGuesses);
        return newGuesses;
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full md:max-w-[45vh] p-2">
      <h3 className="flex flex-wrap text-2xl font-semibold ">
        <span>Como podo ir de </span>
        <span className="ml-2 mr-2 font-bold px-2 py-0.5 rounded-lg bg-teal-500 text-blue-50">
          {startPoint}
        </span>
        <span className="mr-1">a</span>
        <span className="mr-1 font-bold px-2 py-0.5 rounded-lg bg-blue-500 text-blue-50">
          {endPoint}
        </span>
        <span>?</span>
      </h3>
      {officialSolution && (
        <Map
          data={geojsonData}
          startPoint={startPoint}
          endPoint={endPoint}
          alreadyGuessed={alreadyGuessed}
          isGameOver={isGameOver}
          solution={userSolution || officialSolution}
        />
      )}
      <Heading
        title="Adiviña a ruta máis curta"
        extraText={`${alreadyGuessed.length} / ${maxGuesses}
        intentos`}
      />
      <GuessInput
        start={startPoint}
        end={endPoint}
        onGuess={onGuess}
        alreadyGuessed={alreadyGuessed}
        isGameOver={isGameOver}
        suggestions={suggestions}
      />
      <Guesses
        alreadyGuessed={alreadyGuessed}
        solution={userSolution || officialSolution}
      />
      {isGameOver ? (
        <Results
          usedHints={usedHints}
          hasWon={hasWon}
          solution={userSolution || officialSolution}
          officialSolution={officialSolution}
          wasOfficialSolution={
            !areDifferentSolutions(userSolution, officialSolution)
          }
          guesses={alreadyGuessed}
        />
      ) : (
        <Hints
          hints={getHints(startPoint, endPoint, officialSolution)}
          shownHints={usedHints}
          onHintClick={onHintClick}
        />
      )}
      <p>{officialSolution}</p>
      <p>user {userSolution}</p>
    </div>
  );
};

export default BestRoute;
