require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { db, initDb } = require('./db');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 4000;

initDb();

app.use(express.json());
app.use(cors({ origin: '*' }));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'VulnBank',
    warning: 'Intentionally vulnerable demo app. Not for production.',
    debugMode: config.debugMode,
    fakeAwsAccessKey: config.fakeAwsAccessKey
  });
});

app.post('/api/register', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const query = `INSERT INTO users (username, password, role, balance) VALUES ('${username}', '${password}', 'user', 1000)`;

  db.run(query, function registerCb(err) {
    if (err) {
      return next(err);
    }

    res.json({
      message: 'Registered successfully (insecure plaintext password storage enabled for demo)',
      userId: this.lastID
    });
  });
});

app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.get(query, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      config.jwtSecret
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance
      }
    });
  });
});

app.get('/api/account/:userId', authMiddleware, (req, res, next) => {
  const query = `SELECT id, username, role, balance FROM users WHERE id=${req.params.userId}`;

  db.get(query, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });
});

app.get('/api/transactions/:userId', authMiddleware, (req, res, next) => {
  const query = `
    SELECT t.*, fu.username AS from_username, tu.username AS to_username
    FROM transactions t
    LEFT JOIN users fu ON fu.id = t.from_user_id
    LEFT JOIN users tu ON tu.id = t.to_user_id
    WHERE t.from_user_id=${req.params.userId} OR t.to_user_id=${req.params.userId}
    ORDER BY t.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return next(err);
    }

    res.json(rows);
  });
});

app.post('/api/transfer', authMiddleware, (req, res, next) => {
  const { fromUserId, toUsername, amount, note } = req.body;
  const transferAmount = Number(amount);

  if (!fromUserId || !toUsername || !transferAmount || transferAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transfer payload' });
  }

  const sourceUserQuery = `SELECT * FROM users WHERE id=${fromUserId}`;
  const targetUserQuery = `SELECT * FROM users WHERE username='${toUsername}'`;

  db.get(sourceUserQuery, (srcErr, sourceUser) => {
    if (srcErr) {
      return next(srcErr);
    }

    if (!sourceUser) {
      return res.status(404).json({ error: 'Source user not found' });
    }

    if (sourceUser.balance < transferAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    db.get(targetUserQuery, (dstErr, targetUser) => {
      if (dstErr) {
        return next(dstErr);
      }

      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }

      const debitQuery = `UPDATE users SET balance = balance - ${transferAmount} WHERE id=${sourceUser.id}`;
      const creditQuery = `UPDATE users SET balance = balance + ${transferAmount} WHERE id=${targetUser.id}`;
      const transactionQuery = `INSERT INTO transactions (from_user_id, to_user_id, amount, note) VALUES (${sourceUser.id}, ${targetUser.id}, ${transferAmount}, '${note || ''}')`;

      db.serialize(() => {
        db.run(debitQuery);
        db.run(creditQuery);
        db.run(transactionQuery, (txnErr) => {
          if (txnErr) {
            return next(txnErr);
          }

          res.json({ message: 'Transfer completed', to: targetUser.username, amount: transferAmount });
        });
      });
    });
  });
});

app.get('/api/admin/users', (req, res, next) => {
  db.all('SELECT id, username, role, password, balance FROM users ORDER BY id ASC', (err, users) => {
    if (err) {
      return next(err);
    }

    res.json(users);
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    debugMode: config.debugMode
  });
});

app.listen(PORT, () => {
  console.log(`VulnBank server running on http://localhost:${PORT}`);
});
