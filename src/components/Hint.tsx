import React from "react";
import Button from "./Button";

interface HintProps {
  onClick: () => void;
  text: string;
  used: boolean;
  enabled?: boolean;
}

function Hint({ onClick, text, used, enabled }: HintProps) {
  return (
    <Button
      text={used ? text : "🔍 Ver pista"}
      disabled={used || !enabled}
      onClick={onClick}
      className={!enabled ? "opacity-50" : ""}
    />
  );
}

export default Hint;
