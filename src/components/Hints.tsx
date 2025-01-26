import React from "react";
import Hint from "./Hint";
import Heading from "./Heading";

function Hints({
  hints,
  shownHints,
  onHintClick,
}: {
  shownHints: number;
  hints: {
    text: string;
  }[];
  onHintClick: () => void;
}) {
  return (
    <section className="flex flex-col gap-2">
      <Heading
        title="Obter unha pista"
        extraText={`${shownHints} / ${hints.length} pistas`}
      />
      {hints.map((hint, index) => (
        <Hint
          key={index}
          onClick={onHintClick}
          text={hint.text}
          used={shownHints >= index + 1}
          enabled={shownHints >= index}
        />
      ))}
    </section>
  );
}

export default Hints;
