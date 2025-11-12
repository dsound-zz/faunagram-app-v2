import apiClient from '../lib/api';
import type { Comment } from '../types';

export const commentsApi = {
  getAll: async (commentableType?: string, commentableId?: number): Promise<Comment[]> => {
    const params = new URLSearchParams();
    if (commentableType) params.append('commentable_type', commentableType);
    if (commentableId) params.append('commentable_id', commentableId.toString());
    
    const { data } = await apiClient.get<Comment[]>(`/comments?${params.toString()}`);
    return data;
  },

  getBySighting: async (sightingId: number): Promise<Comment[]> => {
    return commentsApi.getAll('Sighting', sightingId);
  },

  getReplies: async (commentId: number): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[]>(`/comments/${commentId}/comments`);
    return data;
  },

  create: async (commentData: {
    body: string;
    commentable_type: string;
    commentable_id: number;
    username?: string;
  }): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>('/comments', commentData);
    return data;
  },

  update: async (id: number, body: string): Promise<Comment> => {
    const { data } = await apiClient.put<Comment>(`/comments/${id}`, { body });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};

