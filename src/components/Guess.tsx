function Guess({ emoji, text }: { emoji: string; text: string }) {
  const listClasses =
    "text-sm grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-2 border border-[#4a90e2] rounded-lg mt-2 bg-white/50";

  return (
    <li className={listClasses + " bg-white/30"}>
      <span className="font-bold">{emoji}</span>
      <span>{text}</span>
    </li>
  );
}

export default Guess;
