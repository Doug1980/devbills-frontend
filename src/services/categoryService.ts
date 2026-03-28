import type { Category } from "../types/category";
import { api } from "./api";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};

export const createCategory = async (data: { name: string; type: string }): Promise<Category> => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error();
  }
};
