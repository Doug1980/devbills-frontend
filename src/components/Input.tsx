import { type InputHTMLAttributes, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  icon?: ReactNode;
  label?: string;
  error?: string;
  id?: string;
}

const Input = ({ fullWidth, icon, label, error, id, ...rest }: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-50 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute bottom-0 top-5 left-0 pl-1 flex items-center cursor-pointer text-gray-400">
            {icon}
          </div>
        )}
      </div>

      <input
        id={inputId}
        {...rest}
        className={`block w-full rounded-xl border ${error ? "border-red-500" : "border-gray-700"}
  bg-gray-800 px-4 py-3 text-sm text-gray-50 transition-all
  ${error ? "input-focus-error" : "input-focus"}
  ${icon ? "pl-10" : ""}
  `}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
