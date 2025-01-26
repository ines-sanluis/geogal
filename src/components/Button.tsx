function Button({
  text,
  hideText,
  disabled,
  onClick,
  className,
  icon,
}: {
  text: string;
  hideText?: boolean;
  disabled: boolean;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      className={`
    font-semibold
    border-2 border-blue-300 rounded-lg py-2 w-full justify-center
    transition-colors duration-200
    flex items-center gap-2
    ${
      disabled
        ? "cursor-not-allowed "
        : "cursor-pointer rounded-lg text-blue-500 bg-blue-100 hover:bg-blue-500 hover:text-white "
    } ${className}`}
      onClick={onClick}
      aria-label={text}
      type="button"
      disabled={disabled}
    >
      {icon}
      {!hideText && <span>{text}</span>}
    </button>
  );
}

export default Button;
