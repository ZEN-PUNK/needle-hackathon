import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function AdminPage({ auth }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const result = await apiRequest('/admin/users', 'GET', undefined, auth.token);
        setUsers(result);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadUsers();
  }, [auth.token]);

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Admin Panel</h2>
        <p>All platform users.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>${Number(user.balance).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
