require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db, initDb } = require('./db');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 4000;

const SALT_ROUNDS = 10;

initDb();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'] }));

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
    warning: 'Intentionally vulnerable demo app. Not for production.'
  });
});

app.post('/api/register', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  bcrypt.hash(password, SALT_ROUNDS, (hashErr, hash) => {
    if (hashErr) return next(hashErr);

    db.run(
      'INSERT INTO users (username, password, role, balance) VALUES (?, ?, ?, ?)',
      [username, hash, 'user', 1000],
      function registerCb(err) {
        if (err) {
          return next(err);
        }

        res.json({
          message: 'Registered successfully',
          userId: this.lastID
        });
      }
    );
  });
});

app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (compareErr, match) => {
      if (compareErr) return next(compareErr);

      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        config.jwtSecret,
        { expiresIn: '1h' }
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
});

app.get('/api/account/:userId', authMiddleware, (req, res, next) => {
  const requestedId = parseInt(req.params.userId, 10);

  if (req.user.id !== requestedId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.get('SELECT id, username, role, balance FROM users WHERE id = ?', [requestedId], (err, user) => {
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
  const requestedId = parseInt(req.params.userId, 10);

  if (req.user.id !== requestedId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const query = `
    SELECT t.*, fu.username AS from_username, tu.username AS to_username
    FROM transactions t
    LEFT JOIN users fu ON fu.id = t.from_user_id
    LEFT JOIN users tu ON tu.id = t.to_user_id
    WHERE t.from_user_id = ? OR t.to_user_id = ?
    ORDER BY t.created_at DESC
  `;

  db.all(query, [requestedId, requestedId], (err, rows) => {
    if (err) {
      return next(err);
    }

    res.json(rows);
  });
});

app.post('/api/transfer', authMiddleware, (req, res, next) => {
  const { toUsername, amount, note } = req.body;
  const fromUserId = req.user.id;
  const transferAmount = Number(amount);

  if (!toUsername || !transferAmount || transferAmount <= 0) {
    return res.status(400).json({ error: 'Invalid transfer payload' });
  }

  db.get('SELECT * FROM users WHERE id = ?', [fromUserId], (srcErr, sourceUser) => {
    if (srcErr) {
      return next(srcErr);
    }

    if (!sourceUser) {
      return res.status(404).json({ error: 'Source user not found' });
    }

    if (sourceUser.balance < transferAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [toUsername], (dstErr, targetUser) => {
      if (dstErr) {
        return next(dstErr);
      }

      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }

      db.serialize(() => {
        db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [transferAmount, sourceUser.id]);
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [transferAmount, targetUser.id]);
        db.run(
          'INSERT INTO transactions (from_user_id, to_user_id, amount, note) VALUES (?, ?, ?, ?)',
          [sourceUser.id, targetUser.id, transferAmount, note || ''],
          (txnErr) => {
            if (txnErr) {
              return next(txnErr);
            }

            res.json({ message: 'Transfer completed', to: targetUser.username, amount: transferAmount });
          }
        );
      });
    });
  });
});

app.get('/api/admin/users', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  db.all('SELECT id, username, role, balance FROM users ORDER BY id ASC', (err, users) => {
    if (err) {
      return next(err);
    }

    res.json(users);
  });
});

app.use((err, req, res, next) => {
  if (config.debugMode) {
    console.error(err.stack);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`VulnBank server running on http://localhost:${PORT}`);
});
