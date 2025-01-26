import useTimeUntilMidnight from "../hooks/useTimeUntilMidnight";
import Heading from "./Heading";
import ShareButtons from "./ShareButtons";

function Results({
  usedHints,
  hasWon,
  solution,
  guesses,
}: {
  usedHints: number;
  hasWon: boolean;
  solution: string[];
  guesses: Guess[];
}) {
  const incorrectGuesses = guesses.filter((guess) => !guess.correct).length;
  const correctGuesses = guesses.filter((guess) => guess.correct).length;
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
            Acertaches a ruta{" "}
            {incorrectGuesses == 0
              ? "sen cometer ningún erro "
              : `con ${incorrectGuesses} erros `}
            e usaches {usedHints} pistas. Serás quen de repetilo mañá?
          </p>
        </>
      ) : (
        <>
          <Heading title={"Perdeches"} extraText={displayedScore} />
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
      <p className="text-center">Próximo concello en {timeLeft}.</p>
    </>
  );
}

export default Results;
