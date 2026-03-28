import { X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { createCategory } from "../services/categoryService";
import { TransactionType } from "../types/transactions";
import Button from "./Button";
import Input from "./Input";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
  defaultType?: TransactionType;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onCategoryCreated,
  defaultType = TransactionType.EXPENSE,
}: CategoryModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>(defaultType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    try {
      setLoading(true);
      await createCategory({ name: name.trim(), type });
      toast.success("Categoria criada com sucesso!");
      setName("");
      onCategoryCreated();
      onClose();
    } catch (err) {
      setError("Categoria já existente! Por favor, digite outro nome.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nova Categoria</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-50 p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-300 border border-red-700 rounded-xl p-3 mb-4 text-sm text-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-50 mb-2">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  type === TransactionType.EXPENSE
                    ? "bg-red-500 text-white"
                    : "border border-red-500 text-red-500 hover:bg-red-500/10"
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  type === TransactionType.INCOME
                    ? "bg-primary-500 text-gray-900"
                    : "border border-primary-500 text-primary-500 hover:bg-primary-500/10"
                }`}
              >
                Receita
              </button>
            </div>
          </div>

          {/* Nome */}
          <Input
            label="Nome"
            placeholder="Ex: Alimentação, Salário..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
