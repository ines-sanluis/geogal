import React, { MouseEventHandler } from "react";
import { municipalitiesData } from "../data/municipalities";
import BlockGuess from "./BlockGuess";
import Guesses from "./Guesses";
import Heading from "./Heading";

const suggestions = municipalitiesData.features.map(
  (feature) => feature.properties?.CONCELLO
);

const GuessForm = ({
  onGuess,
  onGiveUp,
  guesses,
  score,
  gameOver,
  currentLocation,
  hints,
}: {
  onGuess: (municipality: string) => void;
  onGiveUp: () => void;
  guesses: string[];
  score: number;
  gameOver: boolean;
  currentLocation: string;
  hints: string[];
}) => {
  const [selectedMunicipality, setSelectedMunicipality] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [shownHints, setShownHints] = React.useState<number[]>([]);

  const listClasses =
    "text-sm grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-2 border border-[#4a90e2] rounded-lg mt-2 bg-white/50";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) {
      return;
    }
    if (selectedMunicipality) {
      const isAlreadyGuessed = guesses.some(
        (guess) => guess.toLowerCase() === selectedMunicipality.toLowerCase()
      );
      if (isAlreadyGuessed) {
        setMessage("🤔 Xa o seleccionaches!");
        setTimeout(() => setMessage(""), 2000);
        return;
      } else {
        onGuess(selectedMunicipality);
        setSelectedMunicipality("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center relative w-full border border-[#4a90e2] rounded-lg shadow-md">
        <input
          className="bg-[#f0f4ef] rounded-l-lg h-12 px-3 w-full cursor-pointer"
          type="text"
          disabled={gameOver}
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
          placeholder="Escribe un concello..."
          list={selectedMunicipality.length >= 2 ? "suggestions" : undefined}
        />
        <datalist id="suggestions">
          {suggestions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </datalist>
        <button
          onClick={handleSubmit}
          disabled={gameOver}
          className="h-12 px-3 border-0 border-l text-[#f0f4ef] border-[#4a90e2] rounded-r-lg m-0"
        >
          Adiviñar
        </button>
      </div>
      <p
        className={`w-full h-2 text-sm mt-1 mb-4 transition-opacity duration-300 ${
          selectedMunicipality.length > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </p>
      <Guesses
        guesses={guesses}
        currentLocation={currentLocation}
        gameOver={gameOver}
        score={score}
      />
      {!gameOver && (
        <div className="w-full flex flex-col mt-4">
          <Heading
            title={"Pistas"}
            extraText={`🎯 ${313 - score} intento${
              313 - score == 1 ? "" : "s"
            }`}
          />
          <div className="flex flex-col items-center mt-4">
            {hints.map((hint, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!shownHints.includes(index)) {
                    setShownHints([...shownHints, index]);
                  }
                }}
                className="w-full text-sm bg-primary hover:border hover:border-white text-white px-4 py-2 rounded-lg mb-2"
              >
                {shownHints.includes(index) ? hint : "🔒 Ver pista"}
              </button>
            ))}
            <button
              onClick={onGiveUp}
              className="w-full text-sm bg-primary hover:border hover:border-white text-white px-4 py-2 rounded-lg mb-2"
            >
              Rendirme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessForm;
