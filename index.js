const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Pastikan path ini benar

const app = express();

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan authRoutes untuk route yang berhubungan dengan autentikasi
app.use('/auth', authRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
