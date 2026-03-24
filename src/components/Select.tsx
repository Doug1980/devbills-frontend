import { type ReactNode, type SelectHTMLAttributes, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectPros extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  options: SelectOption[];
}

const Select = ({
  label,
  options,
  icon,
  error,
  fullWidth = true,
  className = "",
  id,
  ...rest
}: SelectPros) => {
  const selectId = useId();
  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <div className="relative">
        {icon && <div className="absolute insert-y-0 left-0 pl-2 flex items-center">{icon}</div>}
      </div>

      <select id={selectId} {...rest}>
        {options.map((options) => (
          <option key={options.value} value={options.value} className="text-gray-900 bg-white">
            {options.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
