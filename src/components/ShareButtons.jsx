import PropTypes from "prop-types";
import WhatsAppIcon from "./Icons/WhatsappIcon";
import XIcon from "./Icons/XIcon";

const ShareButtons = ({ score, guesses, hasWon }) => {
  const generateShareText = () => {
    const date = new Date().toLocaleDateString("gl");
    const guessCount = guesses.length;
    const maxAttempts = 3;

    return `🎯 Xoguei ao GeoGal (${date})
    🎲 ${guessCount}/${maxAttempts} intentos
    🏆 ${score} puntos
    ${hasWon ? "🎉 Adiviñei o concello!" : "😢 Non o adiviñei"}
Xoga en geogal.vercel.app!`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
      <button
        onClick={handleWhatsAppShare}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                text-white font-medium rounded-xl
                 shadow-lg hover:shadow-xl transition-all duration-200
                 active:scale-95"
      >
        <WhatsAppIcon size={20} />
        <span>WhatsApp</span>
      </button>
      <button
        onClick={handleTwitterShare}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 
                text-white font-medium rounded-xl
                 shadow-lg hover:shadow-xl transition-all duration-200
                 active:scale-95"
      >
        <XIcon size={20} />
        <span>Twitter</span>
      </button>
    </div>
  );
};

ShareButtons.propTypes = {
  score: PropTypes.number.isRequired,
  guesses: PropTypes.arrayOf(
    PropTypes.shape({
      direction: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentLocation: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  hasWon: PropTypes.bool.isRequired,
};

export default ShareButtons;