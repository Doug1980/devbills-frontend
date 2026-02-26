import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthly, getTransactionsSummary } from "../services/transactionServices";
import type { MonthlyItem, TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formatters";

const initialSummary: TransactionSummary = {
  balance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
  expensesByCategory: [],
};

interface ChartLabelProps {
  categoryName: string;
  percent: number;
}

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [MonthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionsSummary(month, year);

      console.log(response);
      setSummary(response);
    }

    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionsMonthly(month, year, 5);

      console.log(response);
      setMonthlyItemsData(response.history);
    }

    loadTransactionsMonthly();
  }, [month, year]);

  const renderPierChatLabel = ({ categoryName, percent }: ChartLabelProps): string => {
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  };

  const formatToollTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0 ">Dashboard!</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FIRT-CARD */}
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
          ${summary.balance > 0 ? "text-primary-500" : "text-red-500"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        {/* SECOND-CARK */}
        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-2xl font-semibold mt-2 text-primary-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        {/* THIRD-CARD */}
        <Card icon={<Wallet size={20} className="text-red-500" />} title="Despesas" hover>
          <p className={"text-2xl font-semibold mt-2 text-red-500"}>
            {formatCurrency(summary.balance)}
          </p>
        </Card>
      </div>
      {/* GRAFICO-PIZZA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className=" text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
          hover
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPierChatLabel}
                  >
                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatToollTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada neste período
              <p>Sem dados</p>
            </div>
          )}
        </Card>

        {/* GRAFICO-BARRAS */}
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Historico Mensal"
          className="min-h-80 p-2.5"
          hover
        >
          <div className="h-72 mt-4">
            {MonthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MonthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ style: { textTransform: "capitalize" } }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 14 } }}
                  />
                  <Tooltip
                    formatter={formatCurrency}
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      borderColor: "#2A2A2A",
                    }}
                    labelStyle={{ color: "#f8f8f8" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="expenses"
                    name="Despesas"
                    fill="#FF6384"
                    activeBar={{ fill: "pink", stroke: "blue" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="income"
                    name="Receitas"
                    fill="#37E359"
                    activeBar={{ fill: "gold", stroke: "purple" }}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Nenhuma despesa registrada neste período</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
