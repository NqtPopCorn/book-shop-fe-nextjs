import { api } from '@/lib/api';
export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { firstName?: string; lastName?: string };
export type AuthResponse = { accessToken: string; user: { id: number; email: string; role: string } };
export const authApi = { login: (input: LoginInput) => api.post<AuthResponse>('/auth/login', input).then((r) => r.data), register: (input: RegisterInput) => api.post<AuthResponse>('/auth/register', input).then((r) => r.data) };
