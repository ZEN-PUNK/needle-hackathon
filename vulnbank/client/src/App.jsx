import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransferPage from './pages/TransferPage';
import AdminPage from './pages/AdminPage';
import SidebarLayout from './components/SidebarLayout';

function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('vulnbank_auth');
    return raw ? JSON.parse(raw) : { token: '', user: null };
  });

  const authActions = useMemo(
    () => ({
      login: (payload) => {
        localStorage.setItem('vulnbank_auth', JSON.stringify(payload));
        setAuth(payload);
      },
      logout: () => {
        localStorage.removeItem('vulnbank_auth');
        setAuth({ token: '', user: null });
      }
    }),
    []
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={authActions.login} />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={auth.token}>
            <SidebarLayout auth={auth} onLogout={authActions.logout}>
              <DashboardPage auth={auth} />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transfer"
        element={
          <ProtectedRoute token={auth.token}>
            <SidebarLayout auth={auth} onLogout={authActions.logout}>
              <TransferPage auth={auth} />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute token={auth.token}>
            <SidebarLayout auth={auth} onLogout={authActions.logout}>
              <AdminPage auth={auth} />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
