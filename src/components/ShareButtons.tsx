import Button from "./Button";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const ShareButtons = ({
  score,
  correctGuesses,
  incorrectGuesses,
  usedHints,
  hasWon,
}: {
  score: number;
  correctGuesses: number;
  incorrectGuesses: number;
  usedHints: number;
  hasWon: boolean;
}) => {
  const generateShareText = (platform: string) => {
    const date = new Date().toLocaleDateString("gl");

    return `🎯 Xoguei ao GeoGal (${date})
    ${hasWon ? "🎉 Adiviñei a ruta!" : "😢 Non a adiviñei"}
    🏆 ${score} puntos.
    ✅ ${correctGuesses} acertos.
    ❌  ${incorrectGuesses} fallos.
    🧠 ${usedHints} pistas.
${
  platform === "Twitter"
    ? "Un xogo de @sanluisdev - https://geogal.vercel.app"
    : "Xoga en geogal.vercel.app!"
}`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText("WhatsApp"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareText("Twitter"));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
      <Button
        onClick={handleWhatsAppShare}
        text="WhatsApp"
        icon={<FaWhatsapp size={20} />}
        disabled={false}
        hideText
      />
      <Button
        onClick={handleTwitterShare}
        text="X"
        icon={<FaXTwitter size={20} />}
        disabled={false}
        hideText
      />
    </div>
  );
};

export default ShareButtons;
