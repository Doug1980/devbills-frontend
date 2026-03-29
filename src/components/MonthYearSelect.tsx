import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  // ✅ novas props para controle do modo anual
  isAnnual?: boolean;
  onAnnualChange?: (isAnnual: boolean) => void;
}

const monthNames: readonly string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MonthYearSelect = ({
  month,
  onMonthChange,
  onYearChange,
  year,
  isAnnual = false,
  onAnnualChange,
}: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleNextMonth = (): void => {
    if (isAnnual) return; // ✅ bloqueia navegação no modo anual
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };

  const handlePrevMonth = (): void => {
    if (isAnnual) return; // ✅ bloqueia navegação no modo anual
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
      {/* ✅ setas desabilitadas no modo anual */}
      <button
        type="button"
        className={`p-2 rounded-full transition-colors ${
          isAnnual
            ? "text-gray-600 cursor-not-allowed"
            : "hover:bg-gray-800 hover:text-primary-500 cursor-pointer"
        }`}
        aria-label="Mês anterior"
        onClick={handlePrevMonth}
        disabled={isAnnual}
      >
        <ChevronLeft />
      </button>

      <div className="flex gap-3 items-center flex-wrap justify-center">
        {/* ✅ esconde o select de mês no modo anual */}
        {!isAnnual && (
          <>
            <label htmlFor="month-select" className="sr-only">
              Selecionar Mês
            </label>
            <select
              value={month}
              onChange={(event) => onMonthChange(Number(event.target.value))}
              id="month-select"
              className="bg-gray-500 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="year-select" className="sr-only">
          Selecionar Ano
        </label>
        <select
          id="year-select"
          onChange={(event) => onYearChange(Number(event.target.value))}
          value={year}
          className="bg-gray-500 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* ✅ toggle anual ao lado do select de ano */}
        {onAnnualChange && (
          <button
            type="button"
            onClick={() => onAnnualChange(!isAnnual)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isAnnual
                ? "bg-primary-500 text-gray-900 border-primary-500 font-semibold"
                : "border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-500"
            }`}
          >
            {isAnnual ? "✓ Anual" : "Ver Anual"}
          </button>
        )}
      </div>

      <button
        type="button"
        className={`p-2 rounded-full transition-colors ${
          isAnnual
            ? "text-gray-600 cursor-not-allowed"
            : "hover:bg-gray-800 hover:text-primary-500 cursor-pointer"
        }`}
        aria-label="Próximo Mês"
        onClick={handleNextMonth}
        disabled={isAnnual}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
