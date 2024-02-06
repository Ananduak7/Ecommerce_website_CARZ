const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to SQLite database (create one if it doesn't exist)
const db = new sqlite3.Database('users.db');

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
  )
`);

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Insert user into the database
  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.status(200).json({ success: true, message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!row) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    return res.status(200).json({ success: true, message: 'Login successful' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
