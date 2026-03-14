import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'info' | 'warning' | 'success' | 'error' | 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange';

const variantClasses: Record<BadgeVariant, string> = {
  pending: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  approved: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  rejected: 'bg-red-900/40 text-red-300 border-red-700/50',
  info: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  warning: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  success: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  error: 'bg-red-900/40 text-red-300 border-red-700/50',
  purple: 'bg-violet-900/40 text-violet-300 border-violet-700/50',
  blue: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  green: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  yellow: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  red: 'bg-red-900/40 text-red-300 border-red-700/50',
  orange: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
};

export default function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
