import React from "react";
import PropTypes from "prop-types";
import { MAX_GUESSES } from "../App";

const GuessForm = ({
  municipalities,
  onGuess,
  guesses,
  score,
  gameOver,
  currentLocation,
}) => {
  const [selectedMunicipality, setSelectedMunicipality] = React.useState("");
  const [message, setMessage] = React.useState("");
  const listClasses =
    "text-sm grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-2 border border-[#4a90e2] rounded-lg mt-2 bg-white/50";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMunicipality) {
      const isAlreadyGuessed = guesses.some(
        (guess) => guess.name === selectedMunicipality
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
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
          placeholder="Escribe un concello..."
          list={selectedMunicipality.length >= 2 ? "suggestions" : undefined}
        />
        <datalist id="suggestions">
          {Object.keys(municipalities).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </datalist>
        <button
          onClick={handleSubmit}
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
      <div className="w-full flex flex-col mt-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Intentos</h2>
          <p className="text-lg font-bold"> 🔥 {score}</p>
        </div>
        <ul className="list-disc list-inside">
          {guesses.map((guess, index) => (
            <li key={index + "guess" + guess.name} className={listClasses}>
              <span className="font-bold">{index + 1}</span>
              <span className="text-left">{guess.name}</span>
              <span>{guess.distance}km</span>
              <span>{guess.direction}</span>
            </li>
          ))}
          {Array.from({ length: MAX_GUESSES - guesses.length }).map(
            (_, index) => (
              <li key={index + "guessLeft"} className={listClasses}>
                <span className="font-bold">{guesses.length + index + 1}</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
              </li>
            )
          )}
          {gameOver &&
            guesses.length > 0 &&
            guesses[guesses.length - 1]?.name !== currentLocation?.name && (
              <li className={listClasses + " bg-white/30"}>
                <span className="font-bold">🏁</span>
                <span>{currentLocation.name}</span>
                <span></span>
              </li>
            )}
        </ul>
      </div>
    </div>
  );
};

GuessForm.propTypes = {
  municipalities: PropTypes.object.isRequired,
  onGuess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  guesses: PropTypes.array.isRequired,
  score: PropTypes.number,
  gameOver: PropTypes.bool,
  currentLocation: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default GuessForm;