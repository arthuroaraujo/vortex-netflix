import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
}

export async function getMe(token: string): Promise<User> {
  const response = await api.get<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
