import React from 'react';
import { supabase } from './config/supabase';
import LandingPage from './views';
import LoginPage from './views/LoginPage';
import ForgotPasswordPage from './views/ForgotPasswordPage';
import DashboardPage from './views/user/DashboardPage';
import AdminDashboardPage from './views/admin/AdminDashboardPage';
import CentersPage from './views/user/CentersPage';
import CenterDetailPage from './views/user/CenterDetailPage';
import AlertsPage from './views/user/AlertsPage';
import GuidesPage from './views/user/GuidesPage';
import HazardReportPage from './views/user/HazardReportPage';
import AdminCentersPage from './views/admin/AdminCentersPage';
import AdminAlertsPage from './views/admin/AdminAlertsPage';
import AdminGuidesPage from './views/admin/AdminGuidesPage';
import AdminReportsPage from './views/admin/AdminReportsPage';
import AppTopNav from './views/AppTopNav';
import ThemeToggleButton from './views/ThemeToggleButton';
import ResetPasswordPage from './views/ResetPasswordPage';

function App() {
  const [page, setPage] = React.useState('landing');
  const [currentUser, setCurrentUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [selectedCenterId, setSelectedCenterId] = React.useState(null);
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = window.localStorage.getItem('elikas-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('elikas-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    const redirectByRole = (user) => {
      const role =
        user.user_metadata?.role ||
        user.app_metadata?.role ||
        'user';
      const name = user.user_metadata?.name || user.email;
      setCurrentUser({ name, email: user.email, role });
      setPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) redirectByRole(session.user);
        setAuthLoading(false);
      } else if (event === 'SIGNED_IN') {
        if (session?.user) redirectByRole(session.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        setPage('reset-password');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setPage('landing');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = async (loginForm) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const handleRegister = async (registerForm) => {
    const { name, email, password, confirmPassword } = registerForm;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim(), role: 'user' } }
    });
    if (error) return { success: false, message: error.message };

    if (!data.session) {
      return { success: true, confirmEmail: true };
    }

    // session exists → SIGNED_IN event will handle redirect
    return { success: true };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleForgotPassword = async (email) => {
    const cleanedEmail = email.trim();
    if (!cleanedEmail) {
      return { success: false, message: 'Please enter your email address.' };
    }

    const validEmail = /^\S+@\S+\.\S+$/.test(cleanedEmail);
    if (!validEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanedEmail, {
      redirectTo: window.location.origin
    });
    if (error) return { success: false, message: error.message };

    return {
      success: true,
      message: 'Reset instructions were sent. Please check your inbox and spam folder.'
    };
  };

  const userNavItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'centers', label: 'Centers' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'guides', label: 'Guides' },
    { key: 'hazard-report', label: 'Report Hazard' }
  ];

  const adminNavItems = [
    { key: 'admin-dashboard', label: 'Dashboard' },
    { key: 'admin-centers', label: 'Centers' },
    { key: 'admin-alerts', label: 'Alerts' },
    { key: 'admin-guides', label: 'Guides' },
    { key: 'admin-reports', label: 'Reports' }
  ];

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage user={currentUser} onNavigate={setPage} />;
      case 'centers':
        return <CentersPage onSelectCenter={(id) => { setSelectedCenterId(id); setPage('center-detail'); }} />;
      case 'center-detail':
        return <CenterDetailPage centerId={selectedCenterId} onBack={() => setPage('centers')} />;
      case 'alerts':
        return <AlertsPage />;
      case 'guides':
        return <GuidesPage />;
      case 'hazard-report':
        return <HazardReportPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage user={currentUser} onLogout={handleLogout} />;
      case 'admin-centers':
        return <AdminCentersPage />;
      case 'admin-alerts':
        return <AdminAlertsPage />;
      case 'admin-guides':
        return <AdminGuidesPage />;
      case 'admin-reports':
        return <AdminReportsPage />;
      case 'reset-password':
        return <ResetPasswordPage onDone={() => setPage('landing')} />;
      default:
        return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Page not found.</h2></div>;
    }
  };

  if (authLoading) {
    return null;
  }

  if (page === 'auth') {
    return (
      <>
        <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
        <LoginPage
          onBack={() => setPage('landing')}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onForgotPassword={() => setPage('forgot-password')}
        />
      </>
    );
  }

  if (page === 'forgot-password') {
    return (
      <>
        <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
        <ForgotPasswordPage
          onBackToLogin={() => setPage('auth')}
          onSubmitReset={handleForgotPassword}
        />
      </>
    );
  }

  if (page === 'landing') {
    return (
      <>
        <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
        <LandingPage
          onLogin={() => setPage('auth')}
          onRegister={() => setPage('auth')}
        />
      </>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div>
      <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
      <AppTopNav
        role={isAdmin ? 'admin' : 'user'}
        page={page}
        items={navItems}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

export default App;
