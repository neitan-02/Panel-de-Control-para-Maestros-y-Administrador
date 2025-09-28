// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Componente para proteger rutas
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Wrapper para LandingPage
const LandingPageWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <LandingPage onAccessPanel={() => navigate('/login')} />;
};

// Wrapper para LoginPage
const LoginPageWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <LoginPage onShowRegister={() => navigate('/register')} />;
};

// Wrapper para RegisterPage
const RegisterPageWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  return <RegisterPage onBackToLogin={() => navigate('/login')} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPageWithNavigation />} />
            <Route path="/login" element={<LoginPageWithNavigation />} />
            <Route path="/register" element={<RegisterPageWithNavigation />} />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
