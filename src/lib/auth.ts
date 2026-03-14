import { db, verifyPassword } from './db';
import type { User, UserRole } from './types';

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = db.getUserByEmail(email.toLowerCase().trim());
  if (!user) return { success: false, error: 'No account found with this email.' };
  if (!verifyPassword(password, user.password)) return { success: false, error: 'Incorrect password.' };
  if (user.role !== 'admin' && user.approvalStatus !== 'approved') {
    if (user.approvalStatus === 'pending') return { success: false, error: 'Your account is pending admin approval.' };
    if (user.approvalStatus === 'rejected') return { success: false, error: 'Your account has been rejected. Contact admin.' };
  }
  db.setCurrentUser(user);
  return { success: true, user };
}

export function logout() {
  db.setCurrentUser(null);
}

export function getCurrentUser(): User | null {
  return db.getCurrentUser();
}

export function requireRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return !!user && user.role === role;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}
