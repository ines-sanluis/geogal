interface AccessibleToggleProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const AccessibleToggle: React.FC<AccessibleToggleProps> = ({
  isChecked,
  onChange,
  label,
}) => (
  <div className="inline-flex items-center">
    <input
      type="checkbox"
      id="toggle"
      className="sr-only peer"
      checked={isChecked}
      onChange={() => onChange(!isChecked)}
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!isChecked);
        }
      }}
    />
    <label
      htmlFor="toggle"
      className="mr-3 text-sm font-medium peer-focus-visible:text-blue-600 peer-focus-visible:underline"
      onClick={() => onChange(!isChecked)}
    >
      {label}
    </label>
    <div
      className="relative w-11 h-6 bg-blue-200 rounded-full peer-checked:bg-blue-600"
      onClick={() => onChange(!isChecked)}
    >
      <div
        className={`cursor-pointer absolute top-[2px] w-5 h-5 bg-white rounded-full 
         transition-all duration-300 ease-in-out transform
         ${isChecked ? "translate-x-full" : "translate-x-1"}`}
      />
    </div>
  </div>
);

export default AccessibleToggle;
