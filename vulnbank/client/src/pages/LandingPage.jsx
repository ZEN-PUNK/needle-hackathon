import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div>
          <p className="eyebrow">Trusted Digital Banking Experience</p>
          <h1>Bank smarter with VulnBank</h1>
          <p className="landing-subtext">
            A modern, full-service online banking platform mockup for security scanner demonstrations.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/login">
              Secure Login
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Open Account
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <h3>Enterprise-grade Dashboard</h3>
          <ul>
            <li>Account balances</li>
            <li>Real-time transfer workflows</li>
            <li>Admin user management view</li>
          </ul>
          <span className="warning-badge">Intentionally Vulnerable for Demo</span>
        </div>
      </header>
    </div>
  );
}
