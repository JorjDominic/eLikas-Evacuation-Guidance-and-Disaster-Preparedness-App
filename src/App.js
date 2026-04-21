import React from 'react';
import LandingPage from './views';
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

function App() {
  const [page, setPage] = React.useState('landing');
  const [currentUser, setCurrentUser] = React.useState(null);
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

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const loginAsRole = (role) => {
    const isAdmin = role === 'admin';
    const mockUser = {
      name: isAdmin ? 'Temporary Admin' : 'Temporary User',
      email: isAdmin ? 'admin@temporary.local' : 'user@temporary.local',
      role
    };

    setCurrentUser(mockUser);
    setPage(isAdmin ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('landing');
  };

  const handleForgotPassword = (email) => {
    const cleanedEmail = email.trim();
    if (!cleanedEmail) {
      return { success: false, message: 'Please enter your email address.' };
    }

    const validEmail = /^\S+@\S+\.\S+$/.test(cleanedEmail);
    if (!validEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    return {
      success: true,
      message: 'Reset instructions were sent. Please check your inbox and spam folder.'
    };
  };

  const userNavItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'centers', label: 'Centers' },
    { key: 'center-detail', label: 'Center Detail' },
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
        return <DashboardPage user={currentUser} onLogout={handleLogout} />;
      case 'centers':
        return <CentersPage />;
      case 'center-detail':
        return <CenterDetailPage />;
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
      default:
        return null;
    }
  };

  if (page === 'auth') {
    return (
      <>
        <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
        <div className="sb-auth-page">
          <button
            type="button"
            className="sb-auth-back sb-auth-back-fixed"
            onClick={() => setPage('landing')}
            aria-label="Back to landing"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>
          <section className="sb-forgot-card" style={{ maxWidth: 520 }}>
            <h2>Temporary Login</h2>
            <p>Select a role to continue for testing.</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <button type="button" className="sb-auth-submit" onClick={() => loginAsRole('user')}>
                Login as User
              </button>
              <button type="button" className="sb-auth-submit" onClick={() => loginAsRole('admin')}>
                Login as Admin
              </button>
              <button
                type="button"
                className="sb-forgot-return"
                onClick={() => setPage('forgot-password')}
              >
                Forgot Password
              </button>
            </div>
          </section>
        </div>
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
