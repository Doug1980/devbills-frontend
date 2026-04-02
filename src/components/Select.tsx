import { CirclePlus, Pencil } from "lucide-react";
import { type ReactNode, type SelectHTMLAttributes, useId, useRef, useState } from "react";

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
  onAdd?: () => void;
  // ✅ nova prop para editar
  onEdit?: () => void;
}

const Select = ({
  label,
  options,
  icon,
  error,
  fullWidth = true,
  className = "",
  id,
  onAdd,
  onEdit,
  ...rest
}: SelectPros) => {
  const selectId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
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
          className={`block w-full bg-gray-800 py-3 ${icon ? "pl-10" : "pl-4"} pr-10 rounded-xl text-gray-50 text-sm cursor-pointer
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

        {/* ✅ dropdown de ações */}
        {(onAdd || onEdit) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3" ref={ref}>
            <CirclePlus
              className="h-5 w-5 text-primary-500 cursor-pointer hover:text-primary-600 transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <>
                {/* ✅ backdrop para fechar ao clicar fora */}
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                  {onAdd && (
                    <button
                      type="button"
                      onClick={() => {
                        onAdd();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <CirclePlus className="w-4 h-4 text-primary-500" />
                      Nova categoria
                    </button>
                  )}
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onEdit();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-primary-500" />
                      Editar categoria
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* {!onAdd && !onEdit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3"></div>
        )} */}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
