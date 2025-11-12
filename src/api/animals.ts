import apiClient from '../lib/api';
import type { Animal } from '../types';

export const animalsApi = {
  getAll: async (): Promise<Animal[]> => {
    const { data } = await apiClient.get<Animal[]>('/animals');
    return data;
  },

  getById: async (id: number): Promise<Animal> => {
    const { data } = await apiClient.get<Animal>(`/animals/${id}`);
    return data;
  },
};

