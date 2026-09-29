const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./app.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER,
      role TEXT DEFAULT 'user'
    )
  `);

  // Add some sample data
  db.run(`
    INSERT OR IGNORE INTO users (id, name, email, age, role)
    VALUES
      (1, 'John', 'john@example.com', 25, 'user'),
      (2, 'Alice', 'alice@example.com', 30, 'admin')
  `);
});

module.exports = db;