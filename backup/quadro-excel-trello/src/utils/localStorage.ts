
import { AppData } from "@/types";

const STORAGE_KEY = 'calendario-app-data';

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
};

export const loadData = (): AppData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return null;
  }
};

export const getInitialData = (): AppData => {
  return {
    boards: [],
    settings: {
      expandirQuadro: true,
    }
  };
};
