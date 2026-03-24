import { TransactionType } from "../types/transactions";

interface TrasanctionTypeSelecionProps {
  value: TransactionType;
  id?: string;
  onChange: (type: TransactionType) => void;
}

const TransactionTypeSelector = ({ value, onChange, id }: TrasanctionTypeSelecionProps) => {
  const transactionTypeButtons = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-500 border-red-500 text-red-700 font-medium",
      inativeClasses: "bg-transparent border-red-300 text-red-500 hover:bd-red-500",
    },
    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-green-500 border-green-500 text-green-700 font-medium",
      inativeClasses: "bg-transparent border-green-300 text-green-500 hover:bd-green-500",
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionTypeButtons.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 transition-all
            ${value === item.type ? item.activeClasses : item.inativeClasses}
        `}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
