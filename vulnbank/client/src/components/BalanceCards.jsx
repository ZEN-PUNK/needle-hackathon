export default function BalanceCards({ user, transactions }) {
  const totalOutgoing = transactions
    .filter((tx) => tx.from_user_id === user.id)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalIncoming = transactions
    .filter((tx) => tx.to_user_id === user.id)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <section className="cards-grid">
      <article className="card card-balance">
        <span>Available Balance</span>
        <h2>${Number(user.balance || 0).toFixed(2)}</h2>
      </article>
      <article className="card">
        <span>Total Incoming</span>
        <h3>${totalIncoming.toFixed(2)}</h3>
      </article>
      <article className="card">
        <span>Total Outgoing</span>
        <h3>${totalOutgoing.toFixed(2)}</h3>
      </article>
    </section>
  );
}
