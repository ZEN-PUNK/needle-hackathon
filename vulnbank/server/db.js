const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '..', 'database', 'vulnbank.db');
const db = new sqlite3.Database(dbPath);

const SALT_ROUNDS = 10;

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        balance REAL DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user_id INTEGER,
        to_user_id INTEGER,
        amount REAL,
        note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
      if (err) {
        return;
      }

      if (row.count === 0) {
        const seedUsers = [
          { username: 'alice', password: 'password123', role: 'user', balance: 2500 },
          { username: 'bob', password: 'password123', role: 'user', balance: 1500 },
          { username: 'admin', password: 'admin123', role: 'admin', balance: 9000 }
        ];

        seedUsers.forEach(({ username, password, role, balance }) => {
          bcrypt.hash(password, SALT_ROUNDS, (hashErr, hash) => {
            if (hashErr) return;
            db.run(
              'INSERT INTO users (username, password, role, balance) VALUES (?, ?, ?, ?)',
              [username, hash, role, balance]
            );
          });
        });
      }
    });
  });
}

module.exports = {
  db,
  initDb
};
