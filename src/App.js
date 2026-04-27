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
import AdminUsersPage from './views/admin/AdminUsersPage';
import AdminAuditLogsPage from './views/admin/AdminAuditLogsPage';
import AppTopNav from './views/AppTopNav';
import ThemeToggleButton from './views/ThemeToggleButton';
import ResetPasswordPage from './views/ResetPasswordPage';

function App() {
  const [page, setPage] = React.useState('landing');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);
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
    const redirectByRole = async (user) => {
      // Retry the profiles fetch up to 3 times — the session cookie may not
      // be propagated to RLS yet on the very first SIGNED_IN event.
      let profile = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 600));
        const { data } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single();
        if (data) { profile = data; break; }
      }

      // app_metadata is only writable by service role — trust it above all else.
      // profiles.role is the normal source of truth for regular users.
      const appRole  = user.app_metadata?.role;
      const profRole = profile?.role;
      const role = appRole === 'admin' || profRole === 'admin'
        ? 'admin'
        : (appRole || profRole || user.user_metadata?.role || 'user');
      const name =
        profile?.name ||
        user.user_metadata?.name ||
        user.email;

      setCurrentUser({ name, email: user.email, role });
      setPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
      setAuthLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) redirectByRole(session.user);
        else setAuthLoading(false);
      } else if (event === 'SIGNED_IN') {
        if (session?.user) redirectByRole(session.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        setPage('reset-password');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setPage('landing');
      }
    });

    // Unblock loading if no session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setAuthLoading(false);
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

    // Ensure profile row exists (handles cases where the trigger didn't fire)
    if (data.user) {
      await supabase.from('profiles').upsert({
        id:   data.user.id,
        name: name.trim(),
        role: 'user'
      }, { onConflict: 'id' });
    }

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
    { key: 'admin-reports', label: 'Reports' },
    { key: 'admin-users', label: 'Users' },
    { key: 'admin-audit-logs', label: 'Audit Logs' }
  ];

  const isAdmin = currentUser?.role === 'admin';

  const renderPage = () => {
    // Role guards — redirect if someone lands on the wrong side
    const adminPage = page.startsWith('admin-');
    if (adminPage && !isAdmin) return <DashboardPage user={currentUser} onNavigate={setPage} />;
    if (!adminPage && isAdmin && ['dashboard','centers','center-detail','alerts','guides','hazard-report'].includes(page)) {
      return <AdminDashboardPage user={currentUser} onLogout={handleLogout} />;
    }

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
        return <HazardReportPage currentUser={currentUser} />;
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
      case 'admin-users':
        return <AdminUsersPage currentUser={currentUser} />;
      case 'admin-audit-logs':
        return <AdminAuditLogsPage />;
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
        <div key="auth">
          <LoginPage
            onBack={() => setPage('landing')}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPassword={() => setPage('forgot-password')}
          />
        </div>
      </>
    );
  }

  if (page === 'forgot-password') {
    return (
      <>
        <ThemeToggleButton theme={theme} onToggle={handleThemeToggle} />
        <div key="forgot-password">
          <ForgotPasswordPage
            onBackToLogin={() => setPage('auth')}
            onSubmitReset={handleForgotPassword}
          />
        </div>
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
      <div key={page} style={{ paddingTop: '62px' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
