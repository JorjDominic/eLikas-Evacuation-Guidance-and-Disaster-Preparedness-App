import React, { useState } from 'react';
import '../styles/user/login.css';

function ForgotPasswordPage({ onBackToLogin, onSubmitReset }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="sb-auth-page sb-forgot-page">
      <button className="sb-auth-back sb-auth-back-fixed" onClick={onBackToLogin} aria-label="Back to login">
        <span aria-hidden="true">&#8592;</span>
      </button>

      <section className="sb-forgot-card">
        <div className="sb-forgot-brand" aria-hidden="true">
          <h1>Sentinela Bulacan</h1>
          <small>Heritage &amp; Resilience</small>
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
