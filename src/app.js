const express = require('express');
const app = express();

app.use(express.json());
app.use(require('./controllers/authController'));

module.exports = app;