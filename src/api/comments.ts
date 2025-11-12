import apiClient from '../lib/api';
import type { Comment } from '../types';

export const commentsApi = {
  create: async (commentData: {
    body: string;
    commentable_type: string;
    commentable_id: number;
  }): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>('/comments', commentData);
    return data;
  },
};

