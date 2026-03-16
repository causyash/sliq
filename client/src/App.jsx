import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkspacePage from './pages/WorkspacePage';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, userOnly = false, adminOnly = false }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (!userInfoStr) {
    return <Navigate to="/login" replace />;
  }
  
  const userInfo = JSON.parse(userInfoStr);
  const isAdmin = userInfo.role === 'admin';

  // If a route is user-only and an admin tries to access it, redirect to home (Admin Console)
  if (userOnly && isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If a route is admin-only and a non-admin tries to access it
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/workspaces/:id" element={
          <ProtectedRoute userOnly={true}>
            <WorkspacePage />
          </ProtectedRoute>
        } />
        
        <Route path="/projects/:id" element={
          <ProtectedRoute userOnly={true}>
            <ProjectPage />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute userOnly={true}>
            <AnalyticsPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/analytics" element={
          <ProtectedRoute adminOnly={true}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        } />

        {/* Fallback routes */}
        <Route path="/workspaces" element={<Navigate to="/" replace />} />
        <Route path="/projects" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
