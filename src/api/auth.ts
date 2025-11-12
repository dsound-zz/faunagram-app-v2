import apiClient from '../lib/api';
import type { AuthResponse, LoginCredentials, SignupData } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/login', credentials);
    return data;
  },

  signup: async (signupData: SignupData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/users', {
      name: signupData.name,
      username: signupData.username,
      password: signupData.password,
    });
    return data;
  },

  getCurrentUser: async (): Promise<any> => {
    const { data } = await apiClient.get('/current_user');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

