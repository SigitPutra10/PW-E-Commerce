const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [
  { email: "admin@gmail.com", password: "$2a$10$Pza2/xyjYwoPDqkSAowCAOFQGQ6LP.WWtxtGHulJyXa5I7L/N8ZEK" } // hashed password dari '12345'
];

exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Membandingkan password yang di-hash
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Jika password cocok, generate token JWT
    const token = jwt.sign({ email: user.email }, 'secretkey', { expiresIn: '1h' });
    res.json({ message: 'Authentication successful', token });
  });
};
