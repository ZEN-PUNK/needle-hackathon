import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';
import AuthCard from '../components/AuthCard';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const result = await apiRequest('/login', 'POST', form);
      onLogin(result);
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <AuthCard title="Sign in to VulnBank" subtitle="Access your digital banking dashboard">
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="alice"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="password123"
          />
        </label>
        {error && <div className="error-box">{error}</div>}
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
      <p className="muted-line">
        New user? <Link to="/register">Create account</Link>
      </p>
    </AuthCard>
  );
}
