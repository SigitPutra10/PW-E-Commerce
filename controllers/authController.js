const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register user
exports.register = (req, res) => {
  const { username, email, password, role } = req.body;

  // Hash the password before saving to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;

    // Insert new user into the database
    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, role], (err, result) => {
      if (err) throw err;
      res.json({ message: 'User registered successfully' });
    });
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = results[0];

    // Compare the password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email, role: user.role }, 'secretkey', { expiresIn: '1h' });
      res.json({ message: 'Authentication successful', token });
    });
  });
};
