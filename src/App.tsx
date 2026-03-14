import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResultsPage from './pages/ResultsPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ParticipantsPage from './pages/admin/ParticipantsPage';
import TeamsPage from './pages/admin/TeamsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import JuryPage from './pages/admin/JuryPage';
import AssignmentsPage from './pages/admin/AssignmentsPage';
import EvaluationsPage from './pages/admin/EvaluationsPage';
import AdminResultsPage from './pages/admin/ResultsPage';

// Participant
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import TeamPage from './pages/participant/TeamPage';
import SubmitProjectPage from './pages/participant/SubmitProjectPage';
import MyProjectPage from './pages/participant/MyProjectPage';

// Jury
import JuryDashboard from './pages/jury/JuryDashboard';
import AssignedProjectsPage from './pages/jury/AssignedProjectsPage';
import MyEvaluationsPage from './pages/jury/MyEvaluationsPage';

import Layout from './components/Layout';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:role" element={<RegisterPage />} />
        <Route path="/results" element={<ResultsPage />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/participants" element={<ProtectedRoute role="admin"><ParticipantsPage /></ProtectedRoute>} />
        <Route path="/admin/teams" element={<ProtectedRoute role="admin"><TeamsPage /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute role="admin"><ProjectsPage /></ProtectedRoute>} />
        <Route path="/admin/jury" element={<ProtectedRoute role="admin"><JuryPage /></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute role="admin"><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/admin/evaluations" element={<ProtectedRoute role="admin"><EvaluationsPage /></ProtectedRoute>} />
        <Route path="/admin/results" element={<ProtectedRoute role="admin"><AdminResultsPage /></ProtectedRoute>} />

        {/* Participant */}
        <Route path="/participant" element={<ProtectedRoute role="participant"><ParticipantDashboard /></ProtectedRoute>} />
        <Route path="/participant/team" element={<ProtectedRoute role="participant"><TeamPage /></ProtectedRoute>} />
        <Route path="/participant/submit" element={<ProtectedRoute role="participant"><SubmitProjectPage /></ProtectedRoute>} />
        <Route path="/participant/project" element={<ProtectedRoute role="participant"><MyProjectPage /></ProtectedRoute>} />

        {/* Jury */}
        <Route path="/jury" element={<ProtectedRoute role="jury"><JuryDashboard /></ProtectedRoute>} />
        <Route path="/jury/projects" element={<ProtectedRoute role="jury"><AssignedProjectsPage /></ProtectedRoute>} />
        <Route path="/jury/evaluations" element={<ProtectedRoute role="jury"><MyEvaluationsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
