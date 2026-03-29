import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { getTransactions } from "../services/transactionServices";
import {
  exportAnnualExcel,
  exportAnnualPDF,
  exportMonthlyExcel,
  exportMonthlyPDF,
} from "../utils/exportUtils";

interface ExportDropdownProps {
  month: number;
  year: number;
  // ✅ controla se o modo anual está ativo
  isAnnual: boolean;
}

type ExportOption = {
  label: string;
  icon: React.ReactNode;
  action: () => Promise<void>;
};

const ExportDropdown = ({ month, year, isAnnual }: ExportDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingOption, setLoadingOption] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const handleExport = async (key: string, action: () => Promise<void>) => {
    try {
      setLoadingOption(key);
      await action();
      toast.success("Arquivo exportado com sucesso!");
    } catch (err) {
      toast.error("Erro ao exportar arquivo.");
    } finally {
      setLoadingOption("");
      setIsOpen(false);
    }
  };

  // ✅ opções mudam dinamicamente conforme o modo anual ou mensal
  const options: Record<string, ExportOption> = isAnnual
    ? {
        // ✅ modo anual — só mostra opções anuais
        annualPDF: {
          label: "PDF Anual",
          icon: <FileText className="w-4 h-4 text-red-400" />,
          action: async () => {
            // ✅ busca sem mês para trazer todas as transações do ano
            const data = await getTransactions({ year });
            exportAnnualPDF(data, year);
          },
        },
        annualExcel: {
          label: "Excel Anual",
          icon: <FileSpreadsheet className="w-4 h-4 text-green-400" />,
          action: async () => {
            const data = await getTransactions({ year });
            exportAnnualExcel(data, year);
          },
        },
      }
    : {
        // ✅ modo mensal — só mostra opções mensais
        monthlyPDF: {
          label: "PDF Mensal",
          icon: <FileText className="w-4 h-4 text-red-400" />,
          action: async () => {
            const data = await getTransactions({ month, year });
            exportMonthlyPDF(data, month, year);
          },
        },
        monthlyExcel: {
          label: "Excel Mensal",
          icon: <FileSpreadsheet className="w-4 h-4 text-green-400" />,
          action: async () => {
            const data = await getTransactions({ month, year });
            exportMonthlyExcel(data, month, year);
          },
        },
      };

  return (
    <div className="relative" ref={ref}>
      {/* ✅ botão que abre o dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 border border-gray-700 text-gray-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all"
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>

      {/* ✅ menu dropdown */}
      {isOpen && (
        <>
          {/* ✅ backdrop invisível para fechar ao clicar fora */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
            {Object.entries(options).map(([key, option]) => (
              <button
                key={key}
                type="button"
                disabled={!!loadingOption}
                onClick={() => handleExport(key, option.action)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loadingOption === key ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                ) : (
                  option.icon
                )}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportDropdown;
