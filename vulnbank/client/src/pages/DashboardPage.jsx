import { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import BalanceCards from '../components/BalanceCards';
import TransactionsTable from '../components/TransactionsTable';

export default function DashboardPage({ auth }) {
  const [user, setUser] = useState(auth.user);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [account, history] = await Promise.all([
          apiRequest(`/account/${auth.user.id}`, 'GET', undefined, auth.token),
          apiRequest(`/transactions/${auth.user.id}`, 'GET', undefined, auth.token)
        ]);
        setUser(account);
        setTransactions(history);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadData();
  }, [auth.token, auth.user.id]);

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  return (
    <div className="dashboard-grid">
      <BalanceCards user={user} transactions={transactions} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
