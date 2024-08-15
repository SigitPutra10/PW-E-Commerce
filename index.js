const express = require('express');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController'); 

const app = express();

// Middleware untuk parsing body request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rute untuk login
app.post('/login', authController.login);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
