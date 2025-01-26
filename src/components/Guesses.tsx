import React from "react";

const Guesses = ({ alreadyGuessed }: { alreadyGuessed: Guess[] }) => {
  return (
    <ul className="flex flex-wrap gap-2 w-full">
      {alreadyGuessed.map((guess: Guess) => (
        <li
          key={guess.name}
          className={`px-2 py-1 rounded-lg flex gap-2 items-center text-blue-950
                  ${guess.correct ? "bg-green-100" : "bg-red-100"}`}
        >
          <span>{guess.correct ? "✅" : "❌"}</span>
          <span className={guess.correct ? "font-semibold" : ""}>
            {guess.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Guesses;
