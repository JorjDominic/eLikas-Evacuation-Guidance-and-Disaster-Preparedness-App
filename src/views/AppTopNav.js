import React, { useState } from 'react';
import '../styles/shared/sentinel.css';

function AppTopNav({ role, page, items, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleNav = (key) => {
    onNavigate(key);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    onLogout();
  };

  return (
    <>
    <nav className={`app-top-nav ${role === 'admin' ? 'admin' : 'user'}`}>
      <div className="app-top-nav__inner">
        <div className="app-top-nav__brand">
          <img src="/elikas icon transparent.png" alt="eLikas logo" className="app-top-nav__logo" />
          {role === 'admin' ? 'eLikas Command Center' : 'eLikas Responder View'}
        </div>

        {/* Desktop links */}
        <div className="app-top-nav__links">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`app-top-nav__btn ${page === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="app-top-nav__btn logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Hamburger button — visible on mobile only */}
        <button
          type="button"
          className="app-top-nav__hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="app-top-nav__mobile-menu">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`app-top-nav__mobile-btn ${page === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="app-top-nav__mobile-btn logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>

    {showConfirm && (
      <div className="sent-modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="signout-title" onClick={() => setShowConfirm(false)}>
        <div className="sent-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="sent-modal__title" id="signout-title">Sign out of eLikas?</h2>
          <p className="sent-modal__body">You'll be returned to the login screen. Any unsaved changes will be lost.</p>
          <div className="sent-modal__actions">
            <button className="sent-modal__btn ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
            <button className="sent-modal__btn danger" onClick={confirmLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default AppTopNav;


