export type UserRole = 'admin' | 'participant' | 'jury';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ProjectCategory = 'AI/ML' | 'Web Development' | 'Mobile App' | 'IoT' | 'Cybersecurity' | 'Blockchain';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  college?: string;
  phone?: string;
  organization?: string;
  expertiseArea?: string;
  createdAt: string;
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface Team {
  id: string;
  teamName: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  projectTitle: string;
  category: ProjectCategory;
  createdAt: string;
}

export interface Project {
  id: string;
  teamId: string;
  teamName: string;
  leaderId: string;
  leaderName: string;
  projectTitle: string;
  category: ProjectCategory;
  description: string;
  techStack: string;
  githubLink: string;
  demoVideo: string;
  projectFileName?: string;
  projectFileData?: string;
  submissionDate: string;
}

export interface Assignment {
  id: string;
  projectId: string;
  juryId: string;
  assignedAt: string;
}

export interface Evaluation {
  id: string;
  projectId: string;
  juryId: string;
  juryName: string;
  innovation: number;
  technical: number;
  uiux: number;
  presentation: number;
  impact: number;
  totalScore: number;
  feedback: string;
  evaluatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Winner {
  rank: number;
  teamId: string;
  teamName: string;
  projectTitle: string;
  totalScore: number;
  declaredAt: string;
}
