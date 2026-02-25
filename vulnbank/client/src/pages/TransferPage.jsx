import { useState } from 'react';
import { apiRequest } from '../api';

export default function TransferPage({ auth }) {
  const [form, setForm] = useState({
    fromUserId: auth.user.id,
    toUsername: '',
    amount: '',
    note: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const result = await apiRequest('/transfer', 'POST', form, auth.token);
      setMessage(`Transfer complete: $${Number(result.amount).toFixed(2)} to ${result.to}`);
      setForm((prev) => ({ ...prev, amount: '', toUsername: '', note: '' }));
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Transfer Money</h2>
        <p>Move funds between internal demo accounts.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          From User ID
          <input
            value={form.fromUserId}
            onChange={(event) => setForm((prev) => ({ ...prev, fromUserId: event.target.value }))}
          />
        </label>
        <label>
          Recipient Username
          <input
            value={form.toUsername}
            onChange={(event) => setForm((prev) => ({ ...prev, toUsername: event.target.value }))}
            placeholder="bob"
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            placeholder="125.00"
          />
        </label>
        <label>
          Transfer Note
          <input
            value={form.note}
            onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
            placeholder="Invoice payment"
          />
        </label>

        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        <button className="btn btn-primary" type="submit">
          Send Transfer
        </button>
      </form>
    </section>
  );
}
