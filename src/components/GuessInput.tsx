import React from "react";
import { toast } from "react-toastify";

function cleanString(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

const GuessInput = ({
  start,
  end,
  onGuess,
  alreadyGuessed,
  isGameOver,
  suggestions,
}: {
  start: string;
  end: string;
  onGuess: (municipality: string) => void;
  alreadyGuessed: Guess[];
  isGameOver: boolean;
  suggestions: string[];
}) => {
  const [currentGuess, setCurrentGuess] = React.useState("");

  const handleSubmit = () => {
    if (isGameOver) {
      return;
    }
    if (currentGuess) {
      let clearGuess = cleanString(currentGuess);
      let isAlreadyGuessed = alreadyGuessed.some(
        (guess) => cleanString(guess.name) === clearGuess
      );
      if (isAlreadyGuessed) {
        toast.warning("Xa tes a " + currentGuess + " na túa ruta.");
        return;
      } else if (
        clearGuess === cleanString(start) ||
        clearGuess === cleanString(end)
      ) {
        toast.error("Non podes empregar os concellos obxectivo");
        return;
      } else if (
        !suggestions.some(
          (suggestion) => cleanString(suggestion) === clearGuess
        )
      ) {
        toast.error("Non recoñezo ese concello.");
      } else {
        onGuess(currentGuess);
        setCurrentGuess("");
      }
    }
  };

  return (
    <div
      className={`flex flex-col items-center transition-opacity duration-300
        ${isGameOver ? "opacity-70" : "opacity-100"}
        `}
    >
      <div className="relative text-blue-950 flex items-center relative w-full border border-blue-200 rounded-lg shadow-md">
        <input
          className={`rounded-lg h-12 px-3 w-full ${
            isGameOver
              ? "bg-blue-100 cursor-not-allowed"
              : "cursor-pointer bg-blue-50"
          }
            `}
          type="text"
          disabled={isGameOver}
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          // onClick or onEnter call handleSubmit
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "OK") {
              handleSubmit();
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          placeholder="Escribe o nome dun concello..."
          list={"suggestions"}
        />
        <datalist id="suggestions">
          {suggestions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
};

export default GuessInput;
