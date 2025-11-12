import apiClient from '../lib/api';
import type { Sighting } from '../types';

export const sightingsApi = {
  getAll: async (): Promise<Sighting[]> => {
    const { data } = await apiClient.get<Sighting[]>('/sightings');
    return data;
  },

  getById: async (id: number): Promise<Sighting> => {
    const { data } = await apiClient.get<Sighting>(`/sightings/${id}`);
    return data;
  },

  create: async (formData: FormData): Promise<Sighting> => {
    const { data } = await apiClient.post<Sighting>('/sightings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id: number, formData: FormData): Promise<Sighting> => {
    const { data } = await apiClient.put<Sighting>(`/sightings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sightings/${id}`);
  },

  like: async (id: number, likes: number): Promise<Sighting> => {
    const { data } = await apiClient.put<Sighting>(`/sightings/${id}`, {
      likes: likes + 1,
    });
    return data;
  },
};

