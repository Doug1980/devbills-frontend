import { AlertCircle, ArrowDown, ArrowUp, Filter, Plus, Search, Trash2 } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import EditTransactionModal from "../components/EditTransactionModal";
import ExportDropdown from "../components/ExportDropdown";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import Select from "../components/Select";
import { getCategories } from "../services/categoryService";
import { deleteTransactions, getTransactions } from "../services/transactionServices";
import type { Category } from "../types/category";
import type { Transaction } from "../types/transactions";
import { TransactionType } from "../types/transactions";
import { formatCurrency, formatDate } from "../utils/formatters";

const Transactions = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletingId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  // ✅ estado que controla o modo anual
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions({
        year,
        // ✅ no modo anual não passa o mês, buscando todas as transações do ano
        ...(!isAnnual ? { month } : {}),
        ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
      });
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError("Não foi possível carregar as transações, tente novamente");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeletingId(id);
      await deleteTransactions(id);
      toast.success("Transação deletada com sucesso!");
      setFilteredTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Falha na transação");
    } finally {
      setDeletingId("");
    }
  };

  const confirmDelete = (id: string): void => {
    if (window.confirm("Tem certeza que deseja deletar essa transação?")) {
      handleDelete(id);
    }
  };

  // ✅ isAnnual adicionado como dependência para recarregar ao alternar o modo
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTransactions();
  }, [month, year, selectedCategoryId, isAnnual]);

  const handleSearchChange = (event: ChangeEvent<HTMLAnchorElement>): void => {
    setSearchText(event.target.value);
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.description.toUpperCase().includes(event.target.value.toUpperCase()),
      ),
    );
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategoryId(event.target.value);
    setSearchText("");
  };

  // ✅ ao alternar modo anual, limpa a busca por texto
  const handleAnnualChange = (value: boolean): void => {
    setIsAnnual(value);
    setSearchText("");
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        <div className="flex items-center gap-3">
          {/* ✅ passa isAnnual para o dropdown saber qual export usar */}
          <ExportDropdown month={month} year={year} isAnnual={isAnnual} />
          <Link
            to="/transacoes/nova"
            className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        {/* ✅ passa isAnnual e onAnnualChange para o MonthYearSelect */}
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
          isAnnual={isAnnual}
          onAnnualChange={handleAnnualChange}
        />
      </Card>

      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          <Input
            placeholder="Buscar transações..."
            icon={<Search className="w-4 h-4 mt-1 ml-1" />}
            fullWidth
            onChange={handleSearchChange}
            value={searchText}
          />
          <Select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            fullWidth
            icon={<Filter className="w-4 h-4" />}
            options={[
              { value: "", label: "Todas as categorias" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
            <Button onClick={fetchTransactions} className="mx-auto mt-6">
              Tentar novamente
            </Button>
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma transação encontrada</p>
            <Link
              to="/transacoes/nova"
              className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-700 min-h-full w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Descrição
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    {" "}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => setEditingTransaction(transaction)}
                  >
                    <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUp className="w-4 h-4 text-primary-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-50">
                            {transaction.description}
                          </span>
                          <span className="sm:hidden text-xs text-gray-400 mt-0.5">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category.color }}
                        />
                        <span className="text-sm text-gray-400">{transaction.category.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`${transaction.type === TransactionType.INCOME ? "text-primary-500" : "text-red-500"}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(transaction.id);
                        }}
                        className="text-red-500 hover:text-red-400 rounded-full cursor-pointer"
                        disabled={deletingId === transaction.id}
                      >
                        {deletingId === transaction.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onUpdated={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;
