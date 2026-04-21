import React from 'react';
import '../styles/shared/sentinel.css';

function AppTopNav({ role, page, items, onNavigate, onLogout }) {
  return (
    <nav className={`app-top-nav ${role === 'admin' ? 'admin' : 'user'}`}>
      <div className="app-top-nav__inner">
        <div className="app-top-nav__brand">
          {role === 'admin' ? 'eLikas Command Center' : 'eLikas Responder View'}
        </div>
        <div className="app-top-nav__links">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`app-top-nav__btn ${page === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="app-top-nav__btn logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AppTopNav;

