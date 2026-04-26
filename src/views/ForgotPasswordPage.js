import React, { useState } from 'react';
import '../styles/user/login.css';
import '../styles/user/index.css';

function ForgotPasswordPage({ onBackToLogin, onSubmitReset }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const submitReset = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await onSubmitReset(email);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
  };

  return (
    <div className="view-landing sentinel-theme sb-auth-page sb-forgot-page">

      {/* ── Nav: identical to landing ── */}
      <header className="top-nav">
        <div className="layout nav-inner">
          <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>
            <img src="/elikas icon transparent.png" alt="eLikas logo" className="nav-logo" />
            eLikas Bulacan
          </a>
          <div className="nav-actions">
            <button type="button" className="btn solid" onClick={onBackToLogin}>Login</button>
          </div>
          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu">
            <button className="nav-mobile-link" onClick={() => { onBackToLogin(); setMenuOpen(false); }}>Login</button>
          </div>
        )}
      </header>

      <section className="sb-forgot-card">
        <div className="sb-forgot-brand" aria-hidden="true">
          <h1>eLikas Bulacan</h1>
          <small>Emergency Guidance &amp; Disaster Preparedness</small>
        </div>

        <h2>Kalimutan ang Password</h2>
        <p>
          Ipasok ang iyong email para makatanggap ng panuto sa pag-reset ng iyong password.
        </p>

        {error && <div className="sb-auth-error">{error}</div>}
        {message && <div className="sb-auth-message">{message}</div>}

        <form className="sb-auth-form" onSubmit={submitReset}>
          <label htmlFor="sb-forgot-email">Email Address</label>
          <input
            id="sb-forgot-email"
            type="email"
            placeholder="halimbawa@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit" className="sb-auth-submit sb-forgot-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Ipadala ang Link sa Pag-reset'}
          </button>
        </form>

        <button type="button" className="sb-forgot-return" onClick={onBackToLogin}>
          Bumalik sa Login
        </button>
      </section>
    </div>
  );
}

export default ForgotPasswordPage;
