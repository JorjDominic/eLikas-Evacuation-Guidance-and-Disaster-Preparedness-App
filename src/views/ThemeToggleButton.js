import React from 'react';

function ThemeToggleButton({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-btn__icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M21.75 15.02A9.75 9.75 0 0 1 12 21.75C6.62 21.75 2.25 17.38 2.25 12A9.75 9.75 0 0 1 9 2.25a.75.75 0 0 1 .77 1.1A8.25 8.25 0 0 0 20.65 14.23a.75.75 0 0 1 1.1.77Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M12 6.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0-4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm0 16.5a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM3 11.25h1.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5Zm16.5 0H21a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5ZM5.52 4.46a.75.75 0 0 1 1.06 0L7.64 5.5a.75.75 0 0 1-1.06 1.06L5.52 5.52a.75.75 0 0 1 0-1.06Zm10.84 10.84a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM5.52 18.48a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Zm10.84-10.84a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0Z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default ThemeToggleButton;

