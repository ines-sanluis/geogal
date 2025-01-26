import { isStringInArray } from "../utils/compareString";
import React from "react";

const Guesses = ({
  alreadyGuessed,
  solution,
}: {
  alreadyGuessed: string[];
  solution: string[];
}) => {
  return (
    <ul className="flex flex-wrap gap-2 w-full">
      {alreadyGuessed.map((guess: string) => (
        <li
          key={guess}
          className={`px-2 py-1 rounded-lg flex gap-2 items-center text-blue-950
          ${isStringInArray(solution, guess) ? "bg-green-100" : "bg-red-100"}`}
        >
          <span>{isStringInArray(solution, guess) ? "✅" : "❌"}</span>
          <span
            className={isStringInArray(solution, guess) ? "font-semibold" : ""}
          >
            {guess}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Guesses;
