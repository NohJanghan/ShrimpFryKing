import React, { useRef } from 'react';
import logo from '../logo_with_name.png';
import useClickOutside from '../hooks/useClickOutside';
import { THEME_CATEGORIES } from '../constants';

function Header({ page, setPage, user, setUser, showThemeMenu, setShowThemeMenu, setThemePage }) {
  const themeMenuRef = useRef();
  useClickOutside(themeMenuRef, () => setShowThemeMenu(false));

  return (
    <header className="app-header" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, backgroundColor: '#fff', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
      <div className="header-row">
        <div className="logo">
          <button className="logo-btn" onClick={() => setPage('main')} aria-label="메인으로 이동" type="button">
            <img src={logo} alt="Agora Logo" className="logo-img" />
          </button>
        </div>
        <nav className="nav-tabs">
          <ul>
            <li>
              <button className="tab-btn" onClick={() => setPage('popular')}>인기</button>
            </li>
            <li>
              <button className="tab-btn" onClick={() => setPage('latest')}>최신</button>
            </li>
            <li style={{ position: 'relative' }} ref={themeMenuRef}>
              <button className="tab-btn" onClick={() => setShowThemeMenu(prev => !prev)}>주제</button>
              {showThemeMenu && (
                <div className="theme-dropdown">
                  {THEME_CATEGORIES.map(theme => (
                    <button key={theme} className="theme-btn" onClick={() => { setThemePage(theme); setPage('theme'); setShowThemeMenu(false); }}>{theme}</button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <button className="tab-btn write-btn" onClick={() => setPage('write')} type="button">글쓰기</button>
            </li>
          </ul>
        </nav>
      </div>
      {!user ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="tab-btn"
            style={{ background: '#e5e7eb', color: '#111', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
            onClick={() => setPage('login')}
          >
            Sign in
          </button>
          <button
            className="tab-btn"
            style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
            onClick={() => setPage('register')}
          >
            Register
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#ede9fe', color: '#222', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, border: '1px solid #a5b4fc' }}>
            {user.username}
          </div>
          <button
            className="tab-btn"
            style={{ background: '#fff', color: '#111', border: '1px solid #a5b4fc', borderRadius: '8px', padding: '8px 20px', fontWeight: 600 }}
            onClick={() => { setUser(null); setPage('main'); }}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;