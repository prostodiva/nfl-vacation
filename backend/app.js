//backend - create an express app
const express = require('express');
const cors = require('cors');
const basicMiddleware = require('./middleware/basic');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());

app.use(basicMiddleware);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

app.use(errorHandler);

module.exports = app;