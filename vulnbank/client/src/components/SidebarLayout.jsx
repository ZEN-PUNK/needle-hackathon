import { Link, useLocation } from 'react-router-dom';

function NavItem({ to, label, current }) {
  return (
    <Link to={to} className={`nav-item ${current === to ? 'active' : ''}`}>
      {label}
    </Link>
  );
}

export default function SidebarLayout({ auth, onLogout, children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">VulnBank</div>
        <p className="brand-subtitle">Digital Banking Portal</p>

        <nav className="nav">
          <NavItem to="/dashboard" label="Dashboard" current={location.pathname} />
          <NavItem to="/transfer" label="Transfer Money" current={location.pathname} />
          <NavItem to="/admin" label="Admin Panel" current={location.pathname} />
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">@{auth.user?.username}</div>
          <button className="btn btn-ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Welcome to VulnBank</h1>
            <p>Professional online banking demo environment</p>
          </div>
          <span className="warning-badge">Intentionally Vulnerable Demo</span>
        </header>
        {children}
      </main>
    </div>
  );
}
