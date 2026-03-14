import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, Users, FolderOpen, Award, LogOut, Menu, X,
  Bell, ChevronRight, Shield, UserCheck, Gavel, Trophy, FileText,
  PlusCircle, ClipboardList, Settings, BarChart3
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  if (role === 'admin') return [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Participants', path: '/admin/participants', icon: <Users size={18} /> },
    { label: 'Teams', path: '/admin/teams', icon: <UserCheck size={18} /> },
    { label: 'Projects', path: '/admin/projects', icon: <FolderOpen size={18} /> },
    { label: 'Jury Members', path: '/admin/jury', icon: <Gavel size={18} /> },
    { label: 'Assignments', path: '/admin/assignments', icon: <ClipboardList size={18} /> },
    { label: 'Evaluations', path: '/admin/evaluations', icon: <BarChart3 size={18} /> },
    { label: 'Results', path: '/admin/results', icon: <Trophy size={18} /> },
  ];
  if (role === 'participant') return [
    { label: 'Dashboard', path: '/participant', icon: <LayoutDashboard size={18} /> },
    { label: 'My Team', path: '/participant/team', icon: <Users size={18} /> },
    { label: 'Submit Project', path: '/participant/submit', icon: <FileText size={18} /> },
    { label: 'My Project', path: '/participant/project', icon: <FolderOpen size={18} /> },
  ];
  if (role === 'jury') return [
    { label: 'Dashboard', path: '/jury', icon: <LayoutDashboard size={18} /> },
    { label: 'Assigned Projects', path: '/jury/projects', icon: <FolderOpen size={18} /> },
    { label: 'My Evaluations', path: '/jury/evaluations', icon: <ClipboardList size={18} /> },
  ];
  return [];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications: any[] = [];
  const navItems = user ? getNavItems(user.role) : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors: Record<string, string> = {
    admin: 'from-violet-600 to-indigo-700',
    participant: 'from-emerald-500 to-teal-600',
    jury: 'from-amber-500 to-orange-600',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    admin: <Shield size={16} />,
    participant: <UserCheck size={16} />,
    jury: <Gavel size={16} />,
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className={`p-5 bg-gradient-to-r ${user ? roleColors[user.role] : 'from-violet-600 to-indigo-700'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">HackArena</h1>
              <p className="text-white/70 text-xs">Management System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center text-white font-bold text-sm`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${roleColors[user.role]} text-white`}>
                    {roleIcons[user.role]}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? `bg-gradient-to-r ${user ? roleColors[user.role] : 'from-violet-600 to-indigo-700'} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400 hover:text-white p-1">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="hidden lg:block">
              <h2 className="text-white font-semibold text-sm">
                {navItems.find(n => n.path === location.pathname)?.label || 'HackArena'}
              </h2>
              <p className="text-gray-500 text-xs">Hackathon Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center text-white font-bold text-xs`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-gray-300 text-sm">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
