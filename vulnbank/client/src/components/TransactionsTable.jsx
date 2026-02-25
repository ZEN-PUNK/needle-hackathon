export default function TransactionsTable({ transactions }) {
  return (
    <section className="table-card">
      <div className="section-heading">
        <h2>Transaction History</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.from_username}</td>
              <td>{tx.to_username}</td>
              <td>${Number(tx.amount).toFixed(2)}</td>
              <td dangerouslySetInnerHTML={{ __html: tx.note || '' }} />
              <td>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
