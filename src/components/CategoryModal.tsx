import { X } from "lucide-react";

import { type FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createCategory, updateCategory } from "../services/categoryService";
import type { Category } from "../types/category";
import { TransactionType } from "../types/transactions";
import Button from "./Button";
import Input from "./Input";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
  defaultType?: TransactionType;
  // ✅ novas props para edição
  editingCategory?: Category | null;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onCategoryCreated,
  defaultType = TransactionType.EXPENSE,
  editingCategory,
}: CategoryModalProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#37E359");
  const [type, setType] = useState<TransactionType>(defaultType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ preenche o formulário quando estiver editando
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color);
      setType(editingCategory.type as TransactionType);
    } else {
      setName("");
      setColor(defaultType === TransactionType.INCOME ? "#37E359" : "#FF5873");
      setType(defaultType);
    }
  }, [editingCategory, defaultType, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editingCategory;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        // ✅ atualiza categoria existente
        await updateCategory(editingCategory.id, { name: name.trim(), color });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        // ✅ cria nova categoria
        await createCategory({ name: name.trim(), type });
        toast.success("Categoria criada com sucesso!");
      }
      setName("");
      onCategoryCreated();
      onClose();
    } catch (err) {
      setError(
        isEditing
          ? "Erro ao atualizar categoria."
          : "Categoria já existente! Por favor, digite outro nome.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 z-10">
        <div className="flex items-center justify-between mb-6">
          {/* ✅ título muda conforme o modo */}
          <h2 className="text-lg font-bold">{isEditing ? "Editar Categoria" : "Nova Categoria"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-50 p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
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
          {/* ✅ tipo só editável ao criar — não ao editar */}
          {!isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-50 mb-2">Tipo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
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
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    type === TransactionType.INCOME
                      ? "bg-primary-500 text-gray-900"
                      : "border border-primary-500 text-primary-500 hover:bg-primary-500/10"
                  }`}
                >
                  Receita
                </button>
              </div>
            </div>
          )}

          <Input
            label="Nome"
            placeholder="Ex: Alimentação, Salário..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {/* ✅ seletor de cor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-50 mb-2">Cor</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-700 bg-gray-800"
              />
              <span className="text-sm text-gray-400">{color}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                "Salvar"
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
