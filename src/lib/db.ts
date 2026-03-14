import type { User, Team, Project, Assignment, Evaluation, Notification, Winner } from './types';

const KEYS = {
  users: 'hms_users',
  teams: 'hms_teams',
  projects: 'hms_projects',
  assignments: 'hms_assignments',
  evaluations: 'hms_evaluations',
  notifications: 'hms_notifications',
  winners: 'hms_winners',
  currentUser: 'hms_current_user',
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const db = {
  // Users
  getUsers: (): User[] => get<User>(KEYS.users),
  saveUsers: (users: User[]) => set(KEYS.users, users),
  getUserById: (id: string) => get<User>(KEYS.users).find(u => u.id === id),
  getUserByEmail: (email: string) => get<User>(KEYS.users).find(u => u.email === email),
  addUser: (user: User) => { const users = get<User>(KEYS.users); users.push(user); set(KEYS.users, users); },
  updateUser: (id: string, updates: Partial<User>) => {
    const users = get<User>(KEYS.users).map(u => u.id === id ? { ...u, ...updates } : u);
    set(KEYS.users, users);
  },

  // Teams
  getTeams: (): Team[] => get<Team>(KEYS.teams),
  getTeamById: (id: string) => get<Team>(KEYS.teams).find(t => t.id === id),
  getTeamByLeader: (leaderId: string) => get<Team>(KEYS.teams).find(t => t.leaderId === leaderId),
  addTeam: (team: Team) => { const teams = get<Team>(KEYS.teams); teams.push(team); set(KEYS.teams, teams); },
  updateTeam: (id: string, updates: Partial<Team>) => {
    const teams = get<Team>(KEYS.teams).map(t => t.id === id ? { ...t, ...updates } : t);
    set(KEYS.teams, teams);
  },

  // Projects
  getProjects: (): Project[] => get<Project>(KEYS.projects),
  getProjectById: (id: string) => get<Project>(KEYS.projects).find(p => p.id === id),
  getProjectByTeam: (teamId: string) => get<Project>(KEYS.projects).find(p => p.teamId === teamId),
  addProject: (project: Project) => { const projects = get<Project>(KEYS.projects); projects.push(project); set(KEYS.projects, projects); },
  updateProject: (id: string, updates: Partial<Project>) => {
    const projects = get<Project>(KEYS.projects).map(p => p.id === id ? { ...p, ...updates } : p);
    set(KEYS.projects, projects);
  },

  // Assignments
  getAssignments: (): Assignment[] => get<Assignment>(KEYS.assignments),
  getAssignmentsByJury: (juryId: string) => get<Assignment>(KEYS.assignments).filter(a => a.juryId === juryId),
  getAssignmentsByProject: (projectId: string) => get<Assignment>(KEYS.assignments).filter(a => a.projectId === projectId),
  addAssignment: (assignment: Assignment) => {
    const assignments = get<Assignment>(KEYS.assignments);
    assignments.push(assignment);
    set(KEYS.assignments, assignments);
  },
  removeAssignment: (id: string) => {
    const assignments = get<Assignment>(KEYS.assignments).filter(a => a.id !== id);
    set(KEYS.assignments, assignments);
  },

  // Evaluations
  getEvaluations: (): Evaluation[] => get<Evaluation>(KEYS.evaluations),
  getEvaluationsByProject: (projectId: string) => get<Evaluation>(KEYS.evaluations).filter(e => e.projectId === projectId),
  getEvaluationByJuryProject: (juryId: string, projectId: string) =>
    get<Evaluation>(KEYS.evaluations).find(e => e.juryId === juryId && e.projectId === projectId),
  addEvaluation: (evaluation: Evaluation) => {
    const evaluations = get<Evaluation>(KEYS.evaluations);
    evaluations.push(evaluation);
    set(KEYS.evaluations, evaluations);
  },
  updateEvaluation: (id: string, updates: Partial<Evaluation>) => {
    const evaluations = get<Evaluation>(KEYS.evaluations).map(e => e.id === id ? { ...e, ...updates } : e);
    set(KEYS.evaluations, evaluations);
  },

  // Notifications
  getNotifications: (userId: string): Notification[] =>
    get<Notification>(KEYS.notifications).filter(n => n.userId === userId),
  addNotification: (notif: Notification) => {
    const notifs = get<Notification>(KEYS.notifications);
    notifs.push(notif);
    set(KEYS.notifications, notifs);
  },
  markNotificationRead: (id: string) => {
    const notifs = get<Notification>(KEYS.notifications).map(n => n.id === id ? { ...n, read: true } : n);
    set(KEYS.notifications, notifs);
  },

  // Winners
  getWinners: (): Winner[] => get<Winner>(KEYS.winners),
  setWinners: (winners: Winner[]) => set(KEYS.winners, winners),

  // Auth
  getCurrentUser: (): User | null => {
    try { return JSON.parse(localStorage.getItem(KEYS.currentUser) || 'null'); } catch { return null; }
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
    else localStorage.removeItem(KEYS.currentUser);
  },
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function hashPassword(password: string): string {
  // Simple hash simulation for frontend demo
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hashed_' + Math.abs(hash).toString(16) + '_' + password.length;
}

export function verifyPassword(password: string, hashed: string): boolean {
  return hashPassword(password) === hashed;
}

export function initializeAdmin() {
  const users = db.getUsers();
  const adminExists = users.find(u => u.role === 'admin');
  if (!adminExists) {
    const admin: User = {
      id: generateId(),
      name: 'System Admin',
      email: 'admin@hackathon.com',
      password: hashPassword('Admin@123'),
      role: 'admin',
      approvalStatus: 'approved',
      createdAt: new Date().toISOString(),
    };
    db.addUser(admin);
  }
}
