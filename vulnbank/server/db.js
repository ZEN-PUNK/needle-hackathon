const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'database', 'vulnbank.db');
const db = new sqlite3.Database(dbPath);

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
        db.run("INSERT INTO users (username, password, role, balance) VALUES ('alice', 'password123', 'user', 2500)");
        db.run("INSERT INTO users (username, password, role, balance) VALUES ('bob', 'password123', 'user', 1500)");
        db.run("INSERT INTO users (username, password, role, balance) VALUES ('admin', 'admin123', 'admin', 9000)");
      }
    });
  });
}

module.exports = {
  db,
  initDb
};
