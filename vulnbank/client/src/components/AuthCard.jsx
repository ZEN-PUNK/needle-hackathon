export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
