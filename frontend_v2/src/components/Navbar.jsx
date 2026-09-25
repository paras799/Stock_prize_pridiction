import React from 'react';
import { Link } from '../router/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Sun, Moon, ChevronDown } from 'lucide-react';

const Navbar = ({ assets = [], selectedAssetId, onSelectAsset, backendOnline = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-header">
      <div className="container-xl navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="brand-title">
              Quant<span>AI</span> <span className="brand-version">v2.0</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/models" className="nav-link">
            Model Hub
          </Link>
          <Link to="/about" className="nav-link">
            Architecture
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="navbar-actions">
          {/* Quick Asset Selector Dropdown */}
          {assets.length > 0 && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedAssetId}
                onChange={(e) => onSelectAsset(e.target.value)}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  padding: '0.45rem 2.2rem 0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {a.name} ({a.symbol})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 10, color: 'var(--neon-cyan)', pointerEvents: 'none' }} />
            </div>
          )}

          {/* Theme Toggle Button (Light Rainbow Mode vs Cyber Dark Mode) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Rainbow Mode' : 'Switch to Cyber Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--neon-amber)' }} /> : <Moon size={20} style={{ color: 'var(--neon-purple)' }} />}
          </button>

          {/* Live API Server Status Indicator */}
          <div
            className="status-indicator-chip"
            style={!backendOnline ? { background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)', color: 'var(--neon-rose)' } : {}}
          >
            <span className="status-dot" style={!backendOnline ? { background: 'var(--neon-rose)', boxShadow: '0 0 10px var(--neon-rose)' } : {}} />
            <span>{backendOnline ? 'ML ENGINE ONLINE' : 'DISCONNECTED'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
