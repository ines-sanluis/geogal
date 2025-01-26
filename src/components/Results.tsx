import { isStringInArray } from "../utils/compareString";
import useTimeUntilMidnight from "../hooks/useTimeUntilMidnight";
import Heading from "./Heading";
import ShareButtons from "./ShareButtons";

function Results({
  usedHints,
  hasWon,
  solution,
  officialSolution,
  wasOfficialSolution,
  guesses,
}: {
  usedHints: number;
  hasWon: boolean;
  solution: string[];
  officialSolution: string[];
  wasOfficialSolution: boolean;
  guesses: string[];
}) {
  const incorrectGuesses = guesses.filter(
    (guess) =>
      isStringInArray(
        wasOfficialSolution ? officialSolution : solution,
        guess
      ) === false
  ).length;
  const correctGuesses = guesses.filter((guess) =>
    isStringInArray(wasOfficialSolution ? officialSolution : solution, guess)
  ).length;
  const timeLeft = useTimeUntilMidnight();
  const score =
    incorrectGuesses == guesses.length
      ? 0
      : Math.max(
          0,
          100 + // Higher base score
            correctGuesses * 15 - // More points for correct guesses
            incorrectGuesses * 5 - // Moderate penalty for incorrect guesses
            usedHints * 3 // Penalty for using hints
        );
  const maxScore = Math.max(0, 100 + (solution.length - 2) * 15);
  const displayedScore = `${score} / ${maxScore} puntos`;

  return (
    <>
      {hasWon ? (
        <>
          <Heading title={"Parabéns"} extraText={displayedScore} />
          <p>
            {wasOfficialSolution
              ? "Adiviñaches a ruta oficial "
              : "Atopaches unha ruta alternativa "}
            {incorrectGuesses == 0
              ? "sen cometer ningún erro"
              : `con ${incorrectGuesses} erros`}
            . Usaches {usedHints} pistas. Serás quen de repetilo mañá?
          </p>
          {!wasOfficialSolution && officialSolution && (
            <p>
              A nosa solución era{" "}
              <span className="font-semibold">
                {officialSolution.join(" > ")}
              </span>
              .
            </p>
          )}
        </>
      ) : (
        <>
          <Heading title={"Perdiches"} extraText={displayedScore} />
          {correctGuesses === 0 ? (
            <p>
              Non acertaches ningún concello. A solución era{" "}
              <span className="font-semibold">{solution.join(" > ")}</span>.
              Volve mañá para intentalo de novo!
            </p>
          ) : (
            <p>
              Acertaches {correctGuesses} concello
              {correctGuesses > 1 ? "s" : ""} e usaches {usedHints} pistas. A
              solución era{" "}
              <span className="font-semibold">{solution.join(" > ")}</span>.
              Volve mañá para intentalo de novo!
            </p>
          )}
        </>
      )}
      <ShareButtons
        score={score}
        correctGuesses={correctGuesses}
        incorrectGuesses={incorrectGuesses}
        usedHints={usedHints}
        hasWon={hasWon}
      />
      <p className="text-center">Próxima ruta en {timeLeft}.</p>
    </>
  );
}

export default Results;
