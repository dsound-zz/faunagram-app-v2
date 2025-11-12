export interface User {
  id: number;
  username: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Animal {
  id: number;
  name: string;
  kingdom?: string;
  phylum?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  image?: string;
  description?: string;
}

export interface Sighting {
  id: number;
  title: string;
  body: string;
  user_id: number;
  animal_id: number;
  image_path?: string;
  image_url?: string;
  likes: number;
  created_at: string;
  updated_at: string;
  user?: User;
  animal?: Animal;
  comments_count?: number;
}

export interface Comment {
  id: number;
  body: string;
  user_id: number;
  username?: string;
  commentable_type: string;
  commentable_id: number;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    username: string;
    name: string;
    avatar_url?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  name: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

