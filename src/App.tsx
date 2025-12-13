import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';

// Layouts
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PublicLayout } from '@/layouts/PublicLayout';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { VerifyEmail } from '@/pages/auth/VerifyEmail';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Dashboard Pages
import { Dashboard } from '@/pages/dashboard/Overview';
import { Monitors } from '@/pages/dashboard/Monitors';
import { CreateMonitor } from '@/pages/dashboard/CreateMonitor';
import { MonitorDetails } from '@/pages/dashboard/MonitorDetails';
import { EditMonitor } from '@/pages/dashboard/EditMonitor';
import { TeamSettings } from '@/pages/dashboard/TeamSettings';

// New Feature Pages
import Incidents from '@/pages/Incidents';
import Alerts from '@/pages/Alerts';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';

// Public Pages
import { StatusPage as StatusPagePublic } from '@/pages/public/StatusPage';
import Home from '@/pages/Home';
import Docs from '@/pages/public/Docs';
import Contact from '@/pages/public/Contact';
import About from '@/pages/public/About';
import Privacy from '@/pages/public/Privacy';
import Terms from '@/pages/public/Terms';
import Reports from '@/pages/dashboard/Reports';
import Maintenance from '@/pages/dashboard/Maintenance';
import StatusPageSettings from '@/pages/dashboard/StatusPageSettings';
import Integrations from '@/pages/dashboard/Integrations';
import ApiKeys from '@/pages/dashboard/ApiKeys';
import MoreMenu from '@/pages/MoreMenu';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin (by email or flag)
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  const isAdmin = user?.isAdmin || adminEmails.includes(user?.email || '');

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Guest Route wrapper (redirect if already logged in)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Public Status Page */}
          <Route path="/status/:slug" element={<StatusPagePublic />} />

          {/* Auth Routes */}
          <Route
            element={
              <GuestRoute>
                <AuthLayout />
              </GuestRoute>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitors" element={<Monitors />} />
            <Route path="/monitors/new" element={<CreateMonitor />} />
            <Route path="/monitors/:id" element={<MonitorDetails />} />
            <Route path="/monitors/:id/edit" element={<EditMonitor />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/team" element={<TeamSettings />} />
            <Route path="/status-page" element={<StatusPageSettings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/keys" element={<ApiKeys />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menu" element={<MoreMenu />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
