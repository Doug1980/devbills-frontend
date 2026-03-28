import { CirclePlus } from "lucide-react";
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
  onAdd?: () => void; // 👈 nova prop
}

const Select = ({
  label,
  options,
  icon,
  error,
  fullWidth = true,
  className = "",
  id,
  onAdd, // 👈 desestruturar
  ...rest
}: SelectPros) => {
  const selectId = useId();
  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm text-gray-50 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <select
          id={selectId}
          {...rest}
          className={`block w-full bg-gray-800 py-3 ${icon ? "pl-10" : "pl-4"} pr-4 rounded-xl text-gray-50 text-sm cursor-pointer
            border
            ${error ? "border-red-500" : "border-gray-700"}
            ${error ? "focus:border-red-500" : "focus:border-primary-500"}
            focus:outline-none outline-none appearance-none`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900 bg-white">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <CirclePlus
            className={`h-5 w-5 transition-colors ${onAdd ? "text-primary-500 cursor-pointer hover:text-primary-600" : "text-gray-400"}`}
            onClick={onAdd} // 👈 dispara a ação
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
