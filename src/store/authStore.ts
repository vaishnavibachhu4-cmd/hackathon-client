import { create } from 'zustand';
import type { User } from '../lib/types';
import { db } from '../lib/db';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: db.getCurrentUser(),
  setUser: (user) => {
    db.setCurrentUser(user);
    set({ user });
  },
  logout: () => {
    db.setCurrentUser(null);
    set({ user: null });
  },
  refreshUser: () => {
    const user = db.getCurrentUser();
    set({ user });
  },
}));
