import { create } from 'zustand';
import type { User } from '../lib/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => void;
}

const getCurrentUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem('hms_current_user') || 'null');
  } catch { return null; }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getCurrentUser(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('hms_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hms_current_user');
      localStorage.removeItem('hms_token');
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('hms_current_user');
    localStorage.removeItem('hms_token');
    set({ user: null });
  },
  refreshUser: () => {
    const user = getCurrentUser();
    set({ user });
  },
}));
