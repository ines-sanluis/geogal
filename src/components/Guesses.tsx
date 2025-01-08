import BlockGuess from "./BlockGuess";
import Heading from "./Heading";

function Guesses({
  guesses,
  currentLocation,
  gameOver,
  score,
}: {
  guesses: string[];
  currentLocation: string;
  gameOver: boolean;
  score: number;
}) {
  return (
    <div className="w-full flex flex-col mt-4">
      {/* <Heading title={"Intentos"} extraText={`🔥 ${score} puntos`} /> */}
      <ul className="list-disc list-inside">
        {guesses.length > 0 &&
          guesses[guesses.length - 1] === currentLocation && (
            <>
              <BlockGuess
                emoji={"🎉"}
                text={`Noraboa! Era ${currentLocation}.`}
              />
              <BlockGuess emoji={"🔥"} text={`Conseguiches ${score} puntos.`} />
            </>
          )}
        {/* {[...guesses].reverse().map((guess, index) => (
          <BlockGuess
            key={`guess-${index}`}
            emoji={(guesses.length - index).toString()}
            text={guess}
          />
        ))} */}
        {guesses.length === 0 && !gameOver && (
          <BlockGuess
            emoji={"👀"}
            text={"Es quen de adiviñar que concello é?"}
          />
        )}
        {gameOver && guesses[guesses.length - 1] !== currentLocation && (
          <>
            <BlockGuess emoji={"😔"} text={`Era ${currentLocation}.`} />
            <BlockGuess emoji={"🍀"} text={`Boa sorte na próxima!`} />
          </>
        )}
      </ul>
    </div>
  );
}

export default Guesses;
