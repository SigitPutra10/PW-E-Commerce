const bcrypt = require('bcryptjs');

// Password yang ingin di-hash
const plainPassword = '12345';

// Jumlah salt rounds (10 adalah nilai yang umum digunakan)
const saltRounds = 10;

// Generate hash untuk password tersebut
bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed Password:', hash);
});
