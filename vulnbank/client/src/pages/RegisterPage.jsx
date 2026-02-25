import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';
import AuthCard from '../components/AuthCard';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await apiRequest('/register', 'POST', form);
      setMessage('Account created. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <AuthCard title="Open a VulnBank account" subtitle="Get started with digital-first finance">
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Username
          <input
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="new-user"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="choose-a-password"
          />
        </label>
        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}
        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </form>
      <p className="muted-line">
        Have an account? <Link to="/login">Back to login</Link>
      </p>
    </AuthCard>
  );
}
