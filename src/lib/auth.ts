import { apiClient } from './apiClient';
import type { User, UserRole } from './types';

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    if (response.token && response.user) {
      localStorage.setItem('hms_token', response.token);
      localStorage.setItem('hms_current_user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    }
    return { success: false, error: 'Invalid response from server' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
}

export function logout() {
  localStorage.removeItem('hms_token');
  localStorage.removeItem('hms_current_user');
}

export function getCurrentUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem('hms_current_user') || 'null');
  } catch { return null; }
}

export function requireRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return !!user && user.role === role;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}
