import React, { useState } from 'react';
import '../styles/shared/sentinel.css';

function AppTopNav({ role, page, items, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (key) => {
    onNavigate(key);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
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
  );
}

export default AppTopNav;


