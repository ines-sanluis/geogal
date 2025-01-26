function ZoomButton({
  type,
  icon,
  onClick,
  active,
}: {
  type: "in" | "out" | "reset" | "border";
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  let typeClass = "";
  switch (type) {
    case "in":
      typeClass = "cursor-zoom-in";
      break;
    case "out":
      typeClass = "cursor-zoom-out";
      break;
    case "reset":
      typeClass = "cursor-pointer";
      break;
    case "border":
      typeClass = active ? "bg-blue-500 text-white" : "";
      break;
    default:
      typeClass = "";
  }
  return (
    <button
      id={`zoom-${type}`}
      type="button"
      onClick={onClick}
      className={`rounded-lg text-blue-500 border-2 border-blue-300 bg-blue-200 hover:bg-blue-500 hover:text-white p-1 flex justify-center transition-colors duration-200 ${typeClass}`}
    >
      {icon}
    </button>
  );
}

export default ZoomButton;
