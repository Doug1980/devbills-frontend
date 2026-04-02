import { AlertCircle, Calendar, DollarSign, Save, Tag, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories } from "../services/categoryService";
import { updateTransaction } from "../services/transactionServices";
import type { Category } from "../types/category";
import { type Transaction, TransactionType } from "../types/transactions";
import Button from "./Button";
import CategoryModal from "./CategoryModal";
import Input from "./Input";
import Select from "./Select";
import TransactionTypeSelector from "./TransactionTypeSelector";

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTransactionModal = ({
  isOpen,
  transaction,
  onClose,
  onUpdated,
}: EditTransactionModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
    date: "",
    categoryId: "",
    type: TransactionType.EXPENSE,
  });

  // ✅ estados para o CategoryModal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date.split("T")[0],
        categoryId: transaction.category.id ?? "",
        type: transaction.type as TransactionType,
      });
    }
  }, [transaction]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  if (!isOpen || !transaction) return null;

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTransactionType = (type: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type, categoryId: "" }));
  };

  // ✅ abre o modal de edição com a categoria selecionada
  const handleEditCategory = () => {
    const selected = filteredCategories.find((c) => c.id === formData.categoryId);
    if (!selected) {
      toast.error("Selecione uma categoria para editar");
      return;
    }
    setEditingCategory(selected);
    setIsCategoryModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
      setError("Preencha todos os campos");
      return;
    }

    if (formData.amount <= 0) {
      setError("Digite um valor válido");
      return;
    }

    try {
      setLoading(true);
      await updateTransaction(transaction.id, {
        ...formData,
        date: `${formData.date}T12:00:00.000Z`,
      });
      toast.success("Transação atualizada com sucesso!");
      onUpdated();
      onClose();
    } catch (err) {
      setError("Erro ao atualizar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Editar Transação</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-50 p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center bg-red-300 border border-red-700 rounded-xl p-3 mb-4 gap-2">
            <AlertCircle className="w-4 h-4 text-red-700" />
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-2 flex-col">
            <label className="text-sm font-medium text-gray-50">Tipo de Transação</label>
            <TransactionTypeSelector value={formData.type} onChange={handleTransactionType} />
          </div>

          <Input
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Supermercado, Salário, etc..."
            fullWidth
          />

          <Input
            label="Valor"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={formData.amount === 0 ? "" : formData.amount}
            onChange={handleChange}
            placeholder="0,00"
            icon={
              <span className="flex items-center text-gray-400 text-sm ml-2 mt-1">
                <span className="text-base">R</span>
                <DollarSign className="w-4 h-4" />
              </span>
            }
            fullWidth
            onFocus={(e) => {
              if (e.target.value === "0") e.target.value = "";
            }}
            onBlur={(e) => {
              if (e.target.value === "") setFormData((prev) => ({ ...prev, amount: 0 }));
            }}
          />

          <Input
            label="Data"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            icon={<Calendar className="w-4 h-4 ml-2 mt-2" />}
            fullWidth
          />

          {/* ✅ Select agora com onAdd e onEdit */}
          <Select
            label="Categoria"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            icon={<Tag className="w-4 h-4" />}
            onAdd={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            onEdit={handleEditCategory}
            options={[
              { value: "", label: "Selecione uma categoria" },
              ...filteredCategories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
            >
              {loading ? (
                <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </form>

        {/* ✅ CategoryModal integrado ao modal de edição de transação */}
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onCategoryCreated={async () => {
            const data = await getCategories();
            setCategories(data);
          }}
          defaultType={formData.type}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
};

export default EditTransactionModal;
