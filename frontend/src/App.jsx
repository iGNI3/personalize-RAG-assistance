import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import MetricsPage from './pages/MetricsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-blobs">
        <div className="blob blob-cyan" />
        <div className="blob blob-purple" />
        <div className="blob blob-indigo" />
      </div>
      <div className="app-shell relative z-10">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><MetricsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
