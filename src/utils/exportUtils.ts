import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { Transaction } from "../types/transactions";
import { TransactionType } from "../types/transactions";
import { formatCurrency, formatDate } from "./formatters";

//meses em português para o nome do arquivo
const monthNames: Record<number, string> = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

//formata as transações para linhas da tabela
const buildRows = (transactions: Transaction[]) =>
  transactions.map((t) => [
    t.description,
    formatDate(t.date),
    t.category.name,
    formatCurrency(t.amount),
    t.type === TransactionType.INCOME ? "Receita" : "Despesa",
  ]);

const HEADERS = ["Descrição", "Data", "Categoria", "Valor", "Tipo"];

//exportar PDF mensal
export const exportMonthlyPDF = (
  transactions: Transaction[],
  month: number,
  year: number,
): void => {
  const doc = new jsPDF();
  const title = `DevBills — ${monthNames[month]}/${year}`;

  doc.setFontSize(16);
  doc.text(title, 14, 16);

  autoTable(doc, {
    head: [HEADERS],
    body: buildRows(transactions),
    startY: 24,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [55, 227, 89], textColor: [0, 0, 0] },
  });

  doc.save(`devbills-${monthNames[month].toLowerCase()}-${year}.pdf`);
};

//exportar PDF anual
export const exportAnnualPDF = (transactions: Transaction[], year: number): void => {
  const doc = new jsPDF();
  const title = `DevBills — Anual ${year}`;

  doc.setFontSize(16);
  doc.text(title, 14, 16);

  autoTable(doc, {
    head: [HEADERS],
    body: buildRows(transactions),
    startY: 24,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [55, 227, 89], textColor: [0, 0, 0] },
  });

  doc.save(`devbills-anual-${year}.pdf`);
};

//exportar Excel mensal
export const exportMonthlyExcel = (
  transactions: Transaction[],
  month: number,
  year: number,
): void => {
  const rows = transactions.map((t) => ({
    Descrição: t.description,
    Data: formatDate(t.date),
    Categoria: t.category.name,
    Valor: t.amount,
    Tipo: t.type === TransactionType.INCOME ? "Receita" : "Despesa",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${monthNames[month]} ${year}`);
  XLSX.writeFile(wb, `devbills-${monthNames[month].toLowerCase()}-${year}.xlsx`);
};

//exportar Excel anual
export const exportAnnualExcel = (transactions: Transaction[], year: number): void => {
  const rows = transactions.map((t) => ({
    Descrição: t.description,
    Data: formatDate(t.date),
    Categoria: t.category.name,
    Valor: t.amount,
    Tipo: t.type === TransactionType.INCOME ? "Receita" : "Despesa",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Anual ${year}`);
  XLSX.writeFile(wb, `devbills-anual-${year}.xlsx`);
};
