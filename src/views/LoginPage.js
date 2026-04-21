import React, { useState } from 'react';
import '../styles/user/login.css';

function LoginPage({ onBack, onLogin, onRegister, onForgotPassword }) {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const submitLogin = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const result = onLogin(loginForm);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(`Welcome back, ${result.user.name}!`);
  };

  const submitRegister = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const result = onRegister(registerForm);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(`Account created. Welcome, ${result.user.name}!`);
  };

  return (
    <div className="sb-auth-page">
      <button className="sb-auth-back sb-auth-back-fixed" onClick={onBack} aria-label="Back to landing">
        <span aria-hidden="true">&#8592;</span>
      </button>

      <div className="sb-auth-panel">
        <section className="sb-auth-brand">
          <h1>eLikas Bulacan</h1>
          <p>
            Standing watch over the heritage and safety of Bulakenyos.
            A legacy of resilience, powered by tactical readiness.
          </p>

   

          <div className="sb-auth-brand-image" aria-hidden="true" />
        </section>

        <section className="sb-auth-form-shell">
          <div className="sb-tab-switch" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              className={activeTab === 'login' ? 'sb-tab-btn active' : 'sb-tab-btn'}
              onClick={() => setActiveTab('login')}
              aria-selected={activeTab === 'login'}
            >
              Log-in
            </button>
            <button
              type="button"
              role="tab"
              className={activeTab === 'register' ? 'sb-tab-btn active' : 'sb-tab-btn'}
              onClick={() => setActiveTab('register')}
              aria-selected={activeTab === 'register'}
            >
              Sign-up
            </button>
          </div>

          {error && <div className="sb-auth-error">{error}</div>}
          {message && <div className="sb-auth-message">{message}</div>}

          <div className="sb-auth-hint">
            Demo accounts: <strong>admin@elikas.com / admin123</strong> and <strong>user@elikas.com / user123</strong>
          </div>

          {activeTab === 'login' ? (
            <form className="sb-auth-form" onSubmit={submitLogin}>
              <label htmlFor="sb-login-email">Email / Username</label>
              <input
                id="sb-login-email"
                type="email"
                placeholder="JuanDelaCruz@bulacan.gov.ph"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              />

              <div className="sb-auth-label-row">
                <label htmlFor="sb-login-password">Password</label>
                <button type="button" className="sb-forgot-link" onClick={onForgotPassword}>
                  Forgot Password?
                </button>
              </div>
              <input
                id="sb-login-password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              />

              <button type="submit" className="sb-auth-submit">Log-in</button>
            </form>
          ) : (
            <form className="sb-auth-form" onSubmit={submitRegister}>
              <label htmlFor="sb-register-name">Full Name</label>
              <input
                id="sb-register-name"
                type="text"
                placeholder="Juan Dela Cruz"
                value={registerForm.name}
                onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
              />

              <label htmlFor="sb-register-email">Email</label>
              <input
                id="sb-register-email"
                type="email"
                placeholder="you@example.com"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
              />

              <label htmlFor="sb-register-password">Password</label>
              <input
                id="sb-register-password"
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
              />

              <label htmlFor="sb-register-confirm">Confirm Password</label>
              <input
                id="sb-register-confirm"
                type="password"
                placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })}
              />

              <button type="submit" className="sb-auth-submit">Create Account</button>
            </form>
          )}
        </section>
      </div>

      <footer className="sb-auth-footer">
        Emergency Guidance and Disaster Preparedness System that covers Bulacan area.
      </footer>
    </div>
  );
}

export default LoginPage;

