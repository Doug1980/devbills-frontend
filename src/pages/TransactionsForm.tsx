import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import CategoryModal from "../components/CategoryModal";
import Input from "../components/Input";
import Select from "../components/Select";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionServices";
import type { Category } from "../types/category";
import { type CreateTransactionDTO, TransactionType } from "../types/transactions";

interface FormData {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const initialFormData = {
  description: "",
  amount: 0,
  date: "",
  categoryId: "",
  type: TransactionType.EXPENSE,
};

const TransactionsForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // ✅ estado que controla abertura/fechamento do modal de categoria
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const formId = useId();
  const navigate = useNavigate();

  // ✅ extraído do useEffect para poder ser reutilizado no onCategoryCreated
  const fetchCategories = async (): Promise<void> => {
    const response = await getCategories();
    setCategories(response);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const validadeForm = (): boolean => {
    if (!formData || !formData.amount || !formData.date || !formData.categoryId) {
      setError("Necessário preencher todos os campos");
      return false;
    }
    if (formData.amount <= 0) {
      setError("Digite um Valor");
      return false;
    }
    return true;
  };

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type: itemType }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const LOADING_DELAY_MS = 2000;

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);

    if (!validadeForm()) return;

    setLoading(true);

    try {
      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: formData.amount,
        categoryId: formData.categoryId,
        type: formData.type,
        date: `${formData.date}T12:00:00.000Z`,
      };

      const delay = new Promise((resolve) => setTimeout(resolve, LOADING_DELAY_MS));
      await Promise.all([createTransaction(transactionData), delay]);

      toast.success("Transação realizada com sucesso");
      navigate("/transacoes");
    } catch (err) {
      toast.error("Falha ao adicionar transação");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/transacoes");
  };

  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova transação</h1>

        <Card>
          {error && (
            <div className="flex items-center bg-red-300 border border-red-700 rounded-xl p-4 mb-6 gap-2">
              <AlertCircle className="w-5 h-5 text-red-700" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex gap-2 flex-col">
              <label htmlFor={formId}>Tipo de Transação</label>
              <TransactionTypeSelector
                id={formId}
                value={formData.type}
                onChange={handleTransactionType}
              />
            </div>

            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Supermercado, Salário, etc..."
            />

            <Input
              label="Valor"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              // ✅ exibe vazio quando valor é 0, evitando o "0" fixo no input
              value={formData.amount === 0 ? "" : formData.amount}
              onChange={handleChange}
              placeholder="0,00"
              icon={<DollarSign className="w-4 h-4 ml-2 mt-1" />}
              // ✅ ao focar, limpa o campo se o valor for "0"
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              // ✅ ao sair do campo vazio, volta para 0
              onBlur={(e) => {
                if (e.target.value === "") {
                  setFormData((prev) => ({ ...prev, amount: 0 }));
                }
              }}
            />

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4 ml-2 mt-2" />}
            />

            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="w-4 h-4" />}
              // ✅ ao clicar no CirclePlus, abre o modal de nova categoria
              onAdd={() => setIsCategoryModalOpen(true)}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />

            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>
                Cancelar
              </Button>
              <Button
                disabled={loading}
                type="submit"
                variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </form>

          {/* ✅ modal de criação de categoria — só renderiza quando isCategoryModalOpen é true */}
          {/* ✅ onCategoryCreated chama fetchCategories para atualizar a lista automaticamente */}
          {/* ✅ defaultType passa o tipo atual do formulário (despesa ou receita) para o modal */}
          <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onCategoryCreated={fetchCategories}
            defaultType={formData.type}
          />
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
